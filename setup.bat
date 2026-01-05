@echo off
echo ================================
echo   OrderKhata - Quick Start
echo ================================
echo.

echo Checking if MongoDB is running...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo MongoDB is running!
) else (
    echo MongoDB is NOT running!
    echo Please start MongoDB first:
    echo   1. Open new terminal as Administrator
    echo   2. Run: net start MongoDB
    echo   OR run: mongod
    echo.
    pause
    exit
)

echo.
echo Installing backend dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo Failed to install backend dependencies!
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd client
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo Failed to install frontend dependencies!
    pause
    exit /b 1
)

cd ..

echo.
echo ================================
echo   Installation Complete!
echo ================================
echo.
echo To start the application:
echo   1. Backend: npm run dev
echo   2. Frontend: cd client ^&^& npm start
echo   OR Both: npm run dev:full
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
pause
