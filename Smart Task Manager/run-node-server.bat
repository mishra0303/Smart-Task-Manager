@echo off
echo === Smart Task Manager Node.js Server ===
echo Starting Node.js server for voice recognition support...
echo.
echo This will allow voice recognition to work properly.
echo.
echo Server will be available at: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH.
    echo.
    echo Please install Node.js from https://nodejs.org/
    echo After installation, run this script again.
    pause
    exit /b 1
)

echo ✅ Node.js found

REM Try to run the custom server first
if exist server.js (
    echo Starting custom Node.js server...
    node server.js
) else (
    echo Custom server not found, using http-server...
    cd frontend
    npx http-server -p 8000 -c-1
)

pause 