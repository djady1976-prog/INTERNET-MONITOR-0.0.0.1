// Windows Installation & Script Generator for NetPulse Neon

export function generatePowerShellAgent(): string {
  return `# =====================================================================
# NetPulse Neon - Windows Monitoring Daemon (PowerShell 5.1 / 7.x)
# Monitors Network Latency, Bandwidth, and Adapter Metrics on Windows
# =====================================================================

Write-Host ">>> NetPulse Neon: Initializing Windows Network Monitor..." -ForegroundColor Cyan

$targets = @("1.1.1.1", "8.8.8.8", "9.9.9.9")
$logFile = "$env:USERPROFILE\\NetPulse-Telemetry.log"

function Get-NetMetrics {
    $timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    $adapter = Get-NetAdapter | Where-Object { $_.Status -eq "Up" } | Select-Object -First 1
    
    if ($adapter) {
        $stats = Get-NetAdapterStatistics -Name $adapter.Name
        Write-Host "[$timestamp] Adapter: $($adapter.Name) | Link: $($adapter.LinkSpeed)" -ForegroundColor Green
        Write-Host "  Sent: $([math]::Round($stats.SentBytes / 1MB, 2)) MB | Received: $([math]::Round($stats.ReceivedBytes / 1MB, 2)) MB" -ForegroundColor Gray
    }

    foreach ($target in $targets) {
        try {
            $ping = Test-Connection -ComputerName $target -Count 1 -ErrorAction Stop
            Write-Host "  Target: $target -> Ping: $($ping.ResponseTime) ms" -ForegroundColor Cyan
        } catch {
            Write-Host "  Target: $target -> TIMEOUT / PACKET LOSS" -ForegroundColor Red
        }
    }
}

Write-Host "NetPulse Daemon is running. Press Ctrl+C to terminate." -ForegroundColor Yellow
while ($true) {
    Get-NetMetrics
    Start-Sleep -Seconds 2
}
`;
}

export function generateBatchInstaller(appUrl: string): string {
  return `@echo off
:: =====================================================================
:: NetPulse Neon - Windows Desktop App Setup Launcher
:: Creates Windows Desktop and Start Menu shortcut for NetPulse Neon
:: =====================================================================
title NetPulse Neon Windows Installer
color 0b
cls
echo =====================================================================
echo           NETPULSE NEON - WINDOWS NETWORK MONITOR SETUP
echo =====================================================================
echo.
echo Installing NetPulse Neon as a Dedicated Windows Desktop App...
echo.

set APP_URL=${appUrl}
set SHORTCUT_NAME=NetPulse Neon.url

echo [InternetShortcut] > "%USERPROFILE%\\Desktop\\%SHORTCUT_NAME%"
echo URL=%APP_URL% >> "%USERPROFILE%\\Desktop\\%SHORTCUT_NAME%"
echo IconIndex=0 >> "%USERPROFILE%\\Desktop\\%SHORTCUT_NAME%"

echo [OK] Shortcut created on your Desktop!
echo.
echo Launching NetPulse Neon in Desktop Standalone Mode...
start msedge --app="%APP_URL%" 2>nul || start chrome --app="%APP_URL%" 2>nul || start "" "%APP_URL%"
echo.
echo Done! NetPulse Neon is now active.
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
