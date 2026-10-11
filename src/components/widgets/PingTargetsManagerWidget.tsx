import React, { useState } from 'react';
import { PingResult, ThemeColors, SupportedLanguage } from '../../types';
import { Plus, Trash2, Globe } from 'lucide-react';
import { cyberSound } from '../../utils/cyberSound';
import { translations } from '../../i18n/translations';

interface Props {
  targets: PingResult[];
  onAddTarget: (host: string, name: string) => void;
  onRemoveTarget: (host: string) => void;
  theme: ThemeColors;
  lang: SupportedLanguage;
}

export const PingTargetsManagerWidget: React.FC<Props> = ({
  targets,
  onAddTarget,
  onRemoveTarget,
  theme,
  lang,
}) => {
  const [newHost, setNewHost] = useState('');
  const [newName, setNewName] = useState('');
  const t = translations[lang];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHost.trim()) return;
    cyberSound.playClick();
    onAddTarget(newHost.trim(), newName.trim() || newHost.trim());
    setNewHost('');
    setNewName('');
  };

  return (
    <div className="w-full flex flex-col p-4 rounded-xl bg-[#0c121e]/90 border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            {t.targetsTitle}
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          {targets.length} {t.configuredNodes}
        </span>
      </div>

      {/* Add new target form */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-3">
        <input
          type="text"
          placeholder={t.namePlaceholder}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 px-3 py-1.5 rounded-lg bg-[#06090f] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
        <input
          type="text"
          placeholder={t.hostPlaceholder}
          value={newHost}
          onChange={(e) => setNewHost(e.target.value)}
          required
          className="flex-1 px-3 py-1.5 rounded-lg bg-[#06090f] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> {t.addNode}
        </button>
      </form>

      {/* Targets list */}
      <div className="space-y-1.5 max-h-36 overflow-y-auto">
        {targets.map((target) => (
          <div
            key={target.host}
            className="flex items-center justify-between p-2 rounded-lg bg-[#080d16] border border-white/5 text-xs"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="font-medium text-slate-200">{target.name}</span>
              <span className="text-slate-500 font-mono text-[10px]">({target.host})</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-cyan-400 font-bold">{target.ping} ms</span>
              {targets.length > 2 && (
                <button
                  onClick={() => {
                    cyberSound.playClick();
                    onRemoveTarget(target.host);
                  }}
                  className="text-slate-500 hover:text-rose-400 p-1 transition cursor-pointer"
                  title={t.deleteNode}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
