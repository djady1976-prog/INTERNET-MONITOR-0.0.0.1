import { SupportedLanguage } from '../i18n/translations';
export type { SupportedLanguage };

export type NeonTheme = 'cyan' | 'emerald' | 'magenta' | 'amber' | 'violet';

export interface ThemeColors {
  name: string;
  primary: string;
  primaryHex: string;
  glowClass: string;
  borderClass: string;
  textClass: string;
  bgGlowClass: string;
  accent: string;
  accentHex: string;
}

export interface PingResult {
  host: string;
  name: string;
  ip: string;
  ping: number; // ms
  status: 'online' | 'warning' | 'offline';
  history: number[];
  packetLoss: number;
  jitter: number;
}

export interface NetworkTelemetry {
  ipV4: string;
  ipV6: string;
  isp: string;
  asn: string;
  city: string;
  country: string;
  gateway: string;
  dnsServer: string;
  mtu: number;
  adapterName: string;
  connectionType: string;
  downlink: number;
  effectiveType: string;
  rtt: number;
  tlsVersion: string;
  httpProtocol: string;
  lastUpdated: string;
}

export interface DiagnosticLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  source: string;
}

export interface QoSMetrics {
  gaming: number; // 0 - 100
  streaming4k: number;
  voip: number;
  browsing: number;
  cloudSync: number;
  bufferbloatGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
}

export type DeviceType = 'computer' | 'router' | 'secondary_gateway' | 'extender' | 'iot_gateway' | 'cellular_backup' | 'nas';

export interface TopologyNode {
  id: string;
  name: string;
  type: DeviceType;
  ip: string;
  mac: string;
  status: 'online' | 'standby' | 'busy' | 'offline';
  ping: number; // ms
  linkSpeed: string;
  linkType: 'ethernet' | 'wifi6' | 'wifi5' | 'fiber' | 'cellular' | 'bridge';
  role: string;
  connectedTo: string[];
  txPackets?: number;
  rxPackets?: number;
  details?: string;
  isGateway?: boolean;
}

export interface TopologyLink {
  id: string;
  source: string;
  target: string;
  speed: string;
  type: 'ethernet' | 'wifi6' | 'wifi5' | 'fiber' | 'cellular' | 'bridge';
  latency: number;
  active: boolean;
}

export interface WidgetConfig {
  id: string;
  title: string;
  category: 'gauges' | 'latency' | 'speed' | 'servers' | 'hops' | 'qos' | 'protocol' | 'histogram' | 'packets' | 'bandwidth' | 'details' | 'logs' | 'topology' | 'about';
  visible: boolean;
  colSpan: 'full' | 'half' | 'third';
}

export interface SpeedTestState {
  isRunning: boolean;
  phase: 'idle' | 'ping' | 'download' | 'upload' | 'complete';
  downloadMbps: number;
  uploadMbps: number;
  pingMs: number;
  jitterMs: number;
  progress: number; // 0 - 100
}
