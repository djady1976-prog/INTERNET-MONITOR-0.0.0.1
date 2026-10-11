// Windows Installation & Script Generator for NetPulse Neon

export function generateDesktopShortcut(appUrl: string): string {
  const safeUrl = appUrl.trim();
  return `[InternetShortcut]
URL=${safeUrl}
IconIndex=0
HotKey=0
[{000214A0-0000-0000-C000-000000000046}]
Prop3=19,0
`;
}

export function generatePowerShellAgent(): string {
  return `<# :
@echo off
title NetPulse Neon - Windows Daemon & Telemetry Probe
color 0b
cls
echo =====================================================================
echo       NETPULSE NEON - WINDOWS TELEMETRY & NETWORK DAEMON
echo =====================================================================
echo.
echo [INFO] Se initializeaza monitorizarea nativa de retea...
echo [INFO] Pentru oprire, apasati CTRL + C in aceasta fereastra.
echo.
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-Expression ([System.IO.File]::ReadAllText('%~f0'))"
echo.
echo [INFO] Daemon-ul NetPulse a fost oprit.
pause
exit /b
#>

# =====================================================================
# NetPulse Neon - Native Windows Network Telemetry Probe (PowerShell)
# Compatible with PowerShell 5.1 (Windows 10/11) and PowerShell 7.x
# =====================================================================

Write-Host ">>> NetPulse Neon: Active Network Monitoring Started..." -ForegroundColor Cyan

$targets = @("1.1.1.1", "8.8.8.8", "9.9.9.9")
$logFile = "$env:USERPROFILE\\NetPulse-Telemetry.log"

Write-Host "  Fisier de log: $logFile" -ForegroundColor Gray
Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray

function Get-NetMetrics {
    $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $adapter = Get-NetAdapter -ErrorAction SilentlyContinue | Where-Object { $_.Status -eq "Up" } | Select-Object -First 1
    
    if ($adapter) {
        $stats = Get-NetAdapterStatistics -Name $adapter.Name -ErrorAction SilentlyContinue
        Write-Host "[$timestamp] Placa activa: $($adapter.Name) | Viteza: $($adapter.LinkSpeed)" -ForegroundColor Green
        if ($stats) {
            $sentMb = [math]::Round($stats.SentBytes / 1MB, 2)
            $recvMb = [math]::Round($stats.ReceivedBytes / 1MB, 2)
            Write-Host "  Trafic: Trimis $sentMb MB | Receptionat $recvMb MB" -ForegroundColor Gray
        }
    } else {
        Write-Host "[$timestamp] Conexiune fizica activa detectata." -ForegroundColor Yellow
    }

    foreach ($target in $targets) {
        try {
            $ping = Test-Connection -ComputerName $target -Count 1 -ErrorAction Stop
            $rtt = $ping.ResponseTime
            $color = if ($rtt -lt 40) { "Cyan" } elseif ($rtt -lt 90) { "Yellow" } else { "Red" }
            Write-Host "  Ping $target : $rtt ms" -ForegroundColor $color
            "[$timestamp] Target: $target | RTT: $rtt ms" | Out-File -FilePath $logFile -Append -Encoding utf8
        } catch {
            Write-Host "  Ping $target : TIMEOUT / PACHET PIERDUT" -ForegroundColor Red
            "[$timestamp] Target: $target | TIMEOUT" | Out-File -FilePath $logFile -Append -Encoding utf8
        }
    }
    Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray
}

while ($true) {
    Get-NetMetrics
    Start-Sleep -Seconds 2
}
`;
}

