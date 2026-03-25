<#
.SYNOPSIS
    Deterministic check-in script with semantic version bumping, CHANGELOG update,
    and optional Dry-Run mode.

.DESCRIPTION
    - Ensures VERSION exists (creates 0.0.1 if missing)
    - Increments patch with cascading rollover (x.y.9 -> x.(y+1).0)
    - Updates VERSION, package.json, and CHANGELOG.md
    - Runs verify gate (compile + lint + tests)
    - Commits and pushes (unless -DryRun is used)
    - Dry-Run mode simulates write and git mutation steps

.USAGE
    .\scripts\checkin.ps1 [-Message "your commit message"] [-DryRun]

.EXAMPLES
    .\scripts\checkin.ps1

    .\scripts\checkin.ps1 -Message "signature provider hardening"
        Bumps version, updates CHANGELOG, runs verify, commits, and pushes.

    .\scripts\checkin.ps1 -DryRun
        Shows what WOULD happen, without writing files or mutating git state.
#>

param(
    [Parameter(Mandatory = $false)]
    [string]$Message = "checkpoint",

    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-DryRun {
    param([string]$Text)
    if ($DryRun) {
        Write-Host "[DRY RUN] $Text" -ForegroundColor Yellow
    }
}

function Invoke-CheckedCommand {
    param(
        [Parameter(Mandatory = $true)][string]$Title,
        [Parameter(Mandatory = $true)][scriptblock]$Action
    )

    Write-Host "`n--- $Title ---" -ForegroundColor DarkCyan
    & $Action
    if ($LASTEXITCODE -ne 0) {
        throw "$Title failed with exit code $LASTEXITCODE."
    }
}

function Update-Changelog {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Version,
        [switch]$DryRun
    )

    $today = Get-Date -Format 'yyyy-MM-dd'
    $releaseHeader = "## [$Version] - $today"
    $fallbackBody = "### Added`r`n- Version bump via check-in script."

    if (-not (Test-Path $Path)) {
        $initial = @"
# Changelog

All notable changes to the **cosmosdb-toolkit** extension will be documented in this file.

## [Unreleased]

## [$Version] - $today

### Added
- Version bump via check-in script.

"@

        if ($DryRun) {
            Write-DryRun "Would create CHANGELOG.md with Unreleased and $Version section"
        }
        else {
            Set-Content -Path $Path -Value $initial -Encoding utf8
        }
        return
    }

    $content = Get-Content -Path $Path -Raw

    if ($content -match [regex]::Escape("## [$Version]")) {
        Write-Host "CHANGELOG already contains version $Version. Skipping insertion." -ForegroundColor Yellow
        return
    }

    # Extract anything written under [Unreleased] so we can move it into the new release block.
    # Capture: everything between ## [Unreleased] and the next ## heading (or end of file).
    $unreleasedBody = ''
    if ($content -match '(?ms)^## \[Unreleased\][^\S\r\n]*\r?\n(.*?)(?=^## |\Z)') {
        $unreleasedBody = $Matches[1].Trim()
    }

    # Use harvested content if non-trivial, otherwise fall back to generic note.
    $releaseBody = if ($unreleasedBody -ne '') { $unreleasedBody } else { $fallbackBody }
    $releaseBlock = "$releaseHeader`r`n`r`n$releaseBody`r`n"

    if ($content -match '(?m)^## \[Unreleased\]') {
        # Replace the entire [Unreleased] section (header + body) with an empty header
        # followed by the new versioned release block.
        $updated = [regex]::Replace(
            $content,
            '(?ms)^## \[Unreleased\][^\S\r\n]*\r?\n.*?(?=^## |\Z)',
            "## [Unreleased]`r`n`r`n$releaseBlock`r`n",
            [System.Text.RegularExpressions.RegexOptions]::Multiline
        )
    }
    else {
        $updated = $content.TrimEnd() + "`r`n`r`n## [Unreleased]`r`n`r`n$releaseBlock"
    }

    if ($DryRun) {
        Write-DryRun "Would insert version $Version section into CHANGELOG.md"
    }
    else {
        Set-Content -Path $Path -Value $updated -Encoding utf8
    }
}

