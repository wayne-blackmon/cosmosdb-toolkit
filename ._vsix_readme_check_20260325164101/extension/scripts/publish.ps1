#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Verifies, packages, and publishes the VS Code extension.

.DESCRIPTION
    - Validates repository/tooling prerequisites
    - Runs the repo's canonical verification gate (npm run verify)
    - Supports VSCE authentication via VSCE_PAT, secure prompt, or existing vsce login state
    - Produces a deterministic VSIX artifact
    - Optionally stops after packaging or performs the publish step

.USAGE
    .\scripts\publish.ps1 [-DryRun] [-PackageOnly] [-SkipVerify] [-AllowDirty] [-PromptForPat] [-VsixPath out.vsix]
#>

param(
    [switch]$DryRun,
    [switch]$PackageOnly,
    [switch]$SkipVerify,
    [switch]$AllowDirty,
    [switch]$PromptForPat,
    [string]$VsixPath,
    [int]$NetworkRetryCount = 3,
    [int]$NetworkRetryDelaySeconds = 3
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

function Test-IsTransientNetworkError {
    param([string]$Text)

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return $false
    }

    # Retry only for transient transport failures that often succeed on a later attempt.
    return ($Text -match '(?i)ECONNRESET|ETIMEDOUT|EAI_AGAIN|ECONNREFUSED|socket hang up|TLS handshake timeout|connection.*reset')
}

function Invoke-VsceCommandWithRetry {
    param(
        [Parameter(Mandatory = $true)][string]$Title,
        [Parameter(Mandatory = $true)][scriptblock]$Action,
        [int]$MaxAttempts = 3,
        [int]$InitialDelaySeconds = 3,
        [switch]$CaptureOutput
    )

    $attempt = 1
    $delaySeconds = [Math]::Max(1, $InitialDelaySeconds)
    $attemptLimit = [Math]::Max(1, $MaxAttempts)

    while ($true) {
        if ($attempt -eq 1) {
            Write-Host "`n--- $Title ---" -ForegroundColor DarkCyan
        }
        else {
            Write-Host "`n--- $Title (attempt $attempt/$attemptLimit) ---" -ForegroundColor DarkCyan
        }

        $output = @(& $Action 2>&1)
        $exitCode = $LASTEXITCODE

        foreach ($line in $output) {
            Write-Host $line
        }

        if ($exitCode -eq 0) {
            if ($CaptureOutput) {
                return $output
            }

            return
        }

        $combinedText = ($output | Out-String)
        $isRetryable = Test-IsTransientNetworkError -Text $combinedText
        if (($attempt -lt $attemptLimit) -and $isRetryable) {
            Write-Host ("Transient network error detected. Retrying in {0}s..." -f $delaySeconds) -ForegroundColor Yellow
            Start-Sleep -Seconds $delaySeconds
            $attempt += 1
            $delaySeconds = [Math]::Min($delaySeconds * 2, 30)
            continue
        }

        throw "$Title failed with exit code $exitCode."
    }
}

function Get-RequiredCommand {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$InstallHint
    )

    $command = Get-Command $Name -ErrorAction SilentlyContinue
    if (-not $command) {
        throw "Required command '$Name' was not found. $InstallHint"
    }

    return $command
}

function Get-PackageMetadata {
    param([Parameter(Mandatory = $true)][string]$Path)

    if (-not (Test-Path $Path)) {
        throw "package.json not found at $Path"
    }

    $raw = Get-Content -Path $Path -Raw
    $json = $raw | ConvertFrom-Json

    if (-not $json.name) { throw 'package.json is missing required field: name' }
    if (-not $json.publisher) { throw 'package.json is missing required field: publisher' }
    if (-not $json.version) { throw 'package.json is missing required field: version' }

    return $json
}

function Test-GitWorktreeClean {
    $statusLines = @(git status --porcelain)
    if ($LASTEXITCODE -ne 0) {
        throw 'git status failed.'
    }

    return ($statusLines.Count -eq 0)
}

