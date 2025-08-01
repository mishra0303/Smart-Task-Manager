Write-Host "=== Smart Task Manager Node.js Server ===" -ForegroundColor Green
Write-Host "Starting Node.js server for voice recognition support..." -ForegroundColor Yellow
Write-Host ""
Write-Host "This will allow voice recognition to work properly." -ForegroundColor Cyan
Write-Host ""
Write-Host "Server will be available at: http://localhost:8000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Write-Host "After installation, run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to continue"
    exit 1
}

# Try to run the custom server first
if (Test-Path "server.js") {
    Write-Host "🚀 Starting custom Node.js server..." -ForegroundColor Green
    node server.js
} else {
    Write-Host "📁 Custom server not found, using http-server..." -ForegroundColor Yellow
    Set-Location frontend
    npx http-server -p 8000 -c-1
} 