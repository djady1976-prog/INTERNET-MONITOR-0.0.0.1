import React, { useState } from 'react';
import { Minus, Square, X, Wifi, Volume2, VolumeX, ShieldCheck, Download, Settings, RefreshCw, Globe, Sparkles } from 'lucide-react';
import { ThemeColors, SupportedLanguage } from '../types';
import { cyberSound } from '../utils/cyberSound';
import { translations, SUPPORTED_LANGUAGES } from '../i18n/translations';

interface Props {
  theme: ThemeColors;
  isAudioOn: boolean;
  onToggleAudio: () => void;
  onOpenInstaller: () => void;
  onOpenCustomizer: () => void;
  onOpenAbout: () => void;
  onRefreshAll: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  lang: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export const WindowsTitleBar: React.FC<Props> = ({
  theme,
  isAudioOn,
  onToggleAudio,
  onOpenInstaller,
  onOpenCustomizer,
  onOpenAbout,
  onRefreshAll,
  isPaused,
  onTogglePause,
  lang,
  onSelectLanguage,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimizedNotice, setIsMinimizedNotice] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const t = translations[lang];

  const handleMinimize = () => {
    cyberSound.playClick();
    setIsMinimizedNotice(true);
    setTimeout(() => setIsMinimizedNotice(false), 4000);
  };

  const handleToggleMaximize = () => {
    cyberSound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsMaximized(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsMaximized(false);
    }
  };

  const handleClose = () => {
    cyberSound.playClick();
    setIsMinimizedNotice(true);
    setTimeout(() => setIsMinimizedNotice(false), 4000);
  };

  return (
    <>
      <div className="w-full bg-[#070a10] border-b border-white/10 select-none flex items-center justify-between px-3 py-1.5 text-xs text-slate-300 z-50">
        {/* Left: Windows App Branding & Status */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-[9px] font-black text-black">
              ⚡
            </div>
            <span className="font-semibold tracking-wide text-white flex items-center gap-1.5">
              NetPulse Neon <span className="text-[10px] text-slate-400 font-mono">{t.windowsTag}</span>
            </span>
          </div>

          <span className="text-slate-600">|</span>

          {/* Real-time pulse indicator */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/5">
            <span
              className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`}
              style={{ boxShadow: isPaused ? '0 0 6px #f59e0b' : '0 0 6px #10b981' }}
            />
            <span className="text-[11px] font-mono text-slate-300">
              {isPaused ? t.monitoringPaused : t.liveMonitoring}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1">
              <Wifi className="w-3 h-3 text-cyan-400" /> {t.wifiEthernet}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> {t.firewallSecure}
            </span>
          </div>
        </div>

        {/* Center: Quick action buttons & Language selector */}
        <div className="hidden lg:flex items-center gap-1.5">
          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="px-2 py-1 rounded text-[11px] flex items-center gap-1.5 transition text-slate-300 hover:text-white bg-white/5 hover:border-white/10 border border-transparent cursor-pointer"
              title={t.language}
            >
              <Globe className="w-3 h-3 text-cyan-400" />
              <span className="font-mono uppercase font-bold text-white">{lang}</span>
            </button>

            {isLangMenuOpen && (
              <div className="absolute top-full mt-1 left-0 z-50 bg-[#0d1522] border border-white/15 rounded-lg shadow-2xl p-1 min-w-[130px] flex flex-col gap-0.5 animate-in fade-in">
                {SUPPORTED_LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      cyberSound.playClick();
                      onSelectLanguage(item.code);
                      setIsLangMenuOpen(false);
                    }}
                    className={`px-2 py-1.5 rounded text-left text-xs flex items-center justify-between transition cursor-pointer ${
                      lang === item.code ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{item.flag}</span>
                      <span>{item.name}</span>
                    </span>
                    {lang === item.code && <span className="text-cyan-400 text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onTogglePause}
            className={`px-2 py-1 rounded text-[11px] flex items-center gap-1.5 transition border ${
              isPaused
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/5 text-slate-300 hover:text-white border-transparent hover:border-white/10'
            }`}
            title={isPaused ? t.resume : t.pause}
          >
            {isPaused ? `▶ ${t.resume}` : `⏸ ${t.pause}`}
          </button>

          <button
            onClick={onRefreshAll}
            className="px-2 py-1 rounded text-[11px] flex items-center gap-1.5 transition text-slate-300 hover:text-white bg-white/5 hover:border-white/10 border border-transparent cursor-pointer"
            title={t.probeNow}
          >
            <RefreshCw className="w-3 h-3" /> {t.probeNow}
          </button>

          <button
            onClick={onToggleAudio}
            className={`p-1.5 rounded transition ${
              isAudioOn
                ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
            title={isAudioOn ? 'Mute' : 'Audio HUD'}
          >
            {isAudioOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onOpenAbout}
            className="px-2 py-1 rounded text-[11px] flex items-center gap-1.5 transition text-slate-300 hover:text-white bg-white/5 hover:border-white/10 border border-transparent cursor-pointer"
            title={`${t.aboutBtn} - DEVELOPED BY: ANDREI ADRIAN BUTA`}
          >
            <Sparkles className="w-3 h-3 text-cyan-400" /> {t.aboutBtn}
          </button>

          <button
            onClick={onOpenCustomizer}
            className="px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5 transition text-slate-300 hover:text-white bg-white/5 hover:border-white/10 border border-transparent cursor-pointer"
          >
            <Settings className="w-3 h-3" /> {t.customize}
          </button>

          <button
            onClick={onOpenInstaller}
            className="px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5 font-medium transition text-black bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_10px_rgba(0,243,255,0.4)] cursor-pointer"
          >
            <Download className="w-3 h-3" /> {t.installWindows}
          </button>
        </div>

        {/* Right: Native Windows Window Controls (Minimize, Maximize, Close) */}
        <div className="flex items-center -mr-3">
          <button
            onClick={handleMinimize}
            className="w-10 h-7 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition"
            title={t.minimizeTip}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleToggleMaximize}
            className="w-10 h-7 flex items-center justify-center hover:bg-white/10 text-slate-400 hover:text-white transition"
            title={t.maximizeTip}
          >
            <Square className="w-3 h-3" />
          </button>
          <button
            onClick={handleClose}
            className="w-10 h-7 flex items-center justify-center hover:bg-red-600 text-slate-400 hover:text-white transition"
            title={t.closeTip}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating notification when minimize/tray action is simulated */}
      {isMinimizedNotice && (
        <div className="fixed top-12 right-6 z-50 bg-[#0f172a] border border-cyan-500/40 text-slate-200 px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-3 animate-bounce">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <div className="text-xs">
            <p className="font-semibold text-white">{t.daemonRunningTitle}</p>
            <p className="text-slate-400">{t.daemonRunningDesc}</p>
          </div>
          <button onClick={() => setIsMinimizedNotice(false)} className="text-slate-500 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
};