function Resolve-VsixOutputPath {
    param(
        [Parameter(Mandatory = $true)]$Package,
        [string]$RequestedPath,
        [Parameter(Mandatory = $true)][string]$RepoRoot
    )

    if ($RequestedPath) {
        return $RequestedPath
    }

    return (Join-Path -Path $RepoRoot -ChildPath ("{0}-{1}.vsix" -f $Package.name, $Package.version))
}

function Convert-SecureStringToPlainText {
    param([Parameter(Mandatory = $true)][Security.SecureString]$SecureString)

    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureString)
    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    }
    finally {
        if ($bstr -ne [IntPtr]::Zero) {
            [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
        }
    }
}

function Get-VscePatFromPrompt {
    $securePat = Read-Host 'Enter VS Code Marketplace PAT' -AsSecureString
    if (-not $securePat) {
        throw 'No PAT was entered.'
    }

    $plainTextPat = Convert-SecureStringToPlainText -SecureString $securePat
    if ([string]::IsNullOrWhiteSpace($plainTextPat)) {
        throw 'No PAT was entered.'
    }

    return $plainTextPat
}

function Get-VsceAuthMode {
    param([Parameter(Mandatory = $true)][string]$Publisher)

    if (-not [string]::IsNullOrWhiteSpace($env:VSCE_PAT)) {
        return 'pat-env'
    }

    if ($PromptForPat) {
        if ($DryRun) {
            Write-DryRun 'Would prompt for VSCE_PAT securely at runtime'
            return 'pat-prompt'
        }

        $env:VSCE_PAT = Get-VscePatFromPrompt
        return 'pat-prompt'
    }

    return 'login'
}

function Test-VsceAuthentication {
    param(
        [Parameter(Mandatory = $true)][string]$Publisher,
        [Parameter(Mandatory = $true)][string]$AuthMode
    )

    if ($DryRun) {
        switch ($AuthMode) {
            'pat-env' { Write-DryRun "Would verify VSCE authentication using VSCE_PAT from the environment for publisher '$Publisher'" }
            'pat-prompt' { Write-DryRun "Would verify VSCE authentication using the securely prompted PAT for publisher '$Publisher'" }
            default { Write-DryRun "Would verify that VSCE is authenticated via stored login for publisher '$Publisher'" }
        }

        return
    }

    $publishers = @(
        Invoke-VsceCommandWithRetry -Title 'VSCE Publisher Probe' -Action { vsce ls-publishers } -CaptureOutput -MaxAttempts $NetworkRetryCount -InitialDelaySeconds $NetworkRetryDelaySeconds
    )
    if ($LASTEXITCODE -ne 0) {
        switch ($AuthMode) {
            'pat-env' { throw "VSCE_PAT is set, but authentication failed. Ensure the token is valid for publisher '$Publisher'." }
            'pat-prompt' { throw "The supplied PAT was rejected. Ensure it is valid for publisher '$Publisher'." }
            default { throw "VSCE is not authenticated. Run: vsce login $Publisher, set VSCE_PAT, or rerun with -PromptForPat." }
        }
    }

    $normalizedPublishers = $publishers | ForEach-Object { $_.Trim() } | Where-Object { $_ }
    if ($normalizedPublishers -notcontains [string]$Publisher) {
        switch ($AuthMode) {
            'pat-env' { throw "VSCE_PAT is valid, but it does not include publisher '$Publisher'." }
            'pat-prompt' { throw "The supplied PAT is valid, but it does not include publisher '$Publisher'." }
            default { throw "VSCE is authenticated, but not for publisher '$Publisher'. Run: vsce login $Publisher, set VSCE_PAT, or rerun with -PromptForPat." }
        }
    }
}

Write-Host '=== CosmosDB Toolkit: Publish Script ===' -ForegroundColor Cyan
if ($DryRun) {
    Write-Host 'Running in DRY-RUN mode (no package or publish mutations will occur)' -ForegroundColor Yellow
}

