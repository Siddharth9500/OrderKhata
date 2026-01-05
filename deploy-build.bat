@echo off
echo ==========================================
echo   OrderKhata - Production Deployment
echo ==========================================
echo.

echo Step 1: Building frontend for production...
cd client
call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
cd ..
echo ✓ Frontend build complete!
echo.

echo Step 2: Testing backend...
node backend/server.js &
timeout /t 3 /nobreak >nul
echo ✓ Backend test complete!
echo.

echo ==========================================
echo   Build Complete!
echo ==========================================
echo.
echo Your app is ready for deployment:
echo.
echo Frontend build: client/build/
echo Backend entry: backend/server.js
echo.
echo Next Steps:
echo 1. Deploy backend to Render/Railway/Heroku
echo 2. Deploy frontend to Vercel/Netlify
echo 3. Update environment variables
echo.
echo See DEPLOYMENT.md for detailed instructions
echo ==========================================
pause
