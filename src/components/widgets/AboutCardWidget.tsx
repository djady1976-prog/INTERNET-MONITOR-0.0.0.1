import React from 'react';
import { ThemeColors, SupportedLanguage } from '../../types';
import { translations } from '../../i18n/translations';
import { Code2, Award, ExternalLink, Sparkles, Terminal } from 'lucide-react';
import { cyberSound } from '../../utils/cyberSound';

interface Props {
  theme: ThemeColors;
  lang: SupportedLanguage;
  onOpenModal: () => void;
}

export const AboutCardWidget: React.FC<Props> = ({ theme, lang, onOpenModal }) => {
  const t = translations[lang];

  return (
    <div
      onClick={() => {
        cyberSound.playClick();
        onOpenModal();
      }}
      className="w-full flex flex-col p-4 sm:p-5 rounded-xl bg-[#0c121e]/90 border transition-all duration-300 relative overflow-hidden group cursor-pointer"
      style={{
        borderColor: `${theme.primaryHex}44`,
        boxShadow: `0 0 15px ${theme.primaryHex}15`,
      }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"
        style={{ backgroundColor: theme.primaryHex }}
      />

      {/* Top Banner */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {t.aboutTitle}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 group-hover:translate-x-0.5 transition-transform">
          <span>Info Pro</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* DEVELOPED BY: ANDREI ADRIAN BUTA Hero Banner */}
      <div
        className="p-4 rounded-xl bg-[#080d16] border relative overflow-hidden flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left transition-all"
        style={{
          borderColor: `${theme.primaryHex}66`,
          boxShadow: `inset 0 0 12px ${theme.primaryHex}15`,
        }}
      >
        <div
          className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-0.5 flex items-center justify-center shrink-0 shadow-lg"
          style={{ boxShadow: `0 0 14px ${theme.primaryHex}55` }}
        >
          <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
            <Code2 className="w-6 h-6 text-cyan-400" />
          </div>
        </div>

        <div className="space-y-0.5 flex-1 min-w-0">
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold block">
            OFFICIAL AUTHOR & CREATOR
          </span>
          <h4
            className="text-sm sm:text-base font-black font-mono tracking-wide text-white truncate"
            style={{
              textShadow: `0 0 12px ${theme.primaryHex}`,
            }}
          >
            DEVELOPED BY: ANDREI ADRIAN BUTA
          </h4>
          <p className="text-[11px] text-cyan-300 font-mono">
            {t.developerRole} · NetPulse Neon {t.windowsTag}
          </p>
        </div>

        <div className="shrink-0 flex sm:flex-col items-center gap-1.5 text-[10px] font-mono text-slate-400">
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1">
            <Award className="w-3 h-3 text-cyan-400" /> v2.4.0
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
            Win64 Verified
          </span>
        </div>
      </div>

      {/* Micro Spec Bar */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
        <span className="flex items-center gap-1.5 text-slate-400">
          <Terminal className="w-3 h-3 text-cyan-400" /> {t.engineBuild}
        </span>
        <span className="text-cyan-400/80 group-hover:text-cyan-300 transition-colors">
          Click to inspect specs →
        </span>
      </div>
    </div>
  );
};
