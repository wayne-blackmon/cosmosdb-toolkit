<#
.SYNOPSIS
    Deterministic check-in script with semantic version bumping and CHANGELOG update.

.DESCRIPTION
    - Reads VERSION file (creates 0.0.1 if missing)
    - Increments patch with cascading rollover
    - Updates VERSION, package.json, and CHANGELOG.md
    - Runs compile, lint, test
    - Commits and pushes

.USAGE
    .\checkin.ps1 [-Message "your commit message"]

.EXAMPLES
    .\checkin.ps1
        Runs the full pipeline using the default commit message "checkpoint".

    .\checkin.ps1 -Message "test suite: advanced setup complete"
        Bumps version, updates CHANGELOG, compiles, lints, tests,
        commits with the provided message, rebases, and pushes.

.NOTES
    - VERSION is auto-incremented (patch with cascading rollover).
    - CHANGELOG.md is updated by inserting a new version block above [Unreleased].
    - package.json version is kept in sync with VERSION.
    - The script stops immediately on build, lint, or test failure.
#>


param(
    [Parameter(Mandatory = $false)]
    [string]$Message = "checkpoint"
)

Write-Host "=== CosmosDB Toolkit: Check-in Script ===" -ForegroundColor Cyan

# --- Ensure VERSION file exists ---
$versionFile = "VERSION"

if (-not (Test-Path $versionFile)) {
    Write-Host "VERSION file not found. Creating with 0.0.1" -ForegroundColor Yellow
    "0.0.1" | Out-File $versionFile -Encoding utf8
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
$newVersion | Out-File $versionFile -Encoding utf8

# --- Update package.json version field ---
Write-Host "Updating package.json version..." -ForegroundColor DarkCyan
$packageJson = Get-Content package.json -Raw | ConvertFrom-Json
$packageJson.version = $newVersion
$packageJson | ConvertTo-Json -Depth 20 | Out-File package.json -Encoding utf8

# --- Update CHANGELOG.md ---
$changelog = "CHANGELOG.md"
if (-not (Test-Path $changelog)) {
    Write-Host "CHANGELOG.md not found. Creating a new one." -ForegroundColor Yellow
    @(
        "# Changelog"
        ""
        "## [$newVersion] - Unreleased"
        ""
    ) | Out-File $changelog -Encoding utf8
}
else {
    Write-Host "Updating CHANGELOG.md..." -ForegroundColor DarkCyan

    $content = Get-Content $changelog -Raw

    # FIXED REGEX — matches:
    #   ## [Unreleased]
    #   ## [0.0.3]
    #   ## [anything]
    #
    # Inserts new version block ABOVE the first version header.
    $updated = $content -replace "(## 

\[.*?\]

)", "## [$newVersion] - Unreleased`r`n`r`n`$1"

    $updated | Out-File $changelog -Encoding utf8
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
Write-Host "`n--- Git Add ---" -ForegroundColor DarkCyan
git add -A

# --- Git commit ---
Write-Host "`n--- Git Commit ---" -ForegroundColor DarkCyan
git commit -m "$Message (v$newVersion)"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Nothing to commit or commit failed." -ForegroundColor Yellow
}

# --- Git pull (rebase) ---
Write-Host "`n--- Git Pull (rebase) ---" -ForegroundColor DarkCyan
git pull --rebase
if ($LASTEXITCODE -ne 0) {
    Write-Host "Rebase failed. Resolve conflicts manually." -ForegroundColor Red
    exit 1
}

# --- Git push ---
Write-Host "`n--- Git Push ---" -ForegroundColor DarkCyan
git push
if ($LASTEXITCODE -ne 0) { Write-Host "Push failed." -ForegroundColor Red; exit 1 }

Write-Host "`n=== Check-in Complete (v$newVersion) ===" -ForegroundColor Green
