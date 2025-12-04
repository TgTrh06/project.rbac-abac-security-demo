# Quick Test Script - Attack Simulation

Write-Host "`n🎯 Quick Attack Simulation Test`n" -ForegroundColor Cyan

# Check if MongoDB is running
Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow
try {
    $mongoTest = mongosh --eval "db.version()" --quiet 2>&1
    Write-Host "✓ MongoDB is running" -ForegroundColor Green
} catch {
    Write-Host "✗ MongoDB is not running. Please start MongoDB first!" -ForegroundColor Red
    exit 1
}

# Check if servers are running
Write-Host "`nChecking backend servers..." -ForegroundColor Yellow

$vulnerable = $null
$secure = $null

try {
    $vulnerable = Invoke-WebRequest -Uri "http://localhost:5001/api/logs" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
    Write-Host "✓ Vulnerable Backend is running (Port 5001)" -ForegroundColor Green
} catch {
    Write-Host "✗ Vulnerable Backend is NOT running (Port 5001)" -ForegroundColor Red
    Write-Host "  Run: cd backend_vulnerable && npm start" -ForegroundColor Gray
}

try {
    $secure = Invoke-WebRequest -Uri "http://localhost:5002/api/logs" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
    Write-Host "✓ Secure Backend is running (Port 5002)" -ForegroundColor Green
} catch {
    Write-Host "✗ Secure Backend is NOT running (Port 5002)" -ForegroundColor Red
    Write-Host "  Run: cd backend_secure && npm start" -ForegroundColor Gray
}

if (-not $vulnerable -or -not $secure) {
    Write-Host "`n⚠️  Please start both backend servers before running the attack simulation.`n" -ForegroundColor Yellow
    exit 1
}

# Run attack simulation
Write-Host "`n▶ Running Attack Simulation...`n" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

cd attack-simulation
npm run attack

Write-Host "`n═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Test Complete!`n" -ForegroundColor Green
