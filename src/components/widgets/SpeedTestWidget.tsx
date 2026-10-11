import React from 'react';
import { SpeedTestState, ThemeColors, SupportedLanguage } from '../../types';
import { Gauge, ArrowDown, ArrowUp, Activity, Play, CheckCircle2, RotateCcw } from 'lucide-react';
import { cyberSound } from '../../utils/cyberSound';
import { translations } from '../../i18n/translations';

interface Props {
  state: SpeedTestState;
  onRunTest: () => void;
  theme: ThemeColors;
  lang: SupportedLanguage;
}

export const SpeedTestWidget: React.FC<Props> = ({ state, onRunTest, theme, lang }) => {
  const t = translations[lang];

  const handleStart = () => {
    cyberSound.playClick();
    onRunTest();
  };

  const getPhaseDescription = () => {
    switch (state.phase) {
      case 'ping':
        return t.phasePing;
      case 'download':
        return t.phaseDownload;
      case 'upload':
        return t.phaseUpload;
      case 'complete':
        return t.phaseComplete;
      default:
        return t.phaseIdle;
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 rounded-xl bg-[#0c121e]/90 border border-white/10 relative overflow-hidden shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            {t.speedTestTitle}
          </h3>
        </div>

        {state.phase === 'complete' ? (
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" /> {t.certifiedResult}
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 font-mono">{t.cdnServer}</span>
        )}
      </div>

      {/* Progress & Speed Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {/* Download */}
        <div className="p-3 rounded-lg bg-[#080d16] border border-white/5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <ArrowDown className="w-3 h-3 text-cyan-400" /> {t.download}
            </span>
            <span className="font-mono text-[10px]">Mbps</span>
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {state.downloadMbps || '--'}
          </div>
        </div>

        {/* Upload */}
        <div className="p-3 rounded-lg bg-[#080d16] border border-white/5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <ArrowUp className="w-3 h-3 text-purple-400" /> {t.upload}
            </span>
            <span className="font-mono text-[10px]">Mbps</span>
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400">
            {state.uploadMbps || '--'}
          </div>
        </div>

        {/* Ping */}
        <div className="p-3 rounded-lg bg-[#080d16] border border-white/5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" /> {t.pingRtt}
            </span>
            <span className="font-mono text-[10px]">ms</span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {state.pingMs || '--'}
          </div>
        </div>

        {/* Jitter */}
        <div className="p-3 rounded-lg bg-[#080d16] border border-white/5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>{t.jitterVariation}</span>
            <span className="font-mono text-[10px]">ms</span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {state.jitterMs || '--'}
          </div>
        </div>
      </div>

      {/* Progress Bar & Phase Status */}
      <div className="space-y-2 mb-4">
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${state.progress}%`,
              backgroundColor: theme.primaryHex,
              boxShadow: `0 0 10px ${theme.primaryHex}`,
            }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono">{getPhaseDescription()}</span>
          <span className="font-mono font-bold text-white">{state.progress}%</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-end">
        <button
          onClick={handleStart}
          disabled={state.isRunning}
          className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer ${
            state.isRunning
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:opacity-95 shadow-[0_0_15px_rgba(0,243,255,0.4)]'
          }`}
        >
          {state.isRunning ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" /> {t.testInProgress}
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" /> {t.startSpeedTest}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
