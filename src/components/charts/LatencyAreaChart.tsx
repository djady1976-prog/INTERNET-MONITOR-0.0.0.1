import React, { useState } from 'react';
import { ThemeColors, SupportedLanguage } from '../../types';
import { Activity } from 'lucide-react';
import { translations } from '../../i18n/translations';

interface Props {
  data: number[];
  theme: ThemeColors;
  currentPing: number;
  jitter: number;
  packetLoss: number;
  maxPingLimit?: number;
  lang: SupportedLanguage;
}

export const LatencyAreaChart: React.FC<Props> = ({
  data,
  theme,
  currentPing,
  jitter,
  packetLoss,
  maxPingLimit = 150,
  lang,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; value: number } | null>(null);
  const t = translations[lang];

  const points = data.length > 0 ? data : [15, 16, 14, 15, 18, 14, 15];
  const maxVal = Math.max(...points, maxPingLimit);
  const minVal = Math.min(...points, 5);
  const avgPing = Math.round(points.reduce((a, b) => a + b, 0) / points.length);

  const width = 800;
  const height = 200;
  const paddingX = 40;
  const paddingY = 24;

  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Build SVG path points
  const coords = points.map((val, idx) => {
    const x = paddingX + (idx / Math.max(1, points.length - 1)) * chartWidth;
    const y = paddingY + chartHeight - ((val - minVal) / Math.max(1, maxVal - minVal)) * chartHeight;
    return { x, y, val, idx };
  });

  const pathD = coords.reduce((acc, curr, idx) => {
    if (idx === 0) return `M ${curr.x} ${curr.y}`;
    const prev = coords[idx - 1];
    const cpX = (prev.x + curr.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
  }, '');

  const areaD = coords.length > 0
    ? `${pathD} L ${coords[coords.length - 1].x} ${paddingY + chartHeight} L ${coords[0].x} ${paddingY + chartHeight} Z`
    : '';

  const avgY = paddingY + chartHeight - ((avgPing - minVal) / Math.max(1, maxVal - minVal)) * chartHeight;

  return (
    <div className="w-full flex flex-col p-4 rounded-xl bg-[#0c121e]/90 border border-white/5 relative overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            {t.latencyChartTitle}
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-slate-400">
            {t.currentVal}: <strong className="text-white font-semibold">{currentPing} ms</strong>
          </span>
          <span className="text-slate-400">
            {t.averageVal}: <strong className="text-cyan-400 font-semibold">{avgPing} ms</strong>
          </span>
          <span className="text-slate-400">
            {t.jitterVal}: <strong className="text-emerald-400 font-semibold">{jitter} ms</strong>
          </span>
          <span className="text-slate-400">
            {t.packetLossVal}: <strong className={packetLoss > 0 ? 'text-rose-400 font-semibold' : 'text-slate-300'}>{packetLoss}%</strong>
          </span>
        </div>
      </div>

      {/* SVG Canvas Area Chart */}
      <div className="relative w-full aspect-[4/1] min-h-[160px] max-h-[220px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.primaryHex} stopOpacity="0.35" />
              <stop offset="60%" stopColor={theme.primaryHex} stopOpacity="0.08" />
              <stop offset="100%" stopColor={theme.primaryHex} stopOpacity="0.0" />
            </linearGradient>
            <filter id="neonStrokeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingY + chartHeight * ratio;
            const labelMs = Math.round(maxVal - ratio * (maxVal - minVal));
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {labelMs}ms
                </text>
              </g>
            );
          })}

          {/* Average horizontal reference line */}
          <line
            x1={paddingX}
            y1={avgY}
            x2={width - paddingX}
            y2={avgY}
            stroke={theme.primaryHex}
            strokeOpacity="0.4"
            strokeDasharray="3 3"
          />

          {/* Gradient Filled Area */}
          <path d={areaD} fill="url(#areaGradient)" />

          {/* Glowing Stroke Line */}
          <path
            d={pathD}
            fill="none"
            stroke={theme.primaryHex}
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#neonStrokeGlow)"
          />

          {/* Interactive data point pins */}
          {coords.map((pt) => (
            <circle
              key={pt.idx}
              cx={pt.x}
              cy={pt.y}
              r={hoveredPoint?.index === pt.idx ? 5 : 2}
              fill={hoveredPoint?.index === pt.idx ? '#ffffff' : theme.primaryHex}
              stroke="#0c121e"
              strokeWidth="1.5"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredPoint({ index: pt.idx, value: pt.val })}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          ))}

          {/* Hover indicator tooltip */}
          {hoveredPoint && (
            <g transform={`translate(${coords[hoveredPoint.index].x}, ${coords[hoveredPoint.index].y - 20})`}>
              <rect
                x="-25"
                y="-18"
                width="50"
                height="18"
                rx="4"
                fill="#0f172a"
                stroke={theme.primaryHex}
                strokeWidth="1"
              />
              <text
                x="0"
                y="-6"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {hoveredPoint.value} ms
              </text>
            </g>
          )}

          {/* Current Live Pulse Node */}
          {coords.length > 0 && (
            <circle
              cx={coords[coords.length - 1].x}
              cy={coords[coords.length - 1].y}
              r="4.5"
              fill={theme.primaryHex}
              className="animate-ping"
              opacity="0.75"
            />
          )}
        </svg>
      </div>
    </div>
  );
};
