# Smart Task Manager Frontend Launcher (PowerShell)
Write-Host "=== Smart Task Manager Frontend ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Opening Smart Task Manager in your default browser..." -ForegroundColor Green
Write-Host ""
Write-Host "Note: This application works completely offline using local storage." -ForegroundColor Yellow
Write-Host ""

# Change to frontend directory
Set-Location -Path "frontend"

# Get the full path to index.html
$indexPath = Join-Path (Get-Location) "index.html"

# Open in default browser
try {
    Start-Process $indexPath
    Write-Host "Frontend opened successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Keyboard Shortcuts:" -ForegroundColor Cyan
    Write-Host "  Ctrl+N: Create new task" -ForegroundColor White
    Write-Host "  Ctrl+L: Logout" -ForegroundColor White
    Write-Host "  Esc: Go to dashboard" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "Error opening frontend: $($_.Exception.Message)" -ForegroundColor Red
}

# Return to original directory
Set-Location -Path ".." 