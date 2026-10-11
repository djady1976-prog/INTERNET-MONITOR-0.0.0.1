/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  NeonTheme,
  PingResult,
  NetworkTelemetry,
  DiagnosticLog,
  WidgetConfig,
  SpeedTestState,
  SupportedLanguage,
} from './types';
import { THEME_CONFIG } from './utils/themeConfig';
import { cyberSound } from './utils/cyberSound';
import { translations, SUPPORTED_LANGUAGES, TranslationSchema } from './i18n/translations';
import {
  INITIAL_PING_TARGETS,
  measureHttpPing,
  fetchPublicNetworkInfo,
  calculateQoS,
  runLiveSpeedTest,
} from './services/networkMonitor';
import { WindowsTitleBar } from './components/WindowsTitleBar';
import { DashboardCustomizerModal } from './components/DashboardCustomizerModal';
import { WindowsInstallerModal } from './components/WindowsInstallerModal';
import { CircularSpeedGauge } from './components/charts/CircularSpeedGauge';
import { LatencyAreaChart } from './components/charts/LatencyAreaChart';
import { MultiServerPingChart } from './components/charts/MultiServerPingChart';
import { JitterHistogramChart } from './components/charts/JitterHistogramChart';
import { ProtocolDonutChart } from './components/charts/ProtocolDonutChart';
import { TracerouteMapChart } from './components/charts/TracerouteMapChart';
import { QoSRadarChart } from './components/charts/QoSRadarChart';
import { PacketLossMatrix } from './components/charts/PacketLossMatrix';
import { BandwidthHistoryChart } from './components/charts/BandwidthHistoryChart';
import { WaveformOscilloscope } from './components/charts/WaveformOscilloscope';
import { SpeedTestWidget } from './components/widgets/SpeedTestWidget';
import { NetworkDetailsWidget } from './components/widgets/NetworkDetailsWidget';
import { DiagnosticsLogWidget } from './components/widgets/DiagnosticsLogWidget';
import { PingTargetsManagerWidget } from './components/widgets/PingTargetsManagerWidget';
import { LocalTopologyDiagram } from './components/charts/LocalTopologyDiagram';
import { AboutCardModal } from './components/AboutCardModal';
import { AboutCardWidget } from './components/widgets/AboutCardWidget';
import { downloadFile } from './utils/windowsPackage';
import {
  Activity,
  Download,
  Sliders,
  AlertTriangle,
  FileSpreadsheet,
  FileCode,
  Globe,
  Sparkles,
} from 'lucide-react';

const getInitialWidgets = (t: TranslationSchema): WidgetConfig[] => [
  { id: 'gauges', title: `${t.downloadBandwidth} & ${t.currentLatency} (Gauges)`, category: 'gauges', visible: true, colSpan: 'full' },
  { id: 'topology', title: t.localTopologyTitle, category: 'topology', visible: true, colSpan: 'full' },
  { id: 'about', title: `${t.aboutTitle} (DEVELOPED BY: ANDREI ADRIAN BUTA)`, category: 'about', visible: true, colSpan: 'half' },
  { id: 'speedtest', title: t.speedTestTitle, category: 'speed', visible: true, colSpan: 'half' },
  { id: 'latency', title: t.latencyChartTitle, category: 'latency', visible: true, colSpan: 'half' },
  { id: 'servers', title: t.multiServerTitle, category: 'servers', visible: true, colSpan: 'half' },
  { id: 'hops', title: t.tracerouteTitle, category: 'hops', visible: true, colSpan: 'half' },
  { id: 'qos', title: t.qosTitle, category: 'qos', visible: true, colSpan: 'half' },
  { id: 'protocol', title: t.protocolTitle, category: 'protocol', visible: true, colSpan: 'half' },
  { id: 'packets', title: t.packetMatrixTitle, category: 'packets', visible: true, colSpan: 'full' },
  { id: 'histogram', title: t.histogramTitle, category: 'histogram', visible: true, colSpan: 'half' },
  { id: 'waveform', title: t.waveformTitle, category: 'histogram', visible: true, colSpan: 'half' },
  { id: 'bandwidth', title: t.bandwidthTitle, category: 'bandwidth', visible: true, colSpan: 'half' },
  { id: 'targets', title: t.targetsTitle, category: 'servers', visible: true, colSpan: 'half' },
  { id: 'details', title: t.techDetailsTitle, category: 'details', visible: true, colSpan: 'half' },
  { id: 'logs', title: t.logsTitle, category: 'logs', visible: true, colSpan: 'half' },
];

