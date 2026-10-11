import React, { useState, useMemo } from 'react';
import { ThemeColors, SupportedLanguage } from '../../types';
import { BarChart3, Activity, Zap, Waves, CheckCircle2 } from 'lucide-react';
import { translations } from '../../i18n/translations';
import { cyberSound } from '../../utils/cyberSound';

interface Props {
  pingHistory: number[];
  jitterHistory?: number[];
  currentJitter?: number;
  currentPing?: number;
  theme: ThemeColors;
  lang: SupportedLanguage;
}

type HistogramMode = 'jitter' | 'latency';

interface BinData {
  label: string;
  rangeDesc: string;
  count: number;
  percent: number;
  color: string;
  glowColor: string;
  status: string;
}

export const JitterHistogramChart: React.FC<Props> = ({
  pingHistory,
  jitterHistory = [],
  currentJitter = 1.2,
  currentPing = 14,
  theme,
  lang,
}) => {
  const t = translations[lang] || translations.en;
  const [mode, setMode] = useState<HistogramMode>('jitter');
  const [hoveredBin, setHoveredBin] = useState<number | null>(null);

  // Compute jitter dataset from multiple sources:
  // 1. jitterHistory (if populated)
  // 2. instantaneous packet-to-packet deltas (|RTT_i - RTT_{i-1}|)
  // 3. currentJitter
  const { jitterSamples, pingSamples } = useMemo(() => {
    const pings = Array.isArray(pingHistory) && pingHistory.length > 0
      ? pingHistory.filter((v) => typeof v === 'number' && Number.isFinite(v) && v > 0)
      : [14, 15, 13, 16, 14, 15, 14, 13, 15, 14, 16];

    // Compute delta differences between sequential packets
    const deltas: number[] = [];
    for (let i = 1; i < pings.length; i++) {
      const delta = Math.abs(pings[i] - pings[i - 1]);
      deltas.push(Math.round(delta * 10) / 10);
    }

    const jitters = Array.isArray(jitterHistory) && jitterHistory.length > 0
      ? jitterHistory.filter((v) => typeof v === 'number' && Number.isFinite(v) && v >= 0)
      : [];

    const combinedJitter = [...jitters, ...deltas];
    if (combinedJitter.length === 0 && Number.isFinite(currentJitter)) {
      combinedJitter.push(currentJitter);
    }

    return {
      jitterSamples: combinedJitter.length > 0 ? combinedJitter : [1.1, 0.9, 1.4, 1.0, 1.3, 0.8, 1.2],
      pingSamples: pings,
    };
  }, [pingHistory, jitterHistory, currentJitter]);

  // Statistics computation
  const stats = useMemo(() => {
    const samples = mode === 'jitter' ? jitterSamples : pingSamples;
    const n = samples.length;
    if (n === 0) {
      return { mean: 0, peak: 0, stdDev: 0, count: 0, stabilityGrade: '100%' };
    }

    const sum = samples.reduce((a, b) => a + b, 0);
    const mean = Math.round((sum / n) * 10) / 10;
    const peak = Math.round(Math.max(...samples) * 10) / 10;
    const variance = samples.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
    const stdDev = Math.round(Math.sqrt(variance) * 10) / 10;

    // Jitter stability calculation
    let stabilityRating = '99.4%';
    if (mode === 'jitter') {
      if (mean < 2.0 && stdDev < 1.5) stabilityRating = '99.8%';
      else if (mean < 5.0) stabilityRating = '97.2%';
      else if (mean < 10.0) stabilityRating = '91.5%';
      else stabilityRating = '78.4%';
    } else {
      if (mean < 25) stabilityRating = '99.5%';
      else if (mean < 50) stabilityRating = '96.8%';
      else if (mean < 80) stabilityRating = '92.1%';
      else stabilityRating = '84.0%';
    }

    return { mean, peak, stdDev, count: n, stabilityGrade: stabilityRating };
  }, [mode, jitterSamples, pingSamples]);

  // Bins generation
  const bins: BinData[] = useMemo(() => {
    if (mode === 'jitter') {
      // 6 calibrated jitter tiers reflecting real Packet Delay Variation
      const definitions = [
        { label: '<1ms', rangeDesc: '0.0 - 1.0 ms', color: '#10b981', glowColor: '#10b98188', status: 'Ultra Pure' },
        { label: '1-2.5ms', rangeDesc: '1.0 - 2.5 ms', color: '#00f3ff', glowColor: '#00f3ff88', status: 'Excelent' },
        { label: '2.5-5ms', rangeDesc: '2.5 - 5.0 ms', color: '#38bdf8', glowColor: '#38bdf888', status: 'Normal' },
        { label: '5-10ms', rangeDesc: '5.0 - 10.0 ms', color: '#facc15', glowColor: '#facc1588', status: 'Moderat' },
        { label: '10-20ms', rangeDesc: '10.0 - 20.0 ms', color: '#fb923c', glowColor: '#fb923c88', status: 'Variabil' },
        { label: '>20ms', rangeDesc: '> 20.0 ms', color: '#f43f5e', glowColor: '#f43f5e88', status: 'Spike' },
      ];

      const counts = [0, 0, 0, 0, 0, 0];
      jitterSamples.forEach((val) => {
        if (val < 1.0) counts[0]++;
        else if (val <= 2.5) counts[1]++;
        else if (val <= 5.0) counts[2]++;
        else if (val <= 10.0) counts[3]++;
        else if (val <= 20.0) counts[4]++;
        else counts[5]++;
      });

      const total = jitterSamples.length || 1;
      return definitions.map((d, i) => ({
        ...d,
        count: counts[i],
        percent: Math.round((counts[i] / total) * 100),
      }));
    } else {
      // Adaptive latency spread based on user's actual latency spectrum
      const minP = Math.min(...pingSamples, 10);
      const maxP = Math.max(...pingSamples, 30);
      const span = Math.max(15, maxP - minP);
      const step = Math.max(5, Math.ceil(span / 5));

      const definitions = [
        { label: `<${minP + step}ms`, rangeDesc: `< ${minP + step} ms`, color: '#10b981', glowColor: '#10b98188', status: 'Fast' },
        { label: `${minP + step}-${minP + step * 2}ms`, rangeDesc: `${minP + step} - ${minP + step * 2} ms`, color: '#00f3ff', glowColor: '#00f3ff88', status: 'Optimal' },
        { label: `${minP + step * 2}-${minP + step * 3}ms`, rangeDesc: `${minP + step * 2} - ${minP + step * 3} ms`, color: '#38bdf8', glowColor: '#38bdf888', status: 'Good' },
        { label: `${minP + step * 3}-${minP + step * 4}ms`, rangeDesc: `${minP + step * 3} - ${minP + step * 4} ms`, color: '#facc15', glowColor: '#facc1588', status: 'Fair' },
        { label: `${minP + step * 4}-${minP + step * 5}ms`, rangeDesc: `${minP + step * 4} - ${minP + step * 5} ms`, color: '#fb923c', glowColor: '#fb923c88', status: 'Elevated' },
        { label: `>${minP + step * 5}ms`, rangeDesc: `> ${minP + step * 5} ms`, color: '#f43f5e', glowColor: '#f43f5e88', status: 'High' },
      ];

      const counts = [0, 0, 0, 0, 0, 0];
      pingSamples.forEach((val) => {
        if (val < minP + step) counts[0]++;
        else if (val <= minP + step * 2) counts[1]++;
        else if (val <= minP + step * 3) counts[2]++;
        else if (val <= minP + step * 4) counts[3]++;
        else if (val <= minP + step * 5) counts[4]++;
        else counts[5]++;
      });

      const total = pingSamples.length || 1;
      return definitions.map((d, i) => ({
        ...d,
        count: counts[i],
        percent: Math.round((counts[i] / total) * 100),
      }));
    }
  }, [mode, jitterSamples, pingSamples]);

  const maxCount = Math.max(...bins.map((b) => b.count), 1);

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 rounded-xl bg-[#0c121e]/90 border border-white/10 shadow-lg relative overflow-hidden group">
      {/* Background ambient gradient glow */}
      <div
        className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: theme.primary }}
      />

      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
              {t.histogramTitle}
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                DSP LIVE
              </span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <Waves className="w-3 h-3 text-cyan-400/70" />
              {t.latencyConsistency}
            </span>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center bg-[#070b13] p-1 rounded-lg border border-white/10 shadow-inner">
          <button
            onClick={() => {
              cyberSound.playClick();
              setMode('jitter');
            }}
            className={`px-2.5 py-1 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 ${
              mode === 'jitter'
                ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 text-cyan-300 border border-cyan-400/40 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Analiză Spectrală Jitter (Packet Delay Variation)"
          >
            <Activity className="w-3 h-3 text-cyan-400" />
            {t.histogramModeJitter || 'Jitter (PDV)'}
          </button>
          <button
            onClick={() => {
              cyberSound.playClick();
              setMode('latency');
            }}
            className={`px-2.5 py-1 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 ${
              mode === 'latency'
                ? 'bg-gradient-to-r from-emerald-500/30 to-teal-600/30 text-emerald-300 border border-emerald-400/40 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Distribuție RTT Latență"
          >
            <Zap className="w-3 h-3 text-emerald-400" />
            {t.histogramModeLatency || 'Latență (RTT)'}
          </button>
        </div>
      </div>

      {/* Real-time DSP Summary Metrics Strip */}
      <div className="grid grid-cols-4 gap-2 py-2 px-3 mb-3 bg-[#080d16]/80 rounded-lg border border-white/5 text-center font-mono">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400 truncate">
            {t.histogramMeanJitter || 'Medie'}
          </span>
          <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
            <span className="text-cyan-400">{stats.mean}</span>
            <span className="text-[10px] text-slate-400 font-normal">ms</span>
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400 truncate">
            {t.histogramPeakJitter || 'Vârf'}
          </span>
          <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
            <span className="text-amber-400">{stats.peak}</span>
            <span className="text-[10px] text-slate-400 font-normal">ms</span>
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400 truncate">
            {t.histogramStdDev || 'Deviație (σ)'}
          </span>
          <span className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
            <span className="text-purple-400">±{stats.stdDev}</span>
            <span className="text-[10px] text-slate-400 font-normal">ms</span>
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400 truncate">Stabilitate</span>
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
            {stats.stabilityGrade}
          </span>
        </div>
      </div>

      {/* Histogram Bar Canvas Container */}
      <div className="relative w-full flex-1 min-h-[140px] pt-4 pb-1 px-2 border-b border-white/10 flex items-end">
        {/* Subtle Horizontal grid lines at 25%, 50%, 75%, 100% */}
        <div className="absolute inset-x-2 top-4 bottom-1 pointer-events-none flex flex-col justify-between opacity-15">
          <div className="border-b border-dashed border-white w-full" />
          <div className="border-b border-dashed border-white w-full" />
          <div className="border-b border-dashed border-white w-full" />
          <div className="border-b border-dashed border-white w-full" />
        </div>

        {/* 6 Frequency / Jitter Spectrum Bins */}
        <div className="w-full h-full grid grid-cols-6 gap-2 sm:gap-3 items-end relative z-10">
          {bins.map((bin, i) => {
            const rawRatio = bin.count / maxCount;
            // Ensure minimum visual visibility (8%) so 0-count bars are still identifiable tracks
            const heightPercent = bin.count > 0 ? Math.max(12, Math.round(rawRatio * 100)) : 6;
            const isHovered = hoveredBin === i;

            return (
              <div
                key={i}
                className="flex flex-col items-center h-full justify-end cursor-pointer group"
                onMouseEnter={() => setHoveredBin(i)}
                onMouseLeave={() => setHoveredBin(null)}
              >
                {/* Count Badge above the bar */}
                <div
                  className={`text-[10px] font-mono mb-1 transition-all duration-200 flex flex-col items-center ${
                    isHovered ? 'scale-110 font-bold text-white' : 'text-slate-400'
                  }`}
                >
                  <span className="leading-none">{bin.count}x</span>
                  {bin.count > 0 && (
                    <span className="text-[9px] text-slate-500 font-mono leading-none mt-0.5">
                      {bin.percent}%
                    </span>
                  )}
                </div>

                {/* Explicit Height Track Container */}
                <div className="w-full max-w-[42px] h-full max-h-[180px] min-h-[70px] bg-slate-900/80 rounded-t border border-white/10 overflow-hidden relative flex items-end shadow-inner">
                  {/* Peak Hold Tick Line (Audio Spectrum style) */}
                  {bin.count > 0 && (
                    <div
                      className="absolute left-0 right-0 h-0.5 transition-all duration-300 z-20"
                      style={{
                        bottom: `${Math.min(97, heightPercent + 2)}%`,
                        backgroundColor: bin.color,
                        boxShadow: `0 0 6px ${bin.color}`,
                      }}
                    />
                  )}

                  {/* Spectral Fill Bar with Gradient & Illumination */}
                  <div
                    className="w-full rounded-t transition-all duration-500 relative flex items-start justify-center"
                    style={{
                      height: `${heightPercent}%`,
                      background: `linear-gradient(to top, ${bin.color}22 0%, ${bin.color}dd 100%)`,
                      boxShadow: bin.count > 0 ? `0 0 12px ${bin.glowColor}` : 'none',
                      borderTop: `2px solid ${bin.color}`,
                    }}
                  >
                    {/* Inner highlight pulse on hover */}
                    {isHovered && (
                      <div className="absolute inset-0 bg-white/20 animate-pulse rounded-t" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bin Range Labels (Below the Bars) */}
      <div className="grid grid-cols-6 gap-2 sm:gap-3 text-center mt-2.5">
        {bins.map((bin, i) => {
          const isHovered = hoveredBin === i;
          return (
            <div key={i} className="flex flex-col items-center">
              <span
                className={`text-[10px] font-mono truncate transition-colors ${
                  isHovered ? 'text-cyan-300 font-bold scale-105' : 'text-slate-400'
                }`}
                title={bin.rangeDesc}
              >
                {bin.label}
              </span>
              <span
                className="text-[8px] font-mono tracking-tighter truncate opacity-70"
                style={{ color: bin.color }}
              >
                {bin.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Hover Info Tooltip Bar */}
      {hoveredBin !== null && bins[hoveredBin] && (
        <div className="mt-3 p-2 bg-[#090e18] border border-cyan-500/30 rounded-lg flex items-center justify-between text-xs font-mono animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: bins[hoveredBin].color }}
            />
            <span className="text-white font-semibold">
              Interval: {bins[hoveredBin].rangeDesc}
            </span>
            <span className="text-slate-400">({bins[hoveredBin].status})</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-cyan-300">
              {bins[hoveredBin].count} pachete ({bins[hoveredBin].percent}%)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
