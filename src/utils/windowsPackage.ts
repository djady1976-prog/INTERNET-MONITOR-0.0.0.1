// Windows Installation & Script Generator for NetPulse Neon

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
:: =====================================================================
:: NetPulse Neon - Windows Desktop App Setup & Launcher
:: Compatible with Windows 10 & Windows 11 (64-bit / ARM64)
:: =====================================================================
title NetPulse Neon - Setup & Launcher Desktop
color 0b
cls
echo =====================================================================
echo           NETPULSE NEON - WINDOWS NETWORK MONITOR SETUP
echo =====================================================================
echo.
echo [1/3] Configurare adresa aplicatie NetPulse...
set "APP_URL=${safeUrl}"
echo       URL: %APP_URL%
echo.

echo [2/3] Creare scurtaturi dedicate pe Desktop si Start Menu...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ws = New-Object -ComObject WScript.Shell; ^
   $desktop = [Environment]::GetFolderPath('Desktop'); ^
   $oneDrive = [Environment]::GetEnvironmentVariable('OneDrive'); ^
   $shortcutPath = Join-Path $desktop 'NetPulse Neon.url'; ^
   '[InternetShortcut]' | Out-File -FilePath $shortcutPath -Encoding ascii; ^
   ('URL=' + $env:APP_URL) | Out-File -FilePath $shortcutPath -Append -Encoding ascii; ^
   if ($oneDrive -and (Test-Path (Join-Path $oneDrive 'Desktop'))) { ^
     $odPath = Join-Path (Join-Path $oneDrive 'Desktop') 'NetPulse Neon.url'; ^
     Copy-Item $shortcutPath $odPath -Force -ErrorAction SilentlyContinue; ^
   }; ^
   $programs = [Environment]::GetFolderPath('Programs'); ^
   if (Test-Path $programs) { ^
     Copy-Item $shortcutPath (Join-Path $programs 'NetPulse Neon.url') -Force -ErrorAction SilentlyContinue; ^
   }; ^
   Write-Host '      [OK] Scurtatura NetPulse Neon a fost creata pe Desktop!' -ForegroundColor Green"

echo.
echo [3/3] Detectare browser si lansare NetPulse in mod aplicatie Desktop...

:: Cautare Microsoft Edge
set "BROWSER_PATH="
if exist "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe" (
    set "BROWSER_PATH=%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe"
) else if exist "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe" (
    set "BROWSER_PATH=%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe"
) else if exist "%LOCALAPPDATA%\\Microsoft\\Edge\\Application\\msedge.exe" (
    set "BROWSER_PATH=%LOCALAPPDATA%\\Microsoft\\Edge\\Application\\msedge.exe"
) else if exist "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe" (
    set "BROWSER_PATH=%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe"
) else if exist "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe" (
    set "BROWSER_PATH=%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe"
) else if exist "%LOCALAPPDATA%\\Google\\Chrome\\Application\\chrome.exe" (
    set "BROWSER_PATH=%LOCALAPPDATA%\\Google\\Chrome\\Application\\chrome.exe"
)

if defined BROWSER_PATH (
    echo       Lansare prin: %BROWSER_PATH%
    start "" "%BROWSER_PATH%" --app="%APP_URL%"
) else (
    echo       Lansare prin browserul implicit de sistem...
    start "" "%APP_URL%"
)

echo.
echo =====================================================================
echo   [SUCCES] NetPulse Neon este acum instalat si a fost pornit!
echo   Puteti redeschide oricand aplicatia din scurtatura de pe Desktop.
echo =====================================================================
echo.
echo Apasati orice tasta pentru a inchide acest instalator...
pause >nul
exit /b 0
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
