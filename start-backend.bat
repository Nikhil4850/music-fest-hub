@echo off
echo Starting Music Festival Hub Backend Server...
echo.

cd backend

echo Installing dependencies...
call npm install

echo.
echo Starting MongoDB backend server on port 5000...
echo Press Ctrl+C to stop the server
echo.

call npm run dev

pause
