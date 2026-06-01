# Get Current directory
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Starting MERN Project..." -ForegroundColor Green


# Terminal Track Status
$backendPort = 5000
$frontendPort = 5173

$backendCheck = netstat -ano | findstr ":$backendPort"
$frontendCheck = netstat -ano | findstr ":$frontendPort"


# Delay 1 Seconds
Start-Sleep -Seconds 1

# Start Backend Server 
Write-Host "[1/3] Checking Backend..." -ForegroundColor Cyan

if ($backendCheck) {
    Write-Host "Backend already running on port $backendPort" -ForegroundColor Yellow
} else {
    Write-Host "[START] Starting Backend..." -ForegroundColor Green

    $backend = Start-Process cmd -WindowStyle Hidden -PassThru -WorkingDirectory "$projectPath\backend" -ArgumentList "/c npm run dev"
}

# Delay 2 Seconds
Start-Sleep -Seconds 2

# Start Frontend Server 
Write-Host "[2/3] Checking Frontend..." -ForegroundColor Cyan

if ($frontendCheck) {
    Write-Host "Frontend already running on port $frontendPort" -ForegroundColor Yellow
} else {
    Write-Host "[START] Starting Frontend..." -ForegroundColor Green

    $frontend = Start-Process cmd -WindowStyle Hidden -PassThru -WorkingDirectory "$projectPath\frontend" -ArgumentList "/c npm run dev"
}

# Delay 3 Seconds
Start-Sleep -Seconds 3

# Project Live on Browser
Write-Host "[3/3] Start Browser..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"
Write-Host "Press [CTRL + C] kills all processes..." -ForegroundColor Red

# Close all running processes 
try {
    while ($true) { Start-Sleep -Seconds 2 }
}
finally {
    Write-Host "Stop all Running Servers" -ForegroundColor Green

    # 🔥 IMPORTANT: kill entire node ecosystem
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
    Get-Process npm -ErrorAction SilentlyContinue | Stop-Process -Force
    # Do not kill all cmd processes to avoid destroying user's other terminal sessions.
    # We rely on stopping node and npm to stop the servers.
}


# PowerShell execution policy blocked 
# Run this command on terminal 
# Set-ExecutionPolicy -Scope Process Bypass

