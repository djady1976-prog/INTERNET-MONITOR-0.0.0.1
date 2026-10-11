import React, { useState } from 'react';
import { ThemeColors, SupportedLanguage } from '../../types';
import { Route, CheckCircle, Info } from 'lucide-react';
import { translations } from '../../i18n/translations';

interface Props {
  theme: ThemeColors;
  lang: SupportedLanguage;
}

interface HopNode {
  id: number;
  label: string;
  ip: string;
  ping: number;
  location: string;
  type: 'local' | 'router' | 'isp' | 'ixp' | 'target';
}

export const TracerouteMapChart: React.FC<Props> = ({ theme, lang }) => {
  const [selectedHop, setSelectedHop] = useState<HopNode | null>(null);
  const t = translations[lang];

  const hops: HopNode[] = [
    { id: 1, label: 'Windows PC', ip: '192.168.1.104', ping: 0.2, location: 'Local Host', type: 'local' },
    { id: 2, label: 'Router Gateway', ip: '192.168.1.1', ping: 0.9, location: 'Wi-Fi 6 Router', type: 'router' },
    { id: 3, label: 'ISP Edge BRAS', ip: '10.220.14.1', ping: 4.1, location: 'Fiber OLT', type: 'isp' },
    { id: 4, label: 'Internet Exchange', ip: '193.226.138.1', ping: 7.8, location: 'Regional IXP', type: 'ixp' },
    { id: 5, label: 'Backbone Fiber', ip: '80.81.192.1', ping: 14.2, location: 'DE-CIX Core', type: 'ixp' },
    { id: 6, label: 'Cloudflare Target', ip: '1.1.1.1', ping: 14.5, location: 'Anycast Edge', type: 'target' },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 rounded-xl bg-[#0c121e]/90 border border-white/10 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Route className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            {t.tracerouteTitle}
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">TTL: 64 · MTU: 1500</span>
      </div>

      {/* Interactive Hop Chain with animated glowing packet particle */}
      <div className="relative py-4 px-2 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[580px] relative">
          {/* Background Connecting Line */}
          <div className="absolute top-1/2 left-6 right-6 h-1 bg-slate-800 -translate-y-1/2 z-0" />
          {/* Glowing Animated Packet traveling across */}
          <div
            className="absolute top-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent -translate-y-1/2 z-0 animate-pulse"
            style={{ left: '5%', right: '5%', filter: 'drop-shadow(0 0 6px #00f3ff)' }}
          />

          {hops.map((hop) => {
            const isSelected = selectedHop?.id === hop.id;
            return (
              <div
                key={hop.id}
                onClick={() => setSelectedHop(hop)}
                className="relative z-10 flex flex-col items-center cursor-pointer group"
              >
                {/* Ping label on top */}
                <span className="text-[10px] font-mono text-cyan-400 mb-1 group-hover:scale-110 transition">
                  {hop.ping}ms
                </span>

                {/* Node Orb */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${
                    isSelected
                      ? 'bg-cyan-400 text-black scale-110 shadow-[0_0_15px_#00f3ff]'
                      : 'bg-[#0f172a] text-slate-300 border border-cyan-500/40 hover:border-cyan-400 group-hover:scale-105'
                  }`}
                >
                  #{hop.id}
                </div>

                {/* Node Title */}
                <span className="text-xs font-semibold text-slate-200 mt-2 whitespace-nowrap">
                  {hop.label}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {hop.ip}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Hop Detail Box */}
      <div className="mt-3 p-2.5 rounded-lg bg-[#080d16] border border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            {selectedHop ? (
              <>
                {t.node} #{selectedHop.id}: <strong className="text-white">{selectedHop.label}</strong> ({selectedHop.ip}) — {t.location}: <span className="text-cyan-400">{selectedHop.location}</span> — {t.latency}: <span className="text-emerald-400">{selectedHop.ping} ms</span>
              </>
            ) : (
              t.tracerouteHint
            )}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono shrink-0">
          <CheckCircle className="w-3.5 h-3.5" /> {t.zeroPacketLoss}
        </div>
      </div>
    </div>
  );
};