export function generateBatchInstaller(appUrl: string): string {
  const safeUrl = appUrl.trim();
  return `@echo off
setlocal EnableDelayedExpansion
title NetPulse Neon - Setup ^& Desktop Launcher
color 0b
cls

echo =====================================================================
echo           NETPULSE NEON - WINDOWS NETWORK MONITOR SETUP
echo =====================================================================
echo.
echo [1/4] Configurare adresa aplicatie NetPulse...
set "APP_URL=${safeUrl}"
echo       URL: !APP_URL!
echo.

echo [2/4] Descarcare pictograma oficiala NetPulse (.ico)...
set "ICON_DIR=%LOCALAPPDATA%\\NetPulse"
if not exist "!ICON_DIR!" mkdir "!ICON_DIR!" 2>nul
set "ICON_PATH=!ICON_DIR!\\app.ico"

where curl >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    curl -s -L "!APP_URL!/favicon.ico" -o "!ICON_PATH!"
    if exist "!ICON_PATH!" (
        echo       [OK] Pictograma NetPulse Neon salvata in: !ICON_PATH!
    )
)

echo.
echo [3/4] Detectare browser pentru fereastra nativa desktop...
set "BROWSER_EXE="

:: 1. Microsoft Edge (standard pe Windows 10 si Windows 11)
for %%B in (
    "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe"
    "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe"
    "%LOCALAPPDATA%\\Microsoft\\Edge\\Application\\msedge.exe"
) do (
    if not defined BROWSER_EXE if exist %%B (
        set "BROWSER_EXE=%%~fB"
    )
)

:: 2. Google Chrome (alternativ)
if not defined BROWSER_EXE (
    for %%B in (
        "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe"
        "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe"
        "%LOCALAPPDATA%\\Google\\Chrome\\Application\\chrome.exe"
    ) do (
        if not defined BROWSER_EXE if exist %%B (
            set "BROWSER_EXE=%%~fB"
        )
    )
)

echo.
echo [4/4] Creare scurtaturi Desktop si Start Menu cu pictograma NetPulse...

:: Creare scurtaturi Shell (.lnk) cu pictograma exacta daca PowerShell este disponibil
if defined BROWSER_EXE (
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
      "$ws = New-Object -ComObject WScript.Shell; ^
       $desktop = [Environment]::GetFolderPath('Desktop'); ^
       $lnk = $ws.CreateShortcut((Join-Path $desktop 'NetPulse Neon.lnk')); ^
       $lnk.TargetPath = '!BROWSER_EXE!'; ^
       $lnk.Arguments = '--app=\"!APP_URL!\"'; ^
       if (Test-Path '!ICON_PATH!') { $lnk.IconLocation = '!ICON_PATH!,0'; } ^
       $lnk.Description = 'NetPulse Neon - Monitor Internet & Retea Windows'; ^
       $lnk.Save(); ^
       $oneDrive = [Environment]::GetEnvironmentVariable('OneDrive'); ^
       if ($oneDrive -and (Test-Path (Join-Path $oneDrive 'Desktop'))) { ^
         Copy-Item (Join-Path $desktop 'NetPulse Neon.lnk') (Join-Path (Join-Path $oneDrive 'Desktop') 'NetPulse Neon.lnk') -Force -ErrorAction SilentlyContinue; ^
       }; ^
       $programs = [Environment]::GetFolderPath('Programs'); ^
       if (Test-Path $programs) { ^
         Copy-Item (Join-Path $desktop 'NetPulse Neon.lnk') (Join-Path $programs 'NetPulse Neon.lnk') -Force -ErrorAction SilentlyContinue; ^
       }" 2>nul
)

:: Fallback / Complementar: Scurtatura Internet (.url)
if exist "%USERPROFILE%\\Desktop" (
    (
        echo [InternetShortcut]
        echo URL=!APP_URL!
        if exist "!ICON_PATH!" (
            echo IconFile=!ICON_PATH!
            echo IconIndex=0
        )
    ) > "%USERPROFILE%\\Desktop\\NetPulse Neon.url"
)

if defined OneDrive (
    if exist "%OneDrive%\\Desktop" (
        (
            echo [InternetShortcut]
            echo URL=!APP_URL!
            if exist "!ICON_PATH!" (
                echo IconFile=!ICON_PATH!
                echo IconIndex=0
            )
        ) > "%OneDrive%\\Desktop\\NetPulse Neon.url"
    )
)

echo       [OK] Scurtatura NetPulse Neon a fost creata pe Desktop!
echo.

echo =====================================================================
echo  Lansare NetPulse Neon in mod aplicatie Desktop...
echo =====================================================================

if defined BROWSER_EXE (
    echo       Deschidere fereastra nativa prin: !BROWSER_EXE!
    start "" "!BROWSER_EXE!" --app="!APP_URL!"
) else (
    echo       Deschidere prin browser implicit...
    start "" "!APP_URL!"
)

echo.
echo =====================================================================
echo   [SUCCES] Aplicatia este instalata si a fost pornita!
echo   Pictograma NetPulse Neon este disponibila pe ecranul Desktop.
echo =====================================================================
echo.
timeout /t 4 >nul
exit /b 0
`;
}

export function generateLocalRunnerBatch(): string {
  return `@echo off
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
if not exist "node_modules\\" (
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
`;
}

export function downloadFile(filename: string, content: string, contentType: string = 'text/plain') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
