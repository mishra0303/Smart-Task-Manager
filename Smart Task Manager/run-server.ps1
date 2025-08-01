Write-Host "=== Smart Task Manager Local Server ===" -ForegroundColor Green
Write-Host "Starting local server for voice recognition support..." -ForegroundColor Yellow
Write-Host ""
Write-Host "This will allow voice recognition to work properly." -ForegroundColor Cyan
Write-Host ""
Write-Host "Server will be available at: http://localhost:8000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

Set-Location frontend

try {
    python -m http.server 8000
} catch {
    Write-Host "Python not found. Trying alternative methods..." -ForegroundColor Yellow
    
    # Try Node.js http-server if available
    try {
        npx http-server -p 8000
    } catch {
        Write-Host "Neither Python nor Node.js found." -ForegroundColor Red
        Write-Host "Please install Python or Node.js to run the local server." -ForegroundColor Red
        Write-Host "Or use the regular run-frontend.bat file (voice features may be limited)." -ForegroundColor Yellow
        Read-Host "Press Enter to continue"
    }
} 