# Run from client/ — forwards to project root install
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root
Write-Host "Switched to project root: $Root" -ForegroundColor Gray
if (Test-Path (Join-Path $Root "install.ps1")) {
    & (Join-Path $Root "install.ps1")
} else {
    npm install
}
