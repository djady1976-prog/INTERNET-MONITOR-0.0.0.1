import React from 'react';
import { ThemeColors, SupportedLanguage } from '../../types';
import { HardDriveDownload, ArrowDown, ArrowUp } from 'lucide-react';
import { translations } from '../../i18n/translations';

interface Props {
  theme: ThemeColors;
  lang: SupportedLanguage;
}

export const BandwidthHistoryChart: React.FC<Props> = ({ theme, lang }) => {
  const t = translations[lang];

  const intervals = [
    { time: '18:00', down: 420, up: 85 },
    { time: '19:00', down: 890, up: 140 },
    { time: '20:00', down: 1420, up: 210 },
    { time: '21:00', down: 2100, up: 380 },
    { time: '22:00', down: 1850, up: 290 },
    { time: t.now, down: 980, up: 165 },
  ];

  const maxDown = Math.max(...intervals.map((i) => i.down), 1);
  const totalDownMB = intervals.reduce((acc, i) => acc + i.down, 0);
  const totalUpMB = intervals.reduce((acc, i) => acc + i.up, 0);

  return (
    <div className="w-full flex flex-col p-4 rounded-xl bg-[#0c121e]/90 border border-white/5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <HardDriveDownload className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            {t.bandwidthTitle}
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1 text-cyan-400">
            <ArrowDown className="w-3 h-3" /> {(totalDownMB / 1024).toFixed(2)} GB
          </span>
          <span className="flex items-center gap-1 text-purple-400">
            <ArrowUp className="w-3 h-3" /> {(totalUpMB / 1024).toFixed(2)} GB
          </span>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 items-end h-32 pt-4 px-2 border-b border-white/10">
        {intervals.map((item, idx) => {
          const downPercent = (item.down / maxDown) * 100;
          const upPercent = (item.up / maxDown) * 100;

          return (
            <div key={idx} className="flex flex-col items-center h-full justify-end group">
              <span className="text-[10px] font-mono text-slate-400 mb-1 group-hover:text-white transition">
                {item.down} MB
              </span>
              <div className="w-full flex items-end justify-center gap-1 h-full">
                {/* Download bar */}
                <div className="w-3 bg-slate-800 rounded-t overflow-hidden relative flex items-end h-full">
                  <div
                    className="w-full rounded-t transition-all duration-500"
                    style={{
                      height: `${downPercent}%`,
                      backgroundColor: theme.primaryHex,
                      boxShadow: `0 0 6px ${theme.primaryHex}88`,
                    }}
                  />
                </div>
                {/* Upload bar */}
                <div className="w-3 bg-slate-800 rounded-t overflow-hidden relative flex items-end h-full">
                  <div
                    className="w-full rounded-t transition-all duration-500"
                    style={{
                      height: `${upPercent}%`,
                      backgroundColor: '#a855f7',
                      boxShadow: '0 0 6px #a855f788',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-6 gap-3 text-center mt-2">
        {intervals.map((item, idx) => (
          <span key={idx} className="text-[10px] font-mono text-slate-400">
            {item.time}
          </span>
        ))}
      </div>
    </div>
  );
};
