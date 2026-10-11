import React from 'react';
import { ThemeColors, SupportedLanguage } from '../../types';
import { BarChart3 } from 'lucide-react';
import { translations } from '../../i18n/translations';

interface Props {
  pingHistory: number[];
  theme: ThemeColors;
  lang: SupportedLanguage;
}

export const JitterHistogramChart: React.FC<Props> = ({ pingHistory, theme, lang }) => {
  const t = translations[lang];

  // Categorize ping values into 6 histogram bins
  const bins = [
    { label: '<15ms', count: 0, color: '#00ff88' },
    { label: '15-25ms', count: 0, color: '#00f3ff' },
    { label: '25-40ms', count: 0, color: '#38bdf8' },
    { label: '40-60ms', count: 0, color: '#facc15' },
    { label: '60-90ms', count: 0, color: '#fb923c' },
    { label: '>90ms', count: 0, color: '#f43f5e' },
  ];

  pingHistory.forEach((val) => {
    if (val < 15) bins[0].count++;
    else if (val <= 25) bins[1].count++;
    else if (val <= 40) bins[2].count++;
    else if (val <= 60) bins[3].count++;
    else if (val <= 90) bins[4].count++;
    else bins[5].count++;
  });

  const maxCount = Math.max(...bins.map((b) => b.count), 1);

  return (
    <div className="w-full flex flex-col p-4 rounded-xl bg-[#0c121e]/90 border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            {t.histogramTitle}
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">{t.latencyConsistency}</span>
      </div>

      <div className="grid grid-cols-6 gap-2 items-end h-32 pt-4 px-2 border-b border-white/10">
        {bins.map((bin, i) => {
          const heightPercent = Math.max(8, (bin.count / maxCount) * 100);
          return (
            <div key={i} className="flex flex-col items-center h-full justify-end group">
              <span className="text-[10px] font-mono text-slate-400 mb-1 group-hover:text-white transition">
                {bin.count}x
              </span>
              <div className="w-full max-w-[32px] bg-slate-800/60 rounded-t overflow-hidden relative flex items-end">
                <div
                  className="w-full rounded-t transition-all duration-500"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: bin.color,
                    boxShadow: `0 0 10px ${bin.color}88`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-6 gap-2 text-center mt-2">
        {bins.map((bin, i) => (
          <span key={i} className="text-[9px] font-mono text-slate-400 truncate">
            {bin.label}
          </span>
        ))}
      </div>
    </div>
  );
};
