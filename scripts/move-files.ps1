# repo root
Set-Location C:\Users\wayne\source\repos\Projects\cosmosdb-toolkit

# ensure canonical folder
New-Item -ItemType Directory -Force assets/icon | Out-Null

# move any files from icon- into assets/icon
if (Test-Path assets/icon/icon-) {
  Get-ChildItem assets/icon/icon- -File | ForEach-Object {
    Move-Item $_.FullName assets/icon/ -Force
  }
  Remove-Item assets/icon/icon- -Recurse -Force
}

# set package.json icon to a canonical file if needed (choose one existing file)
$pkg = Get-Content package.json -Raw | ConvertFrom-Json
$iconFile = Get-ChildItem assets/icon -File | Select-Object -First 1
if ($iconFile) {
  $pkg.icon = "assets/icon/$($iconFile.Name)"
  $pkg | ConvertTo-Json -Depth 100 | Set-Content package.json -Encoding UTF8
}

# optional cleanup of sensitive link
(Get-Content assets/links.txt) |
  Where-Object { $_ -notmatch 'dev\.azure\.com/.+/_usersSettings/tokens' } |
  Set-Content assets/links.txt -Encoding UTF8

# show result
(Get-Content package.json | Select-String '"icon"')
Get-ChildItem assets/icon -File