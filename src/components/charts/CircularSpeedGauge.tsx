import React from 'react';
import { ThemeColors } from '../../types';

interface Props {
  label: string;
  value: number;
  max: number;
  unit: string;
  theme: ThemeColors;
  subText?: string;
  accentColor?: string;
}

export const CircularSpeedGauge: React.FC<Props> = ({
  label,
  value,
  max,
  unit,
  theme,
  subText,
  accentColor,
}) => {
  const safeVal = Number.isFinite(value) ? Math.max(0, value) : 0;
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const percentage = Math.min(100, Math.max(0, (safeVal / safeMax) * 100));
  const strokeColor = accentColor || theme.primaryHex;
  const radius = 64;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Arc range: 240 degrees (from 150deg to 390deg)
  const arcLength = circumference * (240 / 360);
  const strokeDashoffset = arcLength - (percentage / 100) * arcLength;

  return (
    <div className="relative flex flex-col items-center justify-center p-3 rounded-xl bg-[#0c121e]/80 border border-white/5 hover:border-white/10 transition group">
      {/* Glow aura */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none blur-xl -z-10"
        style={{ background: `radial-gradient(circle, ${strokeColor}22 0%, transparent 70%)` }}
      />

      <div className="relative w-36 h-32 flex items-center justify-center">
        <svg height={136} width={136} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            stroke="rgba(255, 255, 255, 0.07)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            style={{ strokeDashoffset: 0 }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={68}
            cy={68}
            className="transform rotate-[150deg] origin-center"
          />

          {/* Glowing Animated Value Track */}
          <circle
            stroke={strokeColor}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              filter: `drop-shadow(0 0 6px ${strokeColor}88)`,
            }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={68}
            cy={68}
            className="transform rotate-[150deg] origin-center"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span
            className="text-2xl font-mono font-bold tracking-tight text-white transition-all"
            style={{ textShadow: `0 0 12px ${strokeColor}66` }}
          >
            {value.toLocaleString()}
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            {unit}
          </span>
        </div>
      </div>

      <div className="text-center mt-[-8px]">
        <span className="text-xs font-semibold text-slate-200 tracking-wide block">{label}</span>
        {subText && <span className="text-[10px] text-slate-400 block mt-0.5">{subText}</span>}
      </div>
    </div>
  );
};