Push-Location (Split-Path $PSScriptRoot -Parent)
$repoRoot = $PSScriptRoot | Split-Path -Parent
$previousVscePat = $env:VSCE_PAT
$restoreVscePat = $false
try {
    Write-Host 'Verifying extension environment...' -ForegroundColor Cyan

    if (-not (Test-Path '.\package.json')) {
        throw 'Must run from the extension root.'
    }

    Get-RequiredCommand -Name 'git' -InstallHint 'Install Git and ensure it is on PATH.' | Out-Null
    Get-RequiredCommand -Name 'npm' -InstallHint 'Install Node.js/npm and ensure it is on PATH.' | Out-Null
    Get-RequiredCommand -Name 'vsce' -InstallHint 'Install VSCE globally (npm install -g @vscode/vsce) and ensure it is on PATH.' | Out-Null

    $package = Get-PackageMetadata -Path '.\package.json'
    $vsixOutputPath = Resolve-VsixOutputPath -Package $package -RequestedPath $VsixPath -RepoRoot $repoRoot
    $authMode = Get-VsceAuthMode -Publisher $package.publisher
    if ($authMode -eq 'pat-prompt' -and -not $DryRun) {
        $restoreVscePat = $true
    }

    Write-Host ("Extension: {0} v{1} (publisher: {2})" -f $package.displayName, $package.version, $package.publisher) -ForegroundColor Green
    Write-Host ("VSIX output: {0}" -f $vsixOutputPath) -ForegroundColor Green

    if (-not $AllowDirty) {
        if (-not (Test-GitWorktreeClean)) {
            throw 'Working tree is not clean. Commit or stash changes before publishing, or rerun with -AllowDirty if you intentionally want to publish from the current state.'
        }
    }
    else {
        Write-Host 'Allowing publish from a dirty working tree.' -ForegroundColor Yellow
    }

    if (-not $SkipVerify) {
        if ($DryRun) {
            Write-DryRun 'Would run: npm run verify'
        }
        else {
            Invoke-CheckedCommand -Title 'Verify (npm run verify)' -Action { npm run verify }
        }
    }
    else {
        Write-Host 'Skipping verification gate by request.' -ForegroundColor Yellow
    }

    Write-Host 'Verifying VSCE authentication...' -ForegroundColor Cyan
    Test-VsceAuthentication -Publisher $package.publisher -AuthMode $authMode

    Write-Host 'Packaging extension...' -ForegroundColor Cyan
    if ($DryRun) {
        Write-DryRun ("Would run: vsce package --out `"{0}`"" -f $vsixOutputPath)
    }
    else {
        if (Test-Path $vsixOutputPath) {
            Remove-Item -Path $vsixOutputPath -Force
        }

        Invoke-CheckedCommand -Title 'VSCE Package' -Action { vsce package --out $vsixOutputPath }

        if (-not (Test-Path $vsixOutputPath)) {
            throw "Packaging failed: expected VSIX was not produced at '$vsixOutputPath'."
        }
    }

    if ($PackageOnly) {
        if ($DryRun) {
            Write-Host 'Dry run complete. Package-only mode would stop after VSIX creation.' -ForegroundColor Yellow
        }
        else {
            Write-Host ("Package-only mode complete. VSIX ready at: {0}" -f $vsixOutputPath) -ForegroundColor Green
        }

        exit 0
    }

    Write-Host 'Publishing to Marketplace...' -ForegroundColor Cyan
    if ($DryRun) {
        Write-DryRun 'Would run: vsce publish'
        Write-Host 'Dry run complete. No publish was performed.' -ForegroundColor Yellow
    }
    else {
        Invoke-VsceCommandWithRetry -Title 'VSCE Publish' -Action { vsce publish } -MaxAttempts $NetworkRetryCount -InitialDelaySeconds $NetworkRetryDelaySeconds
        Write-Host 'Publish complete.' -ForegroundColor Green
    }
}
finally {
    if ($restoreVscePat) {
        $env:VSCE_PAT = $previousVscePat
    }

    Pop-Location
}
