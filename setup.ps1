# MERN File Handler - Setup and Run Script
# This script helps you set up and run the application

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  MERN File Handling Application - Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "1. Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "   ✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "   ✗ Node.js not found! Please install Node.js v18+." -ForegroundColor Red
    exit 1
}

# Check MongoDB
Write-Host ""
Write-Host "2. Checking MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "   ✓ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "   ⚠ MongoDB not running. Please start MongoDB:" -ForegroundColor Yellow
    Write-Host "     - Run 'mongod' in a separate terminal, or" -ForegroundColor Yellow
    Write-Host "     - Start MongoDB as a Windows service" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "   Continue anyway? (y/n)"
    if ($continue -ne 'y') {
        exit 1
    }
}

# Backend setup
Write-Host ""
Write-Host "3. Backend Setup..." -ForegroundColor Yellow
Set-Location "server"

if (Test-Path "node_modules") {
    Write-Host "   ✓ Backend dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "   Installing backend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Backend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Backend installation failed" -ForegroundColor Red
        Set-Location ..
        exit 1
    }
}

Set-Location ..

# Frontend setup
Write-Host ""
Write-Host "4. Frontend Setup..." -ForegroundColor Yellow
Set-Location "client"

if (Test-Path "node_modules") {
    Write-Host "   ✓ Frontend dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "   Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ Frontend dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Frontend installation failed (network issue?)" -ForegroundColor Red
        Write-Host "   Please run 'npm install' manually in the client folder" -ForegroundColor Yellow
        Set-Location ..
        Read-Host "Press Enter to continue..."
        exit 1
    }
}

Set-Location ..

# Summary
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend (in one terminal):" -ForegroundColor Cyan
Write-Host "  cd server" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Frontend (in another terminal):" -ForegroundColor Cyan
Write-Host "  cd client" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then open: http://localhost:5173" -ForegroundColor Green
Write-Host ""

$runNow = Read-Host "Start servers now? (y/n)"

if ($runNow -eq 'y') {
    Write-Host ""
    Write-Host "Starting servers..." -ForegroundColor Yellow
    Write-Host "Backend will run on: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "Frontend will run on: http://localhost:5173" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow
    Write-Host ""
    
    # Start backend in background
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm run dev"
    
    # Wait a bit for backend to start
    Start-Sleep -Seconds 3
    
    # Start frontend
    Set-Location "client"
    npm run dev
}
