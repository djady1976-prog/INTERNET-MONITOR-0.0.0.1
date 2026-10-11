import React from 'react';
import { NeonTheme, WidgetConfig, SupportedLanguage } from '../types';
import { THEME_CONFIG } from '../utils/themeConfig';
import { X, Check, Sliders, Eye, EyeOff, LayoutGrid, Clock, Bell, Sparkles, Globe } from 'lucide-react';
import { cyberSound } from '../utils/cyberSound';
import { translations, SUPPORTED_LANGUAGES } from '../i18n/translations';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: NeonTheme;
  onSelectTheme: (theme: NeonTheme) => void;
  widgets: WidgetConfig[];
  onToggleWidget: (id: string) => void;
  refreshInterval: number;
  onChangeRefreshInterval: (ms: number) => void;
  pingAlertThreshold: number;
  onChangePingAlert: (ms: number) => void;
  scanlinesEnabled: boolean;
  onToggleScanlines: () => void;
  columnsLayout: '2col' | '3col' | 'compact';
  onChangeColumnsLayout: (layout: '2col' | '3col' | 'compact') => void;
  lang: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export const DashboardCustomizerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  widgets,
  onToggleWidget,
  refreshInterval,
  onChangeRefreshInterval,
  pingAlertThreshold,
  onChangePingAlert,
  scanlinesEnabled,
  onToggleScanlines,
  columnsLayout,
  onChangeColumnsLayout,
  lang,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] bg-[#090d16] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#070a10]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              {t.customizerTitle}
            </h2>
          </div>
          <button
            onClick={() => {
              cyberSound.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Settings Content */}
        <div className="p-5 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* 0. Language Selector */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> {t.language} / Language
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SUPPORTED_LANGUAGES.map((item) => {
                const isSelected = lang === item.code;
                return (
                  <button
                    key={item.code}
                    onClick={() => {
                      cyberSound.playClick();
                      onSelectLanguage(item.code);
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-[0_0_12px_rgba(0,243,255,0.25)]'
                        : 'border-white/10 bg-[#0c121e] hover:border-white/20 text-slate-400'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{item.flag}</span>
                      <span className="font-semibold text-xs text-white">{item.name}</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1. Neon Theme Selector */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> {t.neonColorThemes}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {(Object.keys(THEME_CONFIG) as NeonTheme[]).map((themeKey) => {
                const conf = THEME_CONFIG[themeKey];
                const isSelected = currentTheme === themeKey;
                return (
                  <button
                    key={themeKey}
                    onClick={() => {
                      cyberSound.playClick();
                      onSelectTheme(themeKey);
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-2 transition cursor-pointer ${
                      isSelected
                        ? 'border-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                        : 'border-white/10 bg-[#0c121e] hover:border-white/20'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: conf.primaryHex, boxShadow: `0 0 10px ${conf.primaryHex}` }}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                    </div>
                    <span className="text-[11px] font-medium text-white">{conf.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Refresh Rate & Layout Density */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> {t.refreshRate}
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: '500 ms (Hyper)', val: 500 },
                  { label: '1000 ms (1s)', val: 1000 },
                  { label: '2000 ms (2s)', val: 2000 },
                  { label: '5000 ms (Eco)', val: 5000 },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => {
                      cyberSound.playClick();
                      onChangeRefreshInterval(item.val);
                    }}
                    className={`py-1.5 px-2.5 rounded-lg border text-center transition cursor-pointer ${
                      refreshInterval === item.val
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'border-white/10 bg-[#0c121e] hover:bg-white/5 text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
                <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" /> {t.columnsLayout}
              </h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { label: t.columns2, val: '2col' as const },
                  { label: t.columns3, val: '3col' as const },
                  { label: t.columnsCompact, val: 'compact' as const },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => {
                      cyberSound.playClick();
                      onChangeColumnsLayout(item.val);
                    }}
                    className={`py-1.5 px-2 rounded-lg border text-center transition cursor-pointer ${
                      columnsLayout === item.val
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-semibold'
                        : 'border-white/10 bg-[#0c121e] hover:bg-white/5 text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Thresholds & Cyber Visual Effects */}
          <div className="p-3.5 rounded-xl bg-[#080d16] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-slate-200">
                  {t.latencyAlertThreshold}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="30"
                  max="200"
                  step="5"
                  value={pingAlertThreshold}
                  onChange={(e) => onChangePingAlert(Number(e.target.value))}
                  className="w-28 accent-cyan-400 cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-cyan-400 w-12 text-right">
                  {pingAlertThreshold} ms
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  {t.scanlinesCRT}
                </span>
                <span className="text-[11px] text-slate-500">
                  {t.scanlinesDesc}
                </span>
              </div>
              <button
                onClick={() => {
                  cyberSound.playClick();
                  onToggleScanlines();
                }}
                className={`w-12 h-6 rounded-full transition relative p-0.5 cursor-pointer ${
                  scanlinesEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-black transition-transform ${
                    scanlinesEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 4. Widgets Visibility Toggles */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-cyan-400" /> {t.visibleWidgets}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {widgets.map((w) => (
                <div
                  key={w.id}
                  onClick={() => {
                    cyberSound.playClick();
                    onToggleWidget(w.id);
                  }}
                  className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                    w.visible
                      ? 'border-white/10 bg-[#0c121e] text-white'
                      : 'border-white/5 bg-black/40 text-slate-500 opacity-60'
                  }`}
                >
                  <span className="font-medium truncate pr-2">{w.title}</span>
                  {w.visible ? (
                    <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-[#070a10] flex justify-end">
          <button
            onClick={() => {
              cyberSound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-semibold text-xs transition cursor-pointer"
          >
            {t.saveAndApply}
          </button>
        </div>
      </div>
    </div>
  );
};
