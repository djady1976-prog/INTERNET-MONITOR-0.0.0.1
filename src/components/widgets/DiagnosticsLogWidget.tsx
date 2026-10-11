import React, { useState } from 'react';
import { DiagnosticLog, ThemeColors, SupportedLanguage } from '../../types';
import { Terminal, Download, Trash2 } from 'lucide-react';
import { cyberSound } from '../../utils/cyberSound';
import { downloadFile } from '../../utils/windowsPackage';
import { translations } from '../../i18n/translations';

interface Props {
  logs: DiagnosticLog[];
  onClearLogs: () => void;
  theme: ThemeColors;
  lang: SupportedLanguage;
}

export const DiagnosticsLogWidget: React.FC<Props> = ({ logs, onClearLogs, theme, lang }) => {
  const [filterType, setFilterType] = useState<'all' | 'error' | 'warning' | 'info'>('all');
  const t = translations[lang];

  const filtered = logs.filter((log) => {
    if (filterType === 'all') return true;
    return log.type === filterType;
  });

  const handleExport = () => {
    cyberSound.playClick();
    const content = logs.map((l) => `[${l.timestamp}] [${l.type.toUpperCase()}] [${l.source}] ${l.message}`).join('\n');
    downloadFile(`NetPulse-Diagnostics-${Date.now()}.log`, content, 'text/plain');
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 rounded-xl bg-[#0c121e]/90 border border-white/10 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            {t.logsTitle}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Segmented Filter Controls */}
          <div className="flex items-center gap-1 p-0.5 rounded bg-black/40 border border-white/5 text-[11px]">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${
                filterType === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setFilterType('warning')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${
                filterType === 'warning' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.filterWarnings}
            </button>
            <button
              onClick={() => setFilterType('error')}
              className={`px-2 py-0.5 rounded transition cursor-pointer ${
                filterType === 'error' ? 'bg-rose-500/20 text-rose-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.filterErrors}
            </button>
          </div>

          <button
            onClick={handleExport}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
            title={t.exportLog}
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              cyberSound.playClick();
              onClearLogs();
            }}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-rose-400 transition cursor-pointer"
            title={t.clearLog}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="flex-1 min-h-[140px] rounded-lg bg-[#06090f] border border-white/10 p-3 overflow-y-auto font-mono text-xs space-y-1.5">
        {filtered.length === 0 ? (
          <div className="text-slate-600 text-center py-12">{t.noEvents}</div>
        ) : (
          filtered.map((log) => {
            let badgeColor = 'text-cyan-400';
            if (log.type === 'warning') badgeColor = 'text-amber-400';
            else if (log.type === 'error') badgeColor = 'text-rose-400';
            else if (log.type === 'success') badgeColor = 'text-emerald-400';

            return (
              <div key={log.id} className="flex items-start gap-2 leading-relaxed hover:bg-white/5 px-1 rounded">
                <span className="text-slate-500 text-[10px] shrink-0">[{log.timestamp}]</span>
                <span className={`text-[10px] font-bold shrink-0 ${badgeColor}`}>
                  [{log.type.toUpperCase()}]
                </span>
                <span className="text-slate-400 text-[10px] shrink-0">({log.source}):</span>
                <span className="text-slate-200">{log.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
