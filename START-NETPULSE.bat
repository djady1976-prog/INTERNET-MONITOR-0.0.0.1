@echo off
:: =====================================================================
:: NetPulse Neon - Launcher Local Windows
:: Dublu-click pe acest fisier pentru a porni NetPulse pe calculator
:: =====================================================================
title NetPulse Neon - Windows Local Launcher
color 0b
cls
echo =====================================================================
echo           NETPULSE NEON - PORNIRE APLICATIE PE CALCULATOR
echo =====================================================================
echo.

cd /d "%~dp0"

echo [1/3] Verificare mediu de executie Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [EROARE] Node.js nu este instalat pe calculatorul dvs.
    echo.
    echo Pentru a rula programul complet pe calculator, instalati Node.js gratuit:
    echo https://nodejs.org/ (recomandat versiunea LTS)
    echo.
    echo In mod alternativ, puteti deschide versiunea standalone direct in browser:
    echo Se deschide acum...
    start https://ais-pre-bs6f727x7xca3snddw6co2-364287489555.europe-west3.run.app
    echo.
    pause
    exit /b 1
)

echo       [OK] Node.js este detectat pe sistem.
echo.

echo [2/3] Verificare dependente (node_modules)...
if not exist node_modules (
    echo       Se instaleaza modulele necesare (npm install)... Aceasta dureaza un minut...
    call npm install
    if %errorlevel% neq 0 (
        echo [EROARE] Instalarea dependintelor a esuat. Verificati conexiunea la internet.
        pause
        exit /b 1
    )
)
echo       [OK] Dependentele sunt pregatite.
echo.

echo [3/3] Lansare NetPulse Neon...
echo       Se deschide interfata grafica in browser la http://localhost:3000
echo.

:: Deschide automat browserul dupa 1.5 secunde
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:3000"

:: Ruleaza serverul de dezvoltare
call npm run dev
pause
