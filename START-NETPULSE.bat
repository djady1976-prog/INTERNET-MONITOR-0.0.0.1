@echo off
setlocal
title NetPulse Neon - Server Local & Launcher
color 0b
cls
echo =====================================================================
echo          NETPULSE NEON - PORNIRE APLICATIE & SERVER LOCAL
echo =====================================================================
echo.
echo [1/3] Verificare mediu Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [INFO] Node.js nu este instalat pe acest calculator.
    echo Pentru a rula aplicatia offline este necesar Node.js (v18 sau mai nou).
    echo.
    echo Se deschide acum versiunea oficiala in browser:
    start "" "https://ais-pre-bs6f727x7xca3snddw6co2-364287489555.europe-west3.run.app"
    echo.
    echo Daca doriti instalare locala, descarcati Node.js gratuit de la: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo       [OK] Node.js detectat:
node -v
echo.

echo [2/3] Verificare pachete si module (node_modules)...
if not exist "node_modules\" (
    echo       Se instaleaza modulele necesare (npm install)...
    call npm install
) else (
    echo       [OK] Modulele sunt deja instalate.
)

echo.
echo [3/3] Pornire server NetPulse Neon pe http://localhost:3000...
echo.

start "" cmd /c "timeout /t 3 >nul && start http://localhost:3000"

call npm run dev
pause
