import React, { useState } from 'react';
import { ThemeColors, SupportedLanguage } from '../../types';
import { PieChart } from 'lucide-react';
import { translations } from '../../i18n/translations';

interface Props {
  theme: ThemeColors;
  lang: SupportedLanguage;
}

interface ProtocolSlice {
  name: string;
  port: string;
  share: number;
  color: string;
}

export const ProtocolDonutChart: React.FC<Props> = ({ theme, lang }) => {
  const [activeSlice, setActiveSlice] = useState<ProtocolSlice | null>(null);
  const t = translations[lang];

  const protocols: ProtocolSlice[] = [
    { name: 'HTTPS / TLS 1.3', port: 'TCP 443', share: 58, color: '#00f3ff' },
    { name: 'QUIC / HTTP/3', port: 'UDP 443', share: 22, color: '#00ff88' },
    { name: 'WebSockets', port: 'WSS 443', share: 11, color: '#a855f7' },
    { name: 'DNS Queries', port: 'UDP 53/853', share: 6, color: '#ffaa00' },
    { name: 'ICMP / Ping', port: 'Echo', share: 3, color: '#ff007f' },
  ];

  const total = protocols.reduce((acc, p) => acc + p.share, 0);
  const size = 160;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  let accumulatedPercent = 0;

  return (
    <div className="w-full flex flex-col p-4 rounded-xl bg-[#0c121e]/90 border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            {t.protocolTitle}
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">{t.packetBreakdown}</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
        {/* SVG Donut */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {protocols.map((proto, idx) => {
              const strokeDasharray = `${(proto.share / total) * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += proto.share / total;

              return (
                <circle
                  key={idx}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={proto.color}
                  strokeWidth={activeSlice?.name === proto.name ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 cursor-pointer"
                  style={{
                    filter: activeSlice?.name === proto.name ? `drop-shadow(0 0 8px ${proto.color})` : undefined,
                  }}
                  onMouseEnter={() => setActiveSlice(proto)}
                  onMouseLeave={() => setActiveSlice(null)}
                />
              );
            })}
          </svg>

          {/* Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold font-mono text-white">
              {activeSlice ? `${activeSlice.share}%` : '100%'}
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              {activeSlice ? activeSlice.port : t.totalTraffic}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-1.5 flex-1 min-w-[180px]">
          {protocols.map((proto) => (
            <div
              key={proto.name}
              className={`flex items-center justify-between p-1.5 rounded text-xs transition cursor-pointer ${
                activeSlice?.name === proto.name ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
              onMouseEnter={() => setActiveSlice(proto)}
              onMouseLeave={() => setActiveSlice(null)}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: proto.color, boxShadow: `0 0 5px ${proto.color}` }}
                />
                <span className="text-slate-300 font-medium">{proto.name}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-slate-400 text-[10px]">{proto.port}</span>
                <span className="font-bold text-white">{proto.share}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
