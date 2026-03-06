<#
.SYNOPSIS
    Deterministic check-in script with semantic version bumping, CHANGELOG update,
    and optional Dry-Run mode.

.DESCRIPTION
    - Reads VERSION file (creates 0.0.1 if missing)
    - Increments patch with cascading rollover
    - Updates VERSION, package.json, and CHANGELOG.md
    - Runs compile, lint, test
    - Commits, rebases, and pushes (unless -DryRun is used)
    - Dry-Run mode simulates all actions without modifying any files

.USAGE
    .\checkin.ps1 [-Message "your commit message"] [-DryRun]

.EXAMPLES
    .\checkin.ps1
        Runs the full pipeline using the default commit message "checkpoint".

    .\checkin.ps1 -Message "signature provider hardening"
        Bumps version, updates CHANGELOG, compiles, lints, tests,
        commits with the provided message, rebases, and pushes.

    .\checkin.ps1 -DryRun
        Shows what WOULD happen, without modifying any files.

.NOTES
    - VERSION is auto-incremented (patch with cascading rollover).
    - CHANGELOG.md is updated by inserting a new version block above [Unreleased].
    - package.json version is kept in sync with VERSION.
    - The script stops immediately on build, lint, or test failure.
    - Dry-Run mode performs all validation steps but does not write or commit anything.
#>

param(
    [Parameter(Mandatory = $false)]
    [string]$Message = "checkpoint",

    [switch]$DryRun
)

function Write-DryRun {
    param([string]$Text)
    if ($DryRun) {
        Write-Host "[DRY RUN] $Text" -ForegroundColor Yellow
    }
}

Write-Host "=== CosmosDB Toolkit: Check-in Script ===" -ForegroundColor Cyan
if ($DryRun) {
    Write-Host "Running in DRY-RUN mode (no changes will be written)" -ForegroundColor Yellow
}

# --- Ensure VERSION file exists ---
$versionFile = "VERSION"

if (-not (Test-Path $versionFile)) {
    if ($DryRun) {
        Write-DryRun "Would create VERSION file with 0.0.1"
    } else {
        Write-Host "VERSION file not found. Creating with 0.0.1" -ForegroundColor Yellow
        "0.0.1" | Out-File $versionFile -Encoding utf8
    }
}

# --- Read version ---
$currentVersion = Get-Content $versionFile -Raw
Write-Host "Current version: $currentVersion" -ForegroundColor Yellow

# --- Parse version ---
$parts = $currentVersion.Split(".")
$major = [int]$parts[0]
$minor = [int]$parts[1]
$patch = [int]$parts[2]

# --- Increment patch with cascading rollover ---
$patch++
if ($patch -gt 9) {
    $patch = 0
    $minor++
    if ($minor -gt 9) {
        $minor = 0
        $major++
    }
}

$newVersion = "$major.$minor.$patch"
Write-Host "New version: $newVersion" -ForegroundColor Green

# --- Write new version to VERSION file ---
if ($DryRun) {
    Write-DryRun "Would update VERSION to $newVersion"
} else {
    $newVersion | Out-File $versionFile -Encoding utf8
}

# --- Update package.json version field ---
Write-Host "Updating package.json version..." -ForegroundColor DarkCyan
$packageJson = Get-Content package.json -Raw | ConvertFrom-Json
$packageJson.version = $newVersion

if ($DryRun) {
    Write-DryRun "Would update package.json version to $newVersion"
} else {
    $packageJson | ConvertTo-Json -Depth 20 | Out-File package.json -Encoding utf8
}

# --- Update CHANGELOG.md ---
$changelog = "CHANGELOG.md"
if (-not (Test-Path $changelog)) {
    if ($DryRun) {
        Write-DryRun "Would create CHANGELOG.md with initial version block"
    } else {
        Write-Host "CHANGELOG.md not found. Creating a new one." -ForegroundColor Yellow
        @(
            "# Changelog"
            ""
            "## [$newVersion] - Unreleased"
            ""
        ) | Out-File $changelog -Encoding utf8
    }
}
else {
    Write-Host "Updating CHANGELOG.md..." -ForegroundColor DarkCyan

    $content = Get-Content $changelog -Raw

    $updated = $content -replace "(## 

\[.*?\]

)", "## [$newVersion] - Unreleased`r`n`r`n`$1"

    if ($DryRun) {
        Write-DryRun "Would insert new version block into CHANGELOG.md"
    } else {
        $updated | Out-File $changelog -Encoding utf8
    }
}

# --- Git status ---
Write-Host "`n--- Git Status ---" -ForegroundColor DarkCyan
git status

# --- Build ---
Write-Host "`n--- Build (npm run compile) ---" -ForegroundColor DarkCyan
npm run compile
if ($LASTEXITCODE -ne 0) { Write-Host "Build failed." -ForegroundColor Red; exit 1 }

# --- Lint ---
Write-Host "`n--- Lint (npm run lint) ---" -ForegroundColor DarkCyan
npm run lint
if ($LASTEXITCODE -ne 0) { Write-Host "Lint failed." -ForegroundColor Red; exit 1 }

# --- Test ---
Write-Host "`n--- Test (npm test) ---" -ForegroundColor DarkCyan
npm test
if ($LASTEXITCODE -ne 0) { Write-Host "Tests failed." -ForegroundColor Red; exit 1 }

# --- Git add ---
if ($DryRun) {
    Write-DryRun "Would run: git add -A"
} else {
    Write-Host "`n--- Git Add ---" -ForegroundColor DarkCyan
    git add -A
}

# --- Git commit ---
if ($DryRun) {
    Write-DryRun "Would commit with message: $Message (v$newVersion)"
} else {
    Write-Host "`n--- Git Commit ---" -ForegroundColor DarkCyan
    git commit -m "$Message (v$newVersion)"
}

# --- Git pull (rebase) ---
if ($DryRun) {
    Write-DryRun "Would run: git pull --rebase"
} else {
    Write-Host "`n--- Git Pull (rebase) ---" -ForegroundColor DarkCyan
    git pull --rebase
}

# --- Git push ---
if ($DryRun) {
    Write-DryRun "Would run: git push"
    Write-Host "`n=== DRY RUN COMPLETE (v$newVersion) — No changes written ===" -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "`n--- Git Push ---" -ForegroundColor DarkCyan
    git push
}

Write-Host "`n=== Check-in Complete (v$newVersion) ===" -ForegroundColor Green
