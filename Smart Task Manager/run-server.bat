@echo off
echo === Smart Task Manager Local Server ===
echo Starting local server for voice recognition support...
echo.
echo This will allow voice recognition to work properly.
echo.
echo Server will be available at: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

cd frontend
python -m http.server 8000

pause 