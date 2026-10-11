import React from 'react';
import { PingResult, ThemeColors, SupportedLanguage } from '../../types';
import { Server, Zap } from 'lucide-react';
import { translations } from '../../i18n/translations';

interface Props {
  targets: PingResult[];
  theme: ThemeColors;
  onPingTarget: (host: string) => void;
  lang: SupportedLanguage;
}

export const MultiServerPingChart: React.FC<Props> = ({
  targets,
  theme,
  onPingTarget,
  lang,
}) => {
  const t = translations[lang];

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 rounded-xl bg-[#0c121e]/90 border border-white/10 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            {t.multiServerTitle}
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">{t.activeGlobalNodes}</span>
      </div>

      <div className="space-y-3 flex-1 min-h-[140px] overflow-y-auto pr-1">
        {targets.map((target) => {
          const maxScale = 120;
          const barWidth = Math.min(100, Math.max(5, (target.ping / maxScale) * 100));

          let barColor = '#00ff88'; // green
          if (target.ping > 80) barColor = '#f43f5e'; // red
          else if (target.ping > 45) barColor = '#f59e0b'; // amber
          else if (target.ping > 25) barColor = '#00f3ff'; // cyan

          return (
            <div
              key={target.host}
              className="p-2.5 rounded-lg bg-[#080d16]/70 border border-white/5 hover:border-white/10 transition group"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: barColor, boxShadow: `0 0 6px ${barColor}` }}
                  />
                  <span className="font-medium text-slate-200">{target.name}</span>
                  <span className="text-slate-500 font-mono text-[10px]">({target.ip})</span>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <span className="text-[11px] text-slate-400">
                    {t.jitterVal}: <span className="text-slate-300">{target.jitter}ms</span>
                  </span>
                  <span className="text-sm font-bold" style={{ color: barColor }}>
                    {target.ping} ms
                  </span>
                  <button
                    onClick={() => onPingTarget(target.host)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-slate-400 hover:text-cyan-400 transition cursor-pointer"
                    title={`${t.pingNow} ${target.name}`}
                  >
                    <Zap className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Progress meter bar */}
              <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: barColor,
                    boxShadow: `0 0 8px ${barColor}99`,
                  }}
                />
              </div>

              {/* Sparkline mini dots */}
              <div className="flex items-center gap-1 mt-1.5 justify-end">
                <span className="text-[9px] text-slate-500 mr-1 font-mono">{t.trend}:</span>
                {target.history.slice(-8).map((val, idx) => (
                  <span
                    key={idx}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: val > 60 ? '#f59e0b' : val > 30 ? theme.primaryHex : '#10b981',
                      opacity: 0.3 + (idx / 8) * 0.7,
                    }}
                    title={`${val}ms`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
