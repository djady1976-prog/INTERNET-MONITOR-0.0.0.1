import React, { useState } from 'react';
import { ThemeColors, SupportedLanguage } from '../../types';
import { Layers } from 'lucide-react';
import { translations } from '../../i18n/translations';

interface Props {
  pingHistory: number[];
  theme: ThemeColors;
  lang: SupportedLanguage;
}

export const PacketLossMatrix: React.FC<Props> = ({ pingHistory, theme, lang }) => {
  const [hoveredPacket, setHoveredPacket] = useState<{ id: number; ms: number; status: string } | null>(null);
  const t = translations[lang];

  // Fill up to 48 recent packets
  const sampleCount = 48;
  const packets = Array.from({ length: sampleCount }).map((_, i) => {
    const historyIdx = pingHistory.length - 1 - (sampleCount - 1 - i);
    const ms = historyIdx >= 0 ? pingHistory[historyIdx] : Math.round(14 + Math.random() * 6);
    let status = 'ACK';
    let color = '#00ff88';

    if (ms > 120) {
      status = 'DROPPED';
      color = '#f43f5e';
    } else if (ms > 50) {
      status = 'DELAYED';
      color = '#f59e0b';
    } else if (ms > 25) {
      status = 'ACK';
      color = '#00f3ff';
    }

    return { id: i + 1, ms, status, color };
  });

  const droppedCount = packets.filter((p) => p.status === 'DROPPED').length;
  const healthPercent = Math.round(((sampleCount - droppedCount) / sampleCount) * 100);

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 rounded-xl bg-[#0c121e]/90 border border-white/10 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            {t.packetMatrixTitle}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">{t.integrity}:</span>
          <span className="text-emerald-400 font-bold">{healthPercent}%</span>
        </div>
      </div>

      {/* Grid of 48 micro packet blocks */}
      <div className="grid grid-cols-12 sm:grid-cols-16 md:grid-cols-24 gap-1.5 p-3 rounded-lg bg-[#080d16] border border-white/5">
        {packets.map((pkt) => (
          <div
            key={pkt.id}
            onMouseEnter={() => setHoveredPacket(pkt)}
            onMouseLeave={() => setHoveredPacket(null)}
            className="w-full aspect-square rounded-[3px] transition-all hover:scale-125 cursor-pointer relative"
            style={{
              backgroundColor: pkt.color,
              boxShadow: hoveredPacket?.id === pkt.id ? `0 0 8px ${pkt.color}` : `0 0 2px ${pkt.color}55`,
            }}
          />
        ))}
      </div>

      {/* Legend & Hover Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3 text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00ff88]" /> {t.optimal}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00f3ff]" /> {t.normal}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> {t.delayed}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#f43f5e]" /> {t.dropped}
          </span>
        </div>

        <div className="font-mono text-slate-300">
          {hoveredPacket ? (
            <span>
              {t.packet} #{hoveredPacket.id}: <strong className="text-white">{hoveredPacket.ms}ms</strong> ({hoveredPacket.status})
            </span>
          ) : (
            <span>{t.hoverBlockHint}</span>
          )}
        </div>
      </div>
    </div>
  );
};
