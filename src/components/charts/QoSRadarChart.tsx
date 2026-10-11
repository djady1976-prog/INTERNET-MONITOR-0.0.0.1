import React from 'react';
import { QoSMetrics, ThemeColors, SupportedLanguage } from '../../types';
import { Award } from 'lucide-react';
import { translations } from '../../i18n/translations';

interface Props {
  metrics: QoSMetrics;
  theme: ThemeColors;
  lang: SupportedLanguage;
}

export const QoSRadarChart: React.FC<Props> = ({ metrics, theme, lang }) => {
  const t = translations[lang];

  const axes = [
    { label: t.gaming, value: metrics.gaming },
    { label: t.streaming, value: metrics.streaming4k },
    { label: t.voip, value: metrics.voip },
    { label: t.browsing, value: metrics.browsing },
    { label: t.cloudSync, value: metrics.cloudSync },
  ];

  const size = 220;
  const center = size / 2;
  const radius = 80;
  const totalAxes = axes.length;

  // Calculate polygon coordinates for values (0-100)
  const getCoordinates = (value: number, index: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const polyPoints = axes
    .map((axis, i) => {
      const { x, y } = getCoordinates(axis.value, i);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="w-full flex flex-col p-4 rounded-xl bg-[#0c121e]/90 border border-white/5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            {t.qosTitle}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
          {t.bufferbloat}: {metrics.bufferbloatGrade}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
        {/* Radar SVG */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          <svg width={size} height={size} className="overflow-visible">
            {/* Background concentric rings (20%, 40%, 60%, 80%, 100%) */}
            {[0.2, 0.4, 0.6, 0.8, 1].map((level, idx) => {
              const ringPoints = axes
                .map((_, i) => {
                  const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
                  const r = level * radius;
                  return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
                })
                .join(' ');

              return (
                <polygon
                  key={idx}
                  points={ringPoints}
                  fill="transparent"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Axis spokes */}
            {axes.map((_, i) => {
              const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
              const x = center + radius * Math.cos(angle);
              const y = center + radius * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Value Polygon with Neon Glow */}
            <polygon
              points={polyPoints}
              fill={theme.primaryHex}
              fillOpacity="0.25"
              stroke={theme.primaryHex}
              strokeWidth="2"
              style={{ filter: `drop-shadow(0 0 6px ${theme.primaryHex})` }}
            />

            {/* Value Points */}
            {axes.map((axis, i) => {
              const { x, y } = getCoordinates(axis.value, i);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="#ffffff"
                  stroke={theme.primaryHex}
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>

        {/* Score Breakdown List */}
        <div className="space-y-2 flex-1 w-full max-w-[240px]">
          {axes.map((axis, idx) => (
            <div key={idx} className="flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">{axis.label}</span>
                <span className="font-mono font-bold text-white">{axis.value}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${axis.value}%`,
                    backgroundColor: axis.value > 80 ? '#00ff88' : axis.value > 60 ? '#00f3ff' : '#f59e0b',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