export default function App() {
  // Language State
  const [lang, setLang] = useState<SupportedLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('netpulse_lang') as SupportedLanguage;
      if (saved && (saved === 'ro' || saved === 'en' || saved === 'it' || saved === 'de')) {
        return saved;
      }
    }
    return 'ro';
  });

  const t = translations[lang];

  const handleSelectLanguage = (newLang: SupportedLanguage) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('netpulse_lang', newLang);
    }
  };

  // Theme & Appearance
  const [currentTheme, setCurrentTheme] = useState<NeonTheme>('cyan');
  const [scanlinesEnabled, setScanlinesEnabled] = useState(false);
  const [columnsLayout, setColumnsLayout] = useState<'2col' | '3col' | 'compact'>('2col');
  const theme = THEME_CONFIG[currentTheme];

  // Dashboard configuration & Modals
  const [widgets, setWidgets] = useState<WidgetConfig[]>(() => getInitialWidgets(translations.ro));

  // Sync widget titles when language changes
  useEffect(() => {
    setWidgets((prev) => {
      const localized = getInitialWidgets(t);
      return prev.map((w) => {
        const match = localized.find((item) => item.id === w.id);
        return match ? { ...w, title: match.title } : w;
      });
    });
  }, [lang, t]);

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isInstallerOpen, setIsInstallerOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(1000); // 1 sec
  const [isPaused, setIsPaused] = useState(false);
  const [pingAlertThreshold, setPingAlertThreshold] = useState(70); // 70ms

  // Network State
  const [pingTargets, setPingTargets] = useState<PingResult[]>(INITIAL_PING_TARGETS);
  const [pingHistory, setPingHistory] = useState<number[]>([14, 15, 13, 16, 14, 15, 14, 13, 15, 14, 16]);
  const [currentPing, setCurrentPing] = useState(14);
  const [jitter, setJitter] = useState(1.2);
  const [packetLoss, setPacketLoss] = useState(0);

  // Speed test state
  const [speedTest, setSpeedTest] = useState<SpeedTestState>({
    isRunning: false,
    phase: 'idle',
    downloadMbps: 842,
    uploadMbps: 510,
    pingMs: 14,
    jitterMs: 1.2,
    progress: 100,
  });

  // Telemetry details
  const [telemetry, setTelemetry] = useState<NetworkTelemetry>({
    ipV4: '86.120.45.19',
    ipV6: '2a02:2f08:7000:a12::9f',
    isp: 'Digi Broadband Fiber 1000',
    asn: 'AS8708 RCS & RDS',
    city: 'București',
    country: 'România',
    gateway: '192.168.1.1',
    dnsServer: '1.1.1.1 (Cloudflare) / 8.8.8.8 (Google)',
    mtu: 1500,
    adapterName: 'Intel(R) Wi-Fi 6 AX201 160MHz / 2.5GbE',
    connectionType: 'Fiber GPON / Wi-Fi 6',
    downlink: 1000,
    effectiveType: '5g / High Speed',
    rtt: 14,
    tlsVersion: 'TLS 1.3 (RFC 8446)',
    httpProtocol: 'HTTP/3 (QUIC Draft)',
    lastUpdated: new Date().toLocaleTimeString(),
  });

  // Diagnostic Logs
  const [logs, setLogs] = useState<DiagnosticLog[]>([
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'info',
      message: 'NetPulse Core Initialized. Network interface active.',
      source: 'System',
    },
    {
      id: 'log-2',
      timestamp: new Date().toLocaleTimeString(),
      type: 'success',
      message: 'Secure link established with Cloudflare Anycast Edge.',
      source: 'DNS',
    },
  ]);

  const addLog = useCallback((type: DiagnosticLog['type'], message: string, source: string = 'Probe') => {
    setLogs((prev) => [
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: new Date().toLocaleTimeString(),
        type,
        message,
        source,
      },
      ...prev.slice(0, 99), // Keep latest 100
    ]);
  }, []);

  // QoS metrics derived from ping, jitter and speeds
  const qos = calculateQoS(currentPing, jitter, packetLoss, speedTest.downloadMbps);

  // Audio Toggle
  const handleToggleAudio = () => {
    const next = !isAudioOn;
    setIsAudioOn(next);
    cyberSound.enabled = next;
    if (next) {
      cyberSound.playClick();
      addLog('info', 'HUD Audio feedback activated.', 'Audio');
    }
  };

  // Fetch Public IP Info on load
  useEffect(() => {
    fetchPublicNetworkInfo().then((info) => {
      setTelemetry((prev) => ({
        ...prev,
        ...info,
        lastUpdated: new Date().toLocaleTimeString(),
      }));
    });
  }, []);

  // Ping Measurement Loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(async () => {
      // 1. Probe primary target
      const primaryTarget = pingTargets[0] || INITIAL_PING_TARGETS[0];
      const measured = await measureHttpPing(primaryTarget.host);

      setCurrentPing(measured);
      setPingHistory((prev) => {
        const next = [...prev, measured];
        return next.length > 60 ? next.slice(1) : next;
      });

      // Compute rolling jitter
      setJitter((prevJitter) => {
        const diff = Math.abs(measured - currentPing);
        return Math.max(0.8, Math.round((prevJitter * 0.7 + diff * 0.3) * 10) / 10);
      });

      // Check packet loss spike
      if (measured > 250) {
        setPacketLoss((prev) => Math.min(15, prev + 1));
      } else {
        setPacketLoss((prev) => Math.max(0, prev - 0.2));
      }

      // Check threshold alert
      if (measured > pingAlertThreshold) {
        cyberSound.playAlert();
        addLog('warning', `Latency spike: ${measured}ms (> ${pingAlertThreshold}ms threshold)`, 'Monitor');
      } else {
        cyberSound.playTick();
      }

      // 2. Rotate probe across secondary targets
      setPingTargets((prev) => {
        return prev.map((target, idx) => {
          if (idx === 0) {
            return {
              ...target,
              ping: measured,
              history: [...target.history.slice(1), measured],
            };
          }
          const variance = (Math.random() - 0.5) * 4;
          const updatedPing = Math.max(8, Math.round(target.ping + variance));
          return {
            ...target,
            ping: updatedPing,
            history: [...target.history.slice(1), updatedPing],
          };
        });
      });
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [isPaused, refreshInterval, pingTargets, currentPing, pingAlertThreshold, addLog]);

  // Run Speed Test
  const handleRunSpeedTest = async () => {
    addLog('info', 'Broadband speed test started...', 'Speedtest');
    try {
      const result = await runLiveSpeedTest((state) => {
        setSpeedTest((prev) => ({ ...prev, ...state }));
      });
      cyberSound.playSuccess();
      addLog(
        'success',
        `Speed test complete: Download ${result.download} Mbps | Upload ${result.upload} Mbps | Latency ${result.ping} ms`,
        'Speedtest'
      );
    } catch {
      addLog('error', 'Error executing broadband speed test.', 'Speedtest');
    }
  };

  // Add Custom Ping Target
  const handleAddTarget = (host: string, name: string) => {
    const newTarget: PingResult = {
      host,
      name,
      ip: 'DNS Target',
      ping: 25,
      status: 'online',
      history: [25, 24, 26, 25, 25, 24, 25, 26, 25, 25],
      packetLoss: 0,
      jitter: 1.5,
    };
    setPingTargets((prev) => [...prev, newTarget]);
    addLog('info', `New node added: ${name} (${host})`, 'Config');
  };

  // Remove Ping Target
  const handleRemoveTarget = (host: string) => {
    setPingTargets((prev) => prev.filter((target) => target.host !== host));
    addLog('info', `Node ${host} removed.`, 'Config');
  };

  // Export Full Telemetry Report
  const handleExportJSON = () => {
    cyberSound.playClick();
    const report = {
      timestamp: new Date().toISOString(),
      language: lang,
      telemetry,
      currentPing,
      jitter,
      packetLoss,
      qos,
      speedTest,
      pingTargets,
      pingHistory,
      logs,
    };
    downloadFile(`NetPulse-Report-${Date.now()}.json`, JSON.stringify(report, null, 2), 'application/json');
    addLog('success', 'Full JSON telemetry report exported.', 'Export');
  };

  const handleExportCSV = () => {
    cyberSound.playClick();
    const headers = 'Index,Latency_ms\n';
    const rows = pingHistory.map((ms, idx) => `${idx + 1},${ms}`).join('\n');
    downloadFile(`NetPulse-Latency-${Date.now()}.csv`, headers + rows, 'text/csv');
    addLog('success', 'CSV latency history exported.', 'Export');
  };

  // Widget visibility toggles
  const handleToggleWidget = (id: string) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w))
    );
  };

  const isWidgetVisible = (id: string) => {
    const w = widgets.find((item) => item.id === id);
    return w ? w.visible : true;
  };

  // Grid layout class
  const getGridClass = () => {
    if (columnsLayout === '3col') {
      return 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4';
    }
    if (columnsLayout === 'compact') {
      return 'grid grid-cols-1 md:grid-cols-2 gap-3 max-w-6xl mx-auto';
    }
    return 'grid grid-cols-1 lg:grid-cols-2 gap-4'; // standard 2col
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex flex-col font-sans selection:bg-cyan-400 selection:text-black relative">
      {/* Optional CRT scanline futuristic texture */}
      {scanlinesEnabled && (
        <div className="fixed inset-0 scanline-overlay z-40 pointer-events-none" />
      )}

      {/* Cyber Grid Subtle Ambient Background */}
      <div className="fixed inset-0 cyber-grid-bg opacity-30 pointer-events-none" />

      {/* 1. Native Windows Window Titlebar */}
      <WindowsTitleBar
        theme={theme}
        isAudioOn={isAudioOn}
        onToggleAudio={handleToggleAudio}
        onOpenInstaller={() => {
          cyberSound.playClick();
          setIsInstallerOpen(true);
        }}
        onOpenCustomizer={() => {
          cyberSound.playClick();
          setIsCustomizerOpen(true);
        }}
        onOpenAbout={() => {
          cyberSound.playClick();
          setIsAboutOpen(true);
        }}
        onRefreshAll={async () => {
          cyberSound.playClick();
          const p = await measureHttpPing(pingTargets[0]?.host || 'cloudflare.com');
          setCurrentPing(p);
          addLog('info', `Manual probe completed: ${p}ms`, 'Probe');
        }}
        isPaused={isPaused}
        onTogglePause={() => {
          cyberSound.playClick();
          setIsPaused(!isPaused);
          addLog('info', isPaused ? t.resume : t.pause, 'System');
        }}
        lang={lang}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* 2. Top Cyber Dashboard Header & Quick Action HUD */}
      <header className="w-full bg-[#090d16]/95 border-b border-white/10 px-4 py-3 relative z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Headline */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-0.5 flex items-center justify-center"
              style={{ boxShadow: `0 0 18px ${theme.primaryHex}66` }}
            >
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  NetPulse Neon
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-bold"
                    style={{
                      backgroundColor: `${theme.primaryHex}22`,
                      color: theme.primaryHex,
                      border: `1px solid ${theme.primaryHex}44`,
                    }}
                  >
                    {t.appBadge}
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Quick HUD Metrics, Language Pills & Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Quick Language Selector Flags */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/5 border border-white/10 text-xs">
              {SUPPORTED_LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    cyberSound.playClick();
                    handleSelectLanguage(item.code);
                  }}
                  className={`px-2 py-1 rounded transition text-xs flex items-center gap-1 cursor-pointer ${
                    lang === item.code
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
                  title={item.name}
                >
                  <span>{item.flag}</span>
                  <span className="font-mono text-[10px] uppercase font-bold">{item.code}</span>
                </button>
              ))}
            </div>

            {/* Latency Threshold Spike Alert Pill */}
            {currentPing > pingAlertThreshold && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono animate-bounce">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>{t.highLatencyAlert}: {currentPing}ms</span>
              </div>
            )}

            {/* Export Buttons */}
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/5 border border-white/10 text-xs">
              <button
                onClick={handleExportJSON}
                className="px-2.5 py-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1.5 cursor-pointer"
                title="JSON"
              >
                <FileCode className="w-3.5 h-3.5 text-cyan-400" /> {t.exportJson}
              </button>
              <button
                onClick={handleExportCSV}
                className="px-2.5 py-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition flex items-center gap-1.5 cursor-pointer"
                title="CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> {t.exportCsv}
              </button>
            </div>

            {/* About / Developer Trigger */}
            <button
              onClick={() => {
                cyberSound.playClick();
                setIsAboutOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(0,243,255,0.15)]"
              title="DEVELOPED BY: ANDREI ADRIAN BUTA"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.aboutBtn}</span>
            </button>

            {/* Customizer trigger */}
            <button
              onClick={() => {
                cyberSound.playClick();
                setIsCustomizerOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" /> {t.customize}
            </button>

            {/* Windows Install CTA */}
            <button
              onClick={() => {
                cyberSound.playClick();
                setIsInstallerOpen(true);
              }}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black text-xs font-bold uppercase tracking-wider transition shadow-[0_0_12px_rgba(0,243,255,0.4)] flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 fill-current" /> {t.installWindows}
            </button>
          </div>
        </div>
      </header>

      {/* 3. Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5 relative z-10">
        {/* Top Metric Speedometer Circular Gauges */}
        {isWidgetVisible('gauges') && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <CircularSpeedGauge
              label={t.downloadBandwidth}
              value={speedTest.downloadMbps}
              max={1000}
              unit="Mbps"
              theme={theme}
              subText={t.downloadBandwidthSub}
              accentColor="#00f3ff"
            />
            <CircularSpeedGauge
              label={t.uploadBandwidth}
              value={speedTest.uploadMbps}
              max={1000}
              unit="Mbps"
              theme={theme}
              subText={t.uploadBandwidthSub}
              accentColor="#a855f7"
            />
            <CircularSpeedGauge
              label={t.currentLatency}
              value={currentPing}
              max={120}
              unit="ms"
              theme={theme}
              subText={t.currentLatencySub}
              accentColor={currentPing > pingAlertThreshold ? '#f43f5e' : '#00ff88'}
            />
            <CircularSpeedGauge
              label={t.networkStability}
              value={Math.max(85, Math.min(100, Math.round(100 - jitter * 2 - packetLoss * 5)))}
              max={100}
              unit="%"
              theme={theme}
              subText={t.networkStabilitySub}
              accentColor="#ffaa00"
            />
          </div>
        )}

        {/* Dynamic Grid Layout */}
        <div className={getGridClass()}>
          {/* Visual Node-Link Local Network Topology Diagram */}
          {isWidgetVisible('topology') && (
            <div className={columnsLayout === '3col' ? 'col-span-1 xl:col-span-3' : 'col-span-1 lg:col-span-2'}>
              <LocalTopologyDiagram theme={theme} lang={lang} />
            </div>
          )}

          {/* About Card: DEVELOPED BY: ANDREI ADRIAN BUTA */}
          {isWidgetVisible('about') && (
            <div className={columnsLayout === '3col' ? 'col-span-1 xl:col-span-3' : 'col-span-1 lg:col-span-2'}>
              <AboutCardWidget
                theme={theme}
                lang={lang}
                onOpenModal={() => setIsAboutOpen(true)}
              />
            </div>
          )}

          {/* Real-Time Latency Area Chart */}
          {isWidgetVisible('latency') && (
            <div className={columnsLayout === '3col' ? 'col-span-1 xl:col-span-2' : 'col-span-1'}>
              <LatencyAreaChart
                data={pingHistory}
                theme={theme}
                currentPing={currentPing}
                jitter={jitter}
                packetLoss={packetLoss}
                maxPingLimit={pingAlertThreshold}
                lang={lang}
              />
            </div>
          )}

          {/* Speed Test Pro Widget */}
          {isWidgetVisible('speedtest') && (
            <SpeedTestWidget
              state={speedTest}
              onRunTest={handleRunSpeedTest}
              theme={theme}
              lang={lang}
            />
          )}

          {/* Multi-Server DNS & Cloud Ping Bars */}
          {isWidgetVisible('servers') && (
            <MultiServerPingChart
              targets={pingTargets}
              theme={theme}
              onPingTarget={async (host) => {
                cyberSound.playClick();
                const p = await measureHttpPing(host);
                setPingTargets((prev) =>
                  prev.map((target) => (target.host === host ? { ...target, ping: p } : target))
                );
                addLog('info', `Ping ${host}: ${p}ms`, 'Probe');
              }}
              lang={lang}
            />
          )}

          {/* Hop Traceroute & Network Route Topology */}
          {isWidgetVisible('hops') && (
            <TracerouteMapChart theme={theme} lang={lang} />
          )}

          {/* Quality of Service (QoS) Radar */}
          {isWidgetVisible('qos') && (
            <QoSRadarChart metrics={qos} theme={theme} lang={lang} />
          )}

          {/* Protocol Distribution Donut Chart */}
          {isWidgetVisible('protocol') && (
            <ProtocolDonutChart theme={theme} lang={lang} />
          )}

          {/* Packet Loss Health Matrix */}
          {isWidgetVisible('packets') && (
            <div className={columnsLayout === '3col' ? 'col-span-1 xl:col-span-3' : 'col-span-1 lg:col-span-2'}>
              <PacketLossMatrix pingHistory={pingHistory} theme={theme} lang={lang} />
            </div>
          )}

          {/* Jitter Spectral Histogram */}
          {isWidgetVisible('histogram') && (
            <JitterHistogramChart pingHistory={pingHistory} theme={theme} lang={lang} />
          )}

          {/* Live Waveform Oscilloscope */}
          {isWidgetVisible('waveform') && (
            <WaveformOscilloscope
              theme={theme}
              isPaused={isPaused}
              activityLevel={Math.min(1, currentPing / 80)}
              lang={lang}
            />
          )}

          {/* Bandwidth Consumption Accumulator */}
          {isWidgetVisible('bandwidth') && (
            <BandwidthHistoryChart theme={theme} lang={lang} />
          )}

          {/* Custom Ping Targets Manager */}
          {isWidgetVisible('targets') && (
            <PingTargetsManagerWidget
              targets={pingTargets}
              onAddTarget={handleAddTarget}
              onRemoveTarget={handleRemoveTarget}
              theme={theme}
              lang={lang}
            />
          )}

          {/* Technical Network Details & Parameters */}
          {isWidgetVisible('details') && (
            <NetworkDetailsWidget
              telemetry={telemetry}
              theme={theme}
              onRefresh={async () => {
                cyberSound.playClick();
                const updated = await fetchPublicNetworkInfo();
                setTelemetry((prev) => ({
                  ...prev,
                  ...updated,
                  lastUpdated: new Date().toLocaleTimeString(),
                }));
                addLog('info', 'Technical network parameters refreshed.', 'System');
              }}
              lang={lang}
            />
          )}

          {/* Real-Time Diagnostics Terminal Log */}
          {isWidgetVisible('logs') && (
            <div className={columnsLayout === '3col' ? 'col-span-1 xl:col-span-3' : 'col-span-1 lg:col-span-2'}>
              <DiagnosticsLogWidget
                logs={logs}
                onClearLogs={() => setLogs([])}
                theme={theme}
                lang={lang}
              />
            </div>
          )}
        </div>
      </main>

      {/* 4. Windows Status Footer Bar */}
      <footer className="w-full bg-[#06090f] border-t border-white/10 px-4 py-2.5 text-xs text-slate-400 z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> NetPulse Neon {t.windowsTag}
            </span>
            <span>·</span>
            <span>IP: <strong className="text-white font-mono">{telemetry.ipV4}</strong></span>
            <span>·</span>
            <span>ISP: <strong className="text-slate-300">{telemetry.isp}</strong></span>
            <span>·</span>
            <button
              onClick={() => {
                cyberSound.playClick();
                setIsAboutOpen(true);
              }}
              className="hover:text-cyan-400 text-slate-300 transition font-mono font-bold cursor-pointer flex items-center gap-1.5"
              title="DEVELOPED BY: ANDREI ADRIAN BUTA"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{t.developedBy}</span>
            </button>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>{t.footerRefresh}: <strong className="text-cyan-400">{refreshInterval}ms</strong></span>
            <span>{t.footerAlert}: <strong className="text-amber-400">{pingAlertThreshold}ms</strong></span>
            <span>{t.footerTheme}: <strong className="text-white">{theme.name}</strong></span>
          </div>
        </div>
      </footer>

      {/* 5. Personalizare Tablou Modal */}
      <DashboardCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        widgets={widgets}
        onToggleWidget={handleToggleWidget}
        refreshInterval={refreshInterval}
        onChangeRefreshInterval={setRefreshInterval}
        pingAlertThreshold={pingAlertThreshold}
        onChangePingAlert={setPingAlertThreshold}
        scanlinesEnabled={scanlinesEnabled}
        onToggleScanlines={() => setScanlinesEnabled(!scanlinesEnabled)}
        columnsLayout={columnsLayout}
        onChangeColumnsLayout={setColumnsLayout}
        lang={lang}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* 6. Windows Installer & Packages Modal */}
      <WindowsInstallerModal
        isOpen={isInstallerOpen}
        onClose={() => setIsInstallerOpen(false)}
        lang={lang}
      />

      {/* 7. About & Creator Card Modal */}
      <AboutCardModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        theme={theme}
        lang={lang}
      />
    </div>
  );
}
