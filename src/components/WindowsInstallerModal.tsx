import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { generatePowerShellAgent, generateBatchInstaller, downloadFile } from '../utils/windowsPackage';
import { X, Download, Terminal, CheckCircle2, Monitor, Shield, Laptop } from 'lucide-react';
import { cyberSound } from '../utils/cyberSound';
import { SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
}

export const WindowsInstallerModal: React.FC<Props> = ({ isOpen, onClose, lang }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;
  const t = translations[lang];

  const handlePWAInstall = async () => {
    cyberSound.playClick();
    const success = await install();
    if (success) {
      cyberSound.playSuccess();
    }
  };

  const handleDownloadAgent = () => {
    cyberSound.playClick();
    const content = generatePowerShellAgent();
    downloadFile('NetPulse-Windows-Daemon.bat', content, 'application/x-bat');
    setDownloadSuccess('Daemon Windows (.bat) pregătit');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleDownloadBatch = () => {
    cyberSound.playClick();
    const cleanOrigin = window.location.origin || 'https://ais-pre-bs6f727x7xca3snddw6co2-364287489555.europe-west3.run.app';
    const cleanPath = window.location.pathname || '/';
    const cleanUrl = `${cleanOrigin}${cleanPath}`.replace(/\/+$/, '');
    const content = generateBatchInstaller(cleanUrl);
    downloadFile('NetPulse-Desktop-Setup.bat', content, 'application/x-bat');
    setDownloadSuccess('Instalator Desktop (.bat) pregătit');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#090d16] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#070a10]">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              {t.installerTitle}
            </h2>
          </div>
          <button
            onClick={() => {
              cyberSound.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 text-sm text-slate-300 overflow-y-auto max-h-[80vh]">
          {/* Notification on download */}
          {downloadSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* Option 1: Native Windows App Installation */}
          <div className="p-4 rounded-xl bg-[#0c121e] border border-cyan-500/30 relative overflow-hidden group">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-400 text-black text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-semibold text-white text-base">
                    {t.nativeDesktopTitle}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-7">
                  {t.nativeDesktopDesc}
                </p>
              </div>

              {isInstalled ? (
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-medium shrink-0 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t.alreadyInstalled}
                </div>
              ) : isInstallable ? (
                <button
                  onClick={handlePWAInstall}
                  className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs uppercase tracking-wider shrink-0 shadow-[0_0_15px_rgba(0,243,255,0.4)] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> {t.installNow}
                </button>
              ) : (
                <button
                  onClick={handleDownloadBatch}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium shrink-0 border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> {t.batchShortcutBtn}
                </button>
              )}
            </div>

            {/* Instruction hint */}
            <div className="mt-3 pl-7 text-[11px] text-slate-500 flex items-center gap-2">
              <Laptop className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {t.edgeChromeHint}
              </span>
            </div>
          </div>

          {/* Option 2: Windows Batch Desktop Setup Script */}
          <div className="p-4 rounded-xl bg-[#0c121e] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-semibold text-white">
                  {t.batchInstallerTitle}
                </h3>
              </div>
              <button
                onClick={handleDownloadBatch}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition flex items-center gap-1.5 border border-white/10 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> {t.downloadSetupBat}
              </button>
            </div>
            <p className="text-xs text-slate-400 pl-7">
              {t.batchInstallerDesc}
            </p>
          </div>

          {/* Option 3: PowerShell Network Monitoring Daemon */}
          <div className="p-4 rounded-xl bg-[#0c121e] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="font-semibold text-white">
                  {t.powershellDaemonTitle}
                </h3>
              </div>
              <button
                onClick={handleDownloadAgent}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition flex items-center gap-1.5 border border-white/10 cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" /> {t.downloadScriptAgent}
              </button>
            </div>
            <p className="text-xs text-slate-400 pl-7">
              {t.powershellDaemonDesc}
            </p>
          </div>

          {/* Security & System Requirements Notice */}
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-white/5">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {t.certifiedSecurity}
            </span>
          </div>

          {/* Troubleshooting Startup Guide */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-300">
              <Laptop className="w-4 h-4" />
              <span>Ghid de Pornire: Cum lansați NetPulse pe calculator</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-amber-200/80">
              <li><strong>Pasul 1 (Desktop Setup .bat):</strong> Rulați fișierul <code>NetPulse-Desktop-Setup.bat</code> descărcat. Acesta creează automat scurtătura <em>NetPulse Neon</em> pe Desktop (chiar și cu OneDrive activ) și lansează aplicația într-o fereastră nativă dedicată.</li>
              <li><strong>Pasul 2 (Instalare directă PWA):</strong> În Microsoft Edge sau Google Chrome, apăsați pe pictograma de monitor / instalare (💻) din bara de adrese sus-dreapta. Aplicația se instalează direct în Start Menu și Taskbar.</li>
              <li><strong>Pasul 3 (Dacă rulați din fișiere locale):</strong> În folderul descărcat al programului, dați dublu-click pe fișierul <code>START-NETPULSE.bat</code> pentru verificare automată Node.js și pornire locală la <code>http://localhost:3000</code>.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-[#070a10] flex justify-end">
          <button
            onClick={() => {
              cyberSound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
