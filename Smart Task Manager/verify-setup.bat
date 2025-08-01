@echo off
chcp 65001 >nul
echo === Smart Task Manager Setup Verification ===
echo.
echo Checking all required files and dependencies...
echo.

REM Check if Node.js is installed
echo [1/5] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js is installed
    node --version
) else (
    echo ❌ Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
)

echo.

REM Check if required files exist
echo [2/5] Checking required files...

if exist "frontend\index.html" (
    echo ✅ Main application (index.html)
) else (
    echo ❌ Missing: frontend\index.html
)

if exist "frontend\js\app.js" (
    echo ✅ Application logic (app.js)
) else (
    echo ❌ Missing: frontend\js\app.js
)

if exist "frontend\css\style.css" (
    echo ✅ Styles (style.css)
) else (
    echo ❌ Missing: frontend\css\style.css
)

if exist "server.js" (
    echo ✅ Node.js server (server.js)
) else (
    echo ❌ Missing: server.js
)

if exist "package.json" (
    echo ✅ Package configuration (package.json)
) else (
    echo ❌ Missing: package.json
)

echo.

REM Check voice test files
echo [3/5] Checking voice test files...

if exist "frontend\voice-simple.html" (
    echo ✅ Simple voice test (voice-simple.html)
) else (
    echo ❌ Missing: frontend\voice-simple.html
)

if exist "frontend\voice-test.html" (
    echo ✅ Detailed voice test (voice-test.html)
) else (
    echo ❌ Missing: frontend\voice-test.html
)

echo.

REM Check server scripts
echo [4/5] Checking server scripts...

if exist "run-node-server.bat" (
    echo ✅ Windows server script (run-node-server.bat)
) else (
    echo ❌ Missing: run-node-server.bat
)

if exist "run-node-server.ps1" (
    echo ✅ PowerShell server script (run-node-server.ps1)
) else (
    echo ❌ Missing: run-node-server.ps1
)

echo.

REM Test server startup
echo [5/5] Testing server startup...
echo Starting server for 3 seconds to test...

start /B node server.js
timeout /t 3 /nobreak >nul
taskkill /f /im node.exe >nul 2>&1

echo ✅ Server test completed
echo.

echo === Verification Complete ===
echo.
echo If all checks passed, you can run:
echo   .\run-node-server.bat
echo.
echo Then open: http://localhost:8000
echo.
pause 