function Update-PackageVersion {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Version,
        [switch]$DryRun
    )

    if (-not (Test-Path $Path)) {
        throw "package.json not found at $Path"
    }

    $content = Get-Content -Path $Path -Raw
    $updated = [regex]::Replace(
        $content,
        '"version"\s*:\s*"[^"]+"',
        ('"version": "{0}"' -f $Version),
        1
    )

    if ($updated -eq $content) {
        throw 'Failed to update package.json version field. Pattern not found.'
    }

    if ($DryRun) {
        Write-DryRun "Would update package.json version to $Version"
    }
    else {
        Set-Content -Path $Path -Value $updated -Encoding utf8
    }
}

Write-Host '=== CosmosDB Toolkit: Check-in Script ===' -ForegroundColor Cyan
if ($DryRun) {
    Write-Host 'Running in DRY-RUN mode (no files or git state will be mutated)' -ForegroundColor Yellow
}

$versionFile = 'VERSION'
$packageJsonPath = 'package.json'
$changelogPath = 'CHANGELOG.md'

# Ensure we are in a git repository first.
Invoke-CheckedCommand -Title 'Git Status' -Action { git status --short }

# Rebase before modifying files so post-rebase state is what gets validated.
if ($DryRun) {
    Write-DryRun 'Would run: git pull --rebase --autostash'
}
else {
    Invoke-CheckedCommand -Title 'Git Pull (rebase + autostash)' -Action { git pull --rebase --autostash }
}

# Ensure VERSION exists.
if (-not (Test-Path $versionFile)) {
    if ($DryRun) {
        Write-DryRun 'Would create VERSION file with 0.0.1'
    }
    else {
        Write-Host 'VERSION file not found. Creating with 0.0.1' -ForegroundColor Yellow
        Set-Content -Path $versionFile -Value '0.0.1' -Encoding utf8 -NoNewline
    }
}

$currentVersion = (Get-Content -Path $versionFile -Raw).Trim()
if ($currentVersion -notmatch '^(\d+)\.(\d+)\.(\d+)$') {
    throw "Invalid VERSION format '$currentVersion'. Expected major.minor.patch"
}

$major = [int]$Matches[1]
$minor = [int]$Matches[2]
$patch = [int]$Matches[3]

Write-Host "Current version: $currentVersion" -ForegroundColor Yellow

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

if ($DryRun) {
    Write-DryRun "Would update VERSION to $newVersion"
}
else {
    Set-Content -Path $versionFile -Value $newVersion -Encoding utf8 -NoNewline
}

Write-Host 'Updating package.json version...' -ForegroundColor DarkCyan
Update-PackageVersion -Path $packageJsonPath -Version $newVersion -DryRun:$DryRun

Write-Host 'Updating CHANGELOG.md...' -ForegroundColor DarkCyan
Update-Changelog -Path $changelogPath -Version $newVersion -DryRun:$DryRun

# Validate the exact to-be-committed state.
Invoke-CheckedCommand -Title 'Verify (npm run verify)' -Action { npm run verify }

if ($DryRun) {
    Write-DryRun 'Would run: git add -A'
    Write-DryRun "Would run: git commit -m `"$Message (v$newVersion)`""
    Write-DryRun 'Would run: git push'
    Write-Host "`n=== DRY RUN COMPLETE (v$newVersion) — No changes written ===" -ForegroundColor Yellow
    exit 0
}

Invoke-CheckedCommand -Title 'Git Add' -Action { git add -A }
Invoke-CheckedCommand -Title 'Git Commit' -Action { git commit -m "$Message (v$newVersion)" }
Invoke-CheckedCommand -Title 'Git Push' -Action { git push }

Write-Host "`n=== Check-in Complete (v$newVersion) ===" -ForegroundColor Green
