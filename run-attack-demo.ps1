# 🎭 Attack Simulation Demo Script

Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🎭 RBAC/ABAC SECURITY DEMO - Attack Simulation" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "`n"

Write-Host "This demo will:" -ForegroundColor Yellow
Write-Host "  1. Start Vulnerable Backend (Port 5001)" -ForegroundColor Gray
Write-Host "  2. Start Secure Backend (Port 5002)" -ForegroundColor Gray
Write-Host "  3. Run Attack Simulation" -ForegroundColor Gray
Write-Host "  4. Compare Results" -ForegroundColor Gray
Write-Host "`n"

Write-Host "⚠️  Make sure MongoDB is running!" -ForegroundColor Yellow
Write-Host "`n"

$continue = Read-Host "Press Enter to continue or Ctrl+C to cancel"

# Start Vulnerable Backend
Write-Host "`n▶ Starting Vulnerable Backend..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd 'd:\Projects\Node\project.rbac-abac-security-demo\backend_vulnerable'; npm start" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start Secure Backend
Write-Host "▶ Starting Secure Backend..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd 'd:\Projects\Node\project.rbac-abac-security-demo\backend_secure'; npm start" -WindowStyle Normal

Write-Host "`n⏳ Waiting for servers to start..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Run Attack Simulation
Write-Host "`n▶ Running Attack Simulation..." -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════════════════════`n" -ForegroundColor Cyan

cd attack-simulation
npm run attack

Write-Host "`n═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✅ Demo Complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "`n"

Write-Host "📊 Next Steps:" -ForegroundColor Yellow
Write-Host "  • Check audit logs: curl http://localhost:5002/api/logs" -ForegroundColor Gray
Write-Host "  • View policy config: curl http://localhost:5002/api/policy" -ForegroundColor Gray
Write-Host "  • Close the backend server windows when done" -ForegroundColor Gray
Write-Host "`n"
