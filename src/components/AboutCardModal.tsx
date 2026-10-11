import React from 'react';
import { ThemeColors, SupportedLanguage } from '../types';
import { translations } from '../i18n/translations';
import { cyberSound } from '../utils/cyberSound';
import {
  X,
  Code2,
  Cpu,
  ShieldCheck,
  Zap,
  Globe2,
  Terminal,
  Activity,
  Award,
  Sparkles,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeColors;
  lang: SupportedLanguage;
}

export const AboutCardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  theme,
  lang,
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div
        className="w-full max-w-xl bg-[#090d16] border rounded-2xl shadow-2xl overflow-hidden flex flex-col relative"
        style={{
          borderColor: `${theme.primaryHex}66`,
          boxShadow: `0 0 30px ${theme.primaryHex}33`,
        }}
      >
        {/* Glowing Ambient Corner Accents */}
        <div
          className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ backgroundColor: theme.primaryHex }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: '#a855f7' }}
        />

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#070a10]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white tracking-wide">
              {t.aboutTitle}
            </h2>
          </div>
          <button
            onClick={() => {
              cyberSound.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-sm text-slate-300 overflow-y-auto max-h-[80vh] relative z-10">
          {/* Main Hero Card: DEVELOPED BY: ANDREI ADRIAN BUTA */}
          <div
            className="p-5 rounded-2xl bg-[#0d1424] border relative overflow-hidden text-center flex flex-col items-center justify-center gap-3 shadow-xl"
            style={{
              borderColor: `${theme.primaryHex}88`,
              boxShadow: `0 0 20px ${theme.primaryHex}22, inset 0 0 20px ${theme.primaryHex}11`,
            }}
          >
            {/* Holographic scanner top highlight */}
            <div
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"
              style={{ filter: `drop-shadow(0 0 8px ${theme.primaryHex})` }}
            />

            {/* Avatar / Developer Badge Icon */}
            <div
              className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-0.5 flex items-center justify-center shadow-lg"
              style={{ boxShadow: `0 0 20px ${theme.primaryHex}66` }}
            >
              <div className="w-full h-full bg-[#0a0f1d] rounded-[14px] flex items-center justify-center">
                <Code2 className="w-8 h-8 text-cyan-400" />
              </div>
            </div>

            {/* EXACT REQUIRED TEXT IN PROMINENT GLOWING NEON STYLE */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-semibold block">
                CREATOR & LEAD ARCHITECT
              </span>
              <h3
                className="text-lg sm:text-xl font-black font-mono tracking-wider text-white select-all px-3 py-1 rounded-lg"
                style={{
                  textShadow: `0 0 15px ${theme.primaryHex}, 0 0 30px ${theme.primaryHex}88`,
                  color: '#ffffff',
                }}
              >
                DEVELOPED BY: ANDREI ADRIAN BUTA
              </h3>
              <p className="text-xs text-cyan-300/90 font-mono font-medium">
                {t.developerRole}
              </p>
            </div>

            {/* Certification pill */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono mt-1">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Official Release Certified · Windows Pro 64-bit</span>
            </div>
          </div>

          {/* App Telemetry & System Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#080d16] border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Activity className="w-4 h-4" />
                <span>NetPulse Neon Core</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                {t.appVersion}
              </p>
              <p className="text-slate-500 text-[10px]">
                {t.engineBuild}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#080d16] border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Security & Runtime</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Zero-Telemetry Private Sandbox
              </p>
              <p className="text-slate-500 text-[10px]">
                Offline-First PWA & Standalone Shell
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#080d16] border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Globe2 className="w-4 h-4" />
                <span>Multi-Language Engine</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Română · English · Italiano · Deutsch
              </p>
              <p className="text-slate-500 text-[10px]">
                Runtime Reactive i18n Switcher
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#080d16] border border-white/5 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Cpu className="w-4 h-4" />
                <span>Audio HUD & DSP</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Web Audio API 44.1kHz Synthesizer
              </p>
              <p className="text-slate-500 text-[10px]">
                Dynamic Oscilloscope Signal Generator
              </p>
            </div>
          </div>

          {/* Subsystems Summary */}
          <div className="p-3.5 rounded-xl bg-[#080d16] border border-white/5 text-xs space-y-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Integrated Modules
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-cyan-400" /> Real-Time Latency Area Graph
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-cyan-400" /> Local LAN Node-Link Topology
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-cyan-400" /> Multi-Server DNS Ping Matrix
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-cyan-400" /> Secondary Gateway Discovery
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-cyan-400" /> Speedtest Pro Multi-Stream
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-cyan-400" /> Quality of Service (QoS) Radar
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-white/10 bg-[#070a10] flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            NetPulse Neon © 2026 · All Rights Reserved
          </span>
          <button
            onClick={() => {
              cyberSound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
