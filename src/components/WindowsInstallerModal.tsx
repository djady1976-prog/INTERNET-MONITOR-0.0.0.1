import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  generatePowerShellAgent,
  generateBatchInstaller,
  generateDesktopShortcut,
  generateLocalRunnerBatch,
  downloadFile,
} from '../utils/windowsPackage';
import {
  X,
  Download,
  Terminal,
  CheckCircle2,
  Monitor,
  Shield,
  Laptop,
  FolderDown,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
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
  const t = translations[lang] || translations.en;

  const getCleanAppUrl = () => {
    const origin = window.location.origin || 'https://ais-pre-bs6f727x7xca3snddw6co2-364287489555.europe-west3.run.app';
    const path = window.location.pathname || '/';
    return `${origin}${path}`.replace(/\/+$/, '');
  };

  const handlePWAInstall = async () => {
    cyberSound.playClick();
    const success = await install();
    if (success) {
      cyberSound.playSuccess();
      setDownloadSuccess('NetPulse a fost instalat cu succes în Windows!');
      setTimeout(() => setDownloadSuccess(null), 5000);
    }
  };

  const handleDownloadShortcut = () => {
    cyberSound.playClick();
    const url = getCleanAppUrl();
    const content = generateDesktopShortcut(url);
    downloadFile('NetPulse-Neon.url', content, 'application/internet-shortcut');
    setDownloadSuccess('Scurtătură Desktop (.url) descărcată. Trageți-o pe ecran și deschideți-o!');
    setTimeout(() => setDownloadSuccess(null), 5000);
  };

  const handleDownloadBatch = () => {
    cyberSound.playClick();
    const cleanUrl = getCleanAppUrl();
    const content = generateBatchInstaller(cleanUrl);
    downloadFile('NetPulse-Setup.bat', content, 'application/x-bat');
    setDownloadSuccess('Instalator Automat Windows (.bat) pregătit.');
    setTimeout(() => setDownloadSuccess(null), 5000);
  };

  const handleDownloadLocalRunner = () => {
    cyberSound.playClick();
    const content = generateLocalRunnerBatch();
    downloadFile('START-NETPULSE.bat', content, 'application/x-bat');
    setDownloadSuccess('Lansator Proiect Local (START-NETPULSE.bat) descărcat.');
    setTimeout(() => setDownloadSuccess(null), 5000);
  };

  const handleDownloadAgent = () => {
    cyberSound.playClick();
    const content = generatePowerShellAgent();
    downloadFile('NetPulse-Windows-Daemon.bat', content, 'application/x-bat');
    setDownloadSuccess('Daemon Diagnostic Rețea (.bat) descărcat.');
    setTimeout(() => setDownloadSuccess(null), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#090d16] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#070a10]">
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              {t.installerTitle || 'Instalare NetPulse pe Windows 10 & 11'}
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
        <div className="p-5 space-y-4 text-sm text-slate-300 overflow-y-auto">
          {/* Notification on action */}
          {downloadSuccess && (
            <div className="p-3 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 text-xs font-mono animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {/* Quick Explanation */}
          <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl text-xs text-cyan-200/90 leading-relaxed">
            <span className="font-bold text-cyan-300">Cum porniți aplicația pe calculator:</span> Alegeți oricare dintre opțiunile de mai jos. Recomandăm <strong>Opțiunea 1</strong> (Instalare 1-Click din browser) sau <strong>Opțiunea 2</strong> (Scurtătură directă fără avertismente de securitate).
          </div>

          {/* OPTION 1: 1-Click Browser Desktop PWA Install */}
          <div className="p-4 rounded-xl bg-[#0c121e] border border-cyan-500/40 relative overflow-hidden group">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-400 text-black text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-semibold text-white text-base flex items-center gap-1.5">
                    Instalare Nativă Windows (Recomandat)
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-7">
                  Instalează NetPulse ca aplicație de sine stătătoare pe Windows cu iconiță în Start Menu, Taskbar și Desktop.
                </p>
              </div>

              <div className="pl-7 sm:pl-0 shrink-0">
                {isInstalled ? (
                  <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {t.alreadyInstalled || 'Instalat pe acest PC'}
                  </div>
                ) : isInstallable ? (
                  <button
                    onClick={handlePWAInstall}
                    className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,243,255,0.4)] transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Instalează Acum (1-Click)
                  </button>
                ) : (
                  <button
                    onClick={handleDownloadShortcut}
                    className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4" /> Descarcă Scurtătură Desktop
                  </button>
                )}
              </div>
            </div>

            <div className="mt-2.5 pl-7 text-[11px] text-slate-400 flex items-center gap-2">
              <Laptop className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                În Edge sau Chrome, puteți apăsa și pe simbolul <strong>💻 (Instalare aplicație)</strong> din dreapta barei de adrese.
              </span>
            </div>
          </div>

          {/* OPTION 2: Direct Desktop Shortcut (.url) */}
          <div className="p-4 rounded-xl bg-[#0c121e] border border-white/10 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h3 className="font-semibold text-white">
                    Scurtătură Directă Desktop (<code className="text-cyan-300 font-mono text-xs">.url</code>)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 pl-7">
                  Fișier nativ de scurtătură Windows. O descărcați și o trageți pe Desktop. Se deschide instant cu dublu-click, <strong>fără niciun avertisment SmartScreen</strong>.
                </p>
              </div>
              <button
                onClick={handleDownloadShortcut}
                className="pl-7 sm:pl-0 self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition flex items-center gap-1.5 border border-white/10 cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" /> Descarcă NetPulse-Neon.url
              </button>
            </div>
          </div>

          {/* OPTION 3: Setup Batch Script */}
          <div className="p-4 rounded-xl bg-[#0c121e] border border-white/10 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h3 className="font-semibold text-white">
                    Instalator Automat Windows (<code className="text-cyan-300 font-mono text-xs">NetPulse-Setup.bat</code>)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 pl-7">
                  Script care configurează automat scurtăturile pe ecranul Desktop (inclusiv OneDrive) și lansează aplicația într-o fereastră dedicată.
                </p>
              </div>
              <button
                onClick={handleDownloadBatch}
                className="pl-7 sm:pl-0 self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition flex items-center gap-1.5 border border-white/10 cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" /> Descarcă NetPulse-Setup.bat
              </button>
            </div>
          </div>

          {/* OPTION 4: Local Offline Run (If downloaded code/repository) */}
          <div className="p-4 rounded-xl bg-[#0c121e] border border-white/10 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-white text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <h3 className="font-semibold text-white">
                    Rulare Locală din Fișiere (<code className="text-cyan-300 font-mono text-xs">START-NETPULSE.bat</code>)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 pl-7">
                  Dacă ați descărcat arhiva proiectului pe calculator, plasați acest fișier în folder și rulați-l pentru verificare Node.js și pornire locală la <code className="text-cyan-300">http://localhost:3000</code>.
                </p>
              </div>
              <button
                onClick={handleDownloadLocalRunner}
                className="pl-7 sm:pl-0 self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-medium transition flex items-center gap-1.5 border border-white/10 cursor-pointer shrink-0"
              >
                <FolderDown className="w-3.5 h-3.5" /> Descarcă START-NETPULSE.bat
              </button>
            </div>
          </div>

          {/* Windows Desktop Icon vs Browser Extension explanation */}
          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs text-cyan-200/90 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Cum se afișează pictograma dedicată NetPulse pe Desktop (în loc de iconița de browser):</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Dacă a fost creată anterior doar o scurtătură simplă din meniul Chrome/Edge, Windows asociază pictograma implicită de browser.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-cyan-100/90">
              <li><strong>Soluția 1 (Instalator Automat .bat):</strong> Noul fișier <code>NetPulse-Setup.bat</code> descarcă automat pictograma originală de înaltă rezoluție (<code>app.ico</code>) în <code>%LOCALAPPDATA%\NetPulse</code> și creează scurtătura nativă Windows cu pictograma oficială pe ecran.</li>
              <li><strong>Soluția 2 (Browser PWA):</strong> Apăsați butonul 💻 din bara de adrese și bifați <em>„Deschide ca fereastră”</em>. NetPulse va primi propria sa iconiță dedicată în Start Menu și Taskbar.</li>
            </ul>
          </div>

          {/* Security & System Requirements Notice */}
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-white/5">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Compatibil cu Windows 11 & Windows 10 (64-bit / ARM64). Fără drepturi de administrator necesare.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-[#070a10] flex justify-between items-center">
          <span className="text-[11px] text-slate-400 font-mono">
            NetPulse Neon Pro · Win64 Edition
          </span>
          <button
            onClick={() => {
              cyberSound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition cursor-pointer"
          >
            {t.close || 'Închide'}
          </button>
        </div>
      </div>
    </div>
  );
};
