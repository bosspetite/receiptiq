# ReceiptIQ — install dependencies (run from this folder in PowerShell)
$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
Set-Location $Root

Write-Host ""
Write-Host "ReceiptIQ install" -ForegroundColor Cyan
Write-Host "-----------------" -ForegroundColor Cyan

if (-not (Test-Path (Join-Path $Root "package.json"))) {
    Write-Host "ERROR: package.json not found. Run this script from inside the receiptiq folder." -ForegroundColor Red
    exit 1
}
if (-not (Test-Path (Join-Path $Root "server"))) {
    Write-Host "ERROR: server folder not found. You may be in the wrong directory." -ForegroundColor Red
    exit 1
}
if (-not (Test-Path (Join-Path $Root "client"))) {
    Write-Host "ERROR: client folder not found. You may be in the wrong directory." -ForegroundColor Red
    exit 1
}

Write-Host "Project root: $Root" -ForegroundColor Gray
Write-Host "Running npm install (workspaces: client + server)..." -ForegroundColor Gray
Write-Host ""

npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install failed." -ForegroundColor Red
    exit $LASTEXITCODE
}

$envExample = Join-Path $Root ".env.example"
$serverEnv = Join-Path $Root "server\.env"
$clientEnv = Join-Path $Root "client\.env"

if (-not (Test-Path $serverEnv) -and (Test-Path $envExample)) {
    Copy-Item $envExample $serverEnv
    Write-Host "Created server\.env from .env.example — edit it with your Supabase + OpenAI keys." -ForegroundColor Yellow
}
$clientEnvExample = Join-Path $Root "client\.env.example"
if (-not (Test-Path $clientEnv) -and (Test-Path $clientEnvExample)) {
    Copy-Item $clientEnvExample $clientEnv
    Write-Host "Created client\.env from client\.env.example — add your Supabase URL + anon key, then restart dev." -ForegroundColor Yellow
} elseif (-not (Test-Path $clientEnv) -and (Test-Path $envExample)) {
    Copy-Item $envExample $clientEnv
    Write-Host "Created client\.env from root .env.example — set VITE_SUPABASE_* and restart dev." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Done." -ForegroundColor Green
Write-Host "Start both apps (one terminal):" -ForegroundColor Green
Write-Host "  npm run dev     (same as: npm run dev:all)" -ForegroundColor White
Write-Host ""
Write-Host "Or two terminals:" -ForegroundColor Green
Write-Host "  npm run dev:server" -ForegroundColor White
Write-Host "  npm run dev:client" -ForegroundColor White
Write-Host ""
