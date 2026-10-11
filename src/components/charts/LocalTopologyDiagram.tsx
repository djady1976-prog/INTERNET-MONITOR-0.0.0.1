import React, { useState, useEffect } from 'react';
import {
  ThemeColors,
  SupportedLanguage,
  TopologyNode,
  TopologyLink,
  DeviceType,
} from '../../types';
import {
  Network,
  Monitor,
  Router,
  Radio,
  Cpu,
  Smartphone,
  HardDrive,
  Globe,
  RefreshCw,
  Zap,
  Activity,
  Plus,
  X,
  Layers,
  Share2,
} from 'lucide-react';
import { translations } from '../../i18n/translations';
import { cyberSound } from '../../utils/cyberSound';

interface Props {
  theme: ThemeColors;
  lang: SupportedLanguage;
}

export const LocalTopologyDiagram: React.FC<Props> = ({ theme, lang }) => {
  const t = translations[lang];

  // Default initial topology nodes
  const [nodes, setNodes] = useState<TopologyNode[]>([
    {
      id: 'node-pc',
      name: t.deviceHostPC,
      type: 'computer',
      ip: '192.168.1.104',
      mac: '00:1A:2B:3C:4D:5E',
      status: 'online',
      ping: 0.2,
      linkSpeed: '2400 Mbps',
      linkType: 'wifi6',
      role: 'Host Station (Win64)',
      connectedTo: ['node-router'],
      txPackets: 28419,
      rxPackets: 49102,
      details: 'Intel Wi-Fi 6 AX201 160MHz · 802.11ax MIMO · -42 dBm RSSI',
    },
    {
      id: 'node-router',
      name: t.deviceMainRouter,
      type: 'router',
      ip: '192.168.1.1',
      mac: '74:83:C2:11:A4:90',
      status: 'online',
      ping: 0.8,
      linkSpeed: '2.5 Gbps',
      linkType: 'fiber',
      role: 'Primary Gateway & DHCP Server',
      connectedTo: ['node-wan'],
      isGateway: true,
      txPackets: 981420,
      rxPackets: 1420390,
      details: 'Wi-Fi 6 AX3000 GPON Gateway · NAT / SPI Firewall / IPv6 Router',
    },
    {
      id: 'node-extender',
      name: t.deviceMeshExtender,
      type: 'secondary_gateway',
      ip: '192.168.1.2',
      mac: '74:83:C2:55:B1:02',
      status: 'online',
      ping: 1.1,
      linkSpeed: '1200 Mbps',
      linkType: 'wifi6',
      role: 'Secondary Mesh Gateway / AP Node',
      connectedTo: ['node-router'],
      isGateway: true,
      txPackets: 154200,
      rxPackets: 289400,
      details: 'Wireless Backhaul 5GHz Channel 48 · 802.11k/v Fast Roaming',
    },
    {
      id: 'node-iot',
      name: t.deviceIoTGateway,
      type: 'iot_gateway',
      ip: '192.168.1.10',
      mac: 'E0:4F:43:88:21:BC',
      status: 'online',
      ping: 1.4,
      linkSpeed: '100 Mbps',
      linkType: 'ethernet',
      role: 'Secondary IoT Subnet Gateway (VLAN 20)',
      connectedTo: ['node-router'],
      isGateway: true,
      txPackets: 42100,
      rxPackets: 38900,
      details: 'Zigbee 3.0 / Thread Border Router · 24 Connected Smart Sensors',
    },
    {
      id: 'node-cellular',
      name: t.deviceCellularBackup,
      type: 'cellular_backup',
      ip: '192.168.2.1',
      mac: '88:E3:AB:12:09:44',
      status: 'standby',
      ping: 18.5,
      linkSpeed: '150 Mbps',
      linkType: 'cellular',
      role: 'Standby Failover Gateway (Dual-WAN)',
      connectedTo: ['node-router'],
      isGateway: true,
      txPackets: 1200,
      rxPackets: 2400,
      details: 'LTE-Advanced Cat12 Standby Tunnel · Hot-Spare Auto Failover',
    },
    {
      id: 'node-nas',
      name: t.deviceNasGateway,
      type: 'nas',
      ip: '192.168.1.50',
      mac: '00:11:32:98:AA:F4',
      status: 'online',
      ping: 0.9,
      linkSpeed: '1000 Mbps',
      linkType: 'ethernet',
      role: 'SMB Storage & Media Gateway',
      connectedTo: ['node-router'],
      txPackets: 541090,
      rxPackets: 412000,
      details: 'RAID-5 Storage Array · 2x 1GbE LACP Trunking · Jumbo Frames 9000',
    },
    {
      id: 'node-wan',
      name: 'WAN / ISP Cloudflare Edge',
      type: 'router',
      ip: '86.120.45.19',
      mac: 'FF:FF:FF:FF:FF:FF',
      status: 'online',
      ping: 14.2,
      linkSpeed: '1000 Mbps',
      linkType: 'fiber',
      role: 'Public Internet Uplink',
      connectedTo: [],
      txPackets: 1849200,
      rxPackets: 2940120,
      details: 'Digi GPON Fiber OLT · BGP Anycast Routing · MTU 1500',
    },
  ]);

  // Links derived from connections
  const links: TopologyLink[] = [
    {
      id: 'link-pc-router',
      source: 'node-pc',
      target: 'node-router',
      speed: '2400 Mbps',
      type: 'wifi6',
      latency: 0.8,
      active: true,
    },
    {
      id: 'link-router-wan',
      source: 'node-router',
      target: 'node-wan',
      speed: '1000 Mbps',
      type: 'fiber',
      latency: 14.2,
      active: true,
    },
    {
      id: 'link-router-extender',
      source: 'node-router',
      target: 'node-extender',
      speed: '1200 Mbps',
      type: 'wifi6',
      latency: 1.1,
      active: true,
    },
    {
      id: 'link-router-iot',
      source: 'node-router',
      target: 'node-iot',
      speed: '100 Mbps',
      type: 'ethernet',
      latency: 1.4,
      active: true,
    },
    {
      id: 'link-router-cellular',
      source: 'node-router',
      target: 'node-cellular',
      speed: '150 Mbps',
      type: 'cellular',
      latency: 18.5,
      active: false,
    },
    {
      id: 'link-router-nas',
      source: 'node-router',
      target: 'node-nas',
      speed: '1000 Mbps',
      type: 'ethernet',
      latency: 0.9,
      active: true,
    },
  ];

  // States
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-router');
  const [layoutMode, setLayoutMode] = useState<'tree' | 'mesh'>('tree');
  const [filterMode, setFilterMode] = useState<'all' | 'gateways'>('all');
  const [isScanning, setIsScanning] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Sync localized node names when language changes
  useEffect(() => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === 'node-pc') return { ...n, name: t.deviceHostPC };
        if (n.id === 'node-router') return { ...n, name: t.deviceMainRouter };
        if (n.id === 'node-extender') return { ...n, name: t.deviceMeshExtender };
        if (n.id === 'node-iot') return { ...n, name: t.deviceIoTGateway };
        if (n.id === 'node-cellular') return { ...n, name: t.deviceCellularBackup };
        if (n.id === 'node-nas') return { ...n, name: t.deviceNasGateway };
        return n;
      })
    );
  }, [lang, t]);

  // New Custom Device Form
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceIp, setNewDeviceIp] = useState('');
  const [newDeviceType, setNewDeviceType] = useState<DeviceType>('secondary_gateway');

  // Scanning animation
  const handleScan = () => {
    cyberSound.playClick();
    setIsScanning(true);
    setTimeout(() => {
      // randomly update pings slightly to show live dynamism
      setNodes((prev) =>
        prev.map((n) => ({
          ...n,
          ping: Math.max(0.2, Math.round((n.ping + (Math.random() * 0.4 - 0.2)) * 10) / 10),
          txPackets: (n.txPackets || 1000) + Math.floor(Math.random() * 200),
          rxPackets: (n.rxPackets || 1000) + Math.floor(Math.random() * 350),
        }))
      );
      setIsScanning(false);
      cyberSound.playSuccess();
    }, 1400);
  };

  const handlePingSelected = (nodeId: string) => {
    cyberSound.playClick();
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === nodeId) {
          const newPing = Math.max(0.2, Math.round((n.ping + (Math.random() * 0.6 - 0.3)) * 10) / 10);
          return { ...n, ping: newPing };
        }
        return n;
      })
    );
  };

  const handleAddCustomDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName || !newDeviceIp) return;
    cyberSound.playClick();

    const newId = `node-custom-${Date.now()}`;
    const newNode: TopologyNode = {
      id: newId,
      name: newDeviceName,
      type: newDeviceType,
      ip: newDeviceIp,
      mac: `AC:12:${Math.floor(Math.random() * 89 + 10)}:${Math.floor(Math.random() * 89 + 10)}:90:EE`,
      status: 'online',
      ping: Math.round((0.8 + Math.random() * 1.5) * 10) / 10,
      linkSpeed: newDeviceType === 'secondary_gateway' ? '1200 Mbps' : '1000 Mbps',
      linkType: newDeviceType === 'secondary_gateway' ? 'wifi6' : 'ethernet',
      role: 'User Configured Secondary Node',
      connectedTo: ['node-router'],
      isGateway: newDeviceType === 'secondary_gateway' || newDeviceType === 'router',
      txPackets: 1200,
      rxPackets: 2400,
      details: 'Custom Gateway Node added via NetPulse Manager',
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newId);
    setNewDeviceName('');
    setNewDeviceIp('');
    setIsAddModalOpen(false);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  // Filtered nodes
  const visibleNodes = nodes.filter((n) => {
    if (filterMode === 'gateways') {
      return n.isGateway || n.type === 'computer' || n.type === 'router';
    }
    return true;
  });

  const gatewayCount = nodes.filter((n) => n.isGateway).length;

  // Node Icon Helper
  const getNodeIcon = (type: DeviceType, isSelected: boolean) => {
    const iconClass = isSelected ? 'w-5 h-5 text-black' : 'w-5 h-5 text-cyan-400';
    switch (type) {
      case 'computer':
        return <Monitor className={iconClass} />;
      case 'router':
        return <Router className={iconClass} />;
      case 'secondary_gateway':
      case 'extender':
        return <Radio className={iconClass} />;
      case 'iot_gateway':
        return <Cpu className={iconClass} />;
      case 'cellular_backup':
        return <Smartphone className={iconClass} />;
      case 'nas':
        return <HardDrive className={iconClass} />;
      default:
        return <Network className={iconClass} />;
    }
  };

  // Node position calculation for SVG canvas
  // Canvas coordinate space: 800 x 360
  const getNodeCoordinates = (nodeId: string, totalVisible: number, index: number) => {
    if (layoutMode === 'tree') {
      // Tree / Hierarchical View:
      // Left: Host PC -> Router in Center-Left -> Secondary Gateways in Column 3 -> WAN on Right
      switch (nodeId) {
        case 'node-pc':
          return { x: 90, y: 180 };
        case 'node-router':
          return { x: 300, y: 180 };
        case 'node-wan':
          return { x: 710, y: 180 };
        case 'node-extender':
          return { x: 510, y: 70 };
        case 'node-iot':
          return { x: 510, y: 145 };
        case 'node-nas':
          return { x: 510, y: 220 };
        case 'node-cellular':
          return { x: 510, y: 295 };
        default: {
          // Additional custom nodes
          const customOffset = (index % 4) * 60 + 50;
          return { x: 510, y: customOffset };
        }
      }
    } else {
      // Radial / Mesh Orbital View:
      // Center: Primary Router at (400, 180)
      if (nodeId === 'node-router') {
        return { x: 400, y: 180 };
      }
      const otherNodes = visibleNodes.filter((n) => n.id !== 'node-router');
      const otherIndex = otherNodes.findIndex((n) => n.id === nodeId);
      const angle = (Math.PI * 2 / Math.max(1, otherNodes.length)) * otherIndex;
      const radiusX = 280;
      const radiusY = 130;
      return {
        x: 400 + Math.cos(angle) * radiusX,
        y: 180 + Math.sin(angle) * radiusY,
      };
    }
  };

  return (
    <div className="w-full flex flex-col p-4 sm:p-5 rounded-xl bg-[#0c121e]/90 border border-white/5 relative overflow-hidden">
      {/* Top Header & Interactive Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400"
            style={{ boxShadow: `0 0 12px ${theme.primaryHex}44` }}
          >
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              {t.localTopologyTitle}
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {gatewayCount} {t.gatewayDevicesFound}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t.localTopologySubtitle}
            </p>
          </div>
        </div>

        {/* Action Controls & Layout Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Layout Selector */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/40 border border-white/10">
            <button
              onClick={() => {
                cyberSound.playClick();
                setLayoutMode('tree');
              }}
              className={`px-2.5 py-1 rounded transition cursor-pointer flex items-center gap-1.5 ${
                layoutMode === 'tree'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t.topologyLayoutTree}</span>
            </button>
            <button
              onClick={() => {
                cyberSound.playClick();
                setLayoutMode('mesh');
              }}
              className={`px-2.5 py-1 rounded transition cursor-pointer flex items-center gap-1.5 ${
                layoutMode === 'mesh'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t.topologyLayoutMesh}</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/40 border border-white/10">
            <button
              onClick={() => {
                cyberSound.playClick();
                setFilterMode('all');
              }}
              className={`px-2 py-1 rounded transition cursor-pointer ${
                filterMode === 'all' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.allDevices}
            </button>
            <button
              onClick={() => {
                cyberSound.playClick();
                setFilterMode('gateways');
              }}
              className={`px-2 py-1 rounded transition cursor-pointer ${
                filterMode === 'gateways' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.gatewaysOnly}
            </button>
          </div>

          {/* Add Custom Device Button */}
          <button
            onClick={() => {
              cyberSound.playClick();
              setIsAddModalOpen(true);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
            title={t.addCustomDevice}
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">{t.addCustomDevice}</span>
          </button>

          {/* Scan LAN Button */}
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold text-xs transition shadow-[0_0_12px_rgba(0,243,255,0.3)] hover:opacity-95 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? t.scanningTopology : t.scanNetwork}</span>
          </button>
        </div>
      </div>

      {/* Main Visual Node-Link Diagram Canvas */}
      <div className="relative w-full flex-1 min-h-[280px] rounded-xl bg-[#070b14] border border-white/10 overflow-hidden select-none">
        {/* Ambient Grid Background */}
        <div className="absolute inset-0 cyber-grid-bg opacity-40 pointer-events-none" />

        {/* Scanning Radar Wave when scanning */}
        {isScanning && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-pulse pointer-events-none" />
        )}

        <svg viewBox="0 0 800 360" className="w-full h-full overflow-visible">
          <defs>
            {/* Glowing filter for links */}
            <filter id="linkGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Glowing marker for links */}
            <linearGradient id="linkPulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f3ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* 1. Render Links / Edges */}
          {links.map((link) => {
            const sourceNode = visibleNodes.find((n) => n.id === link.source);
            const targetNode = visibleNodes.find((n) => n.id === link.target);

            if (!sourceNode || !targetNode) return null;

            const sourceIdx = visibleNodes.findIndex((n) => n.id === link.source);
            const targetIdx = visibleNodes.findIndex((n) => n.id === link.target);

            const sourcePos = getNodeCoordinates(link.source, visibleNodes.length, sourceIdx);
            const targetPos = getNodeCoordinates(link.target, visibleNodes.length, targetIdx);

            const isIncident = selectedNodeId === link.source || selectedNodeId === link.target;

            let strokeColor = link.active ? theme.primaryHex : '#64748b';
            if (link.type === 'cellular') strokeColor = '#f59e0b';
            if (link.type === 'fiber') strokeColor = '#00ff88';

            // Curved bezier or direct line
            const midX = (sourcePos.x + targetPos.x) / 2;
            const midY = (sourcePos.y + targetPos.y) / 2;
            const pathD = `M ${sourcePos.x} ${sourcePos.y} Q ${midX} ${midY} ${targetPos.x} ${targetPos.y}`;

            return (
              <g key={link.id} className="transition-all duration-300">
                {/* Background Link Line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isIncident ? 3.5 : 2}
                  strokeOpacity={isIncident ? 0.9 : 0.35}
                  strokeDasharray={link.active ? undefined : '5,5'}
                  filter={isIncident ? 'url(#linkGlow)' : undefined}
                />

                {/* Animated Packet Pulse along active link */}
                {link.active && (
                  <circle r={isIncident ? 4 : 2.5} fill="#ffffff" filter="url(#linkGlow)">
                    <animateMotion
                      path={pathD}
                      dur={`${Math.max(1.2, link.latency * 0.15 + 1)}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Speed tag badge on the link */}
                <g transform={`translate(${midX}, ${midY})`}>
                  <rect
                    x="-26"
                    y="-9"
                    width="52"
                    height="18"
                    rx="4"
                    fill="#080e1a"
                    fillOpacity="0.85"
                    stroke={strokeColor}
                    strokeWidth="1"
                    strokeOpacity={isIncident ? 0.9 : 0.3}
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill={isIncident ? '#ffffff' : '#94a3b8'}
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {link.speed}
                  </text>
                </g>
              </g>
            );
          })}

          {/* 2. Render Nodes */}
          {visibleNodes.map((node, idx) => {
            const pos = getNodeCoordinates(node.id, visibleNodes.length, idx);
            const isSelected = selectedNodeId === node.id;

            let badgeColor = '#00f3ff';
            if (node.type === 'router') badgeColor = '#00ff88';
            if (node.isGateway && node.type !== 'router') badgeColor = '#f59e0b';
            if (node.status === 'standby') badgeColor = '#a855f7';

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => {
                  cyberSound.playClick();
                  setSelectedNodeId(node.id);
                }}
                className="cursor-pointer group transition-all"
              >
                {/* Glowing Aura Ring */}
                <circle
                  r={isSelected ? 32 : 24}
                  fill={badgeColor}
                  fillOpacity={isSelected ? 0.2 : 0.05}
                  stroke={badgeColor}
                  strokeWidth={isSelected ? 2 : 1}
                  strokeOpacity={isSelected ? 0.9 : 0.4}
                  style={{ filter: isSelected ? `drop-shadow(0 0 10px ${badgeColor})` : undefined }}
                  className="transition-all duration-300"
                />

                {/* Pulsing beacon if active */}
                {isSelected && (
                  <circle
                    r="28"
                    fill="transparent"
                    stroke={badgeColor}
                    strokeWidth="1.5"
                    className="animate-ping"
                    opacity="0.4"
                  />
                )}

                {/* Node Core Body */}
                <circle
                  r={isSelected ? 20 : 17}
                  fill={isSelected ? badgeColor : '#090f1d'}
                  stroke={badgeColor}
                  strokeWidth="2"
                  className="transition-all"
                />

                {/* ForeignObject Icon */}
                <foreignObject
                  x="-10"
                  y="-10"
                  width="20"
                  height="20"
                  className="pointer-events-none"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {getNodeIcon(node.type, isSelected)}
                  </div>
                </foreignObject>

                {/* Primary Label */}
                <text
                  x="0"
                  y={isSelected ? 38 : 34}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  className="select-none"
                >
                  {node.name.length > 20 ? `${node.name.slice(0, 18)}...` : node.name}
                </text>

                {/* IP Sub-Label */}
                <text
                  x="0"
                  y={isSelected ? 49 : 45}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                  className="select-none"
                >
                  {node.ip} · {node.ping}ms
                </text>

                {/* Gateway Tag Flag if Gateway */}
                {node.isGateway && (
                  <g transform="translate(10, -18)">
                    <rect
                      x="0"
                      y="0"
                      width="38"
                      height="12"
                      rx="3"
                      fill="#f59e0b"
                      fillOpacity="0.25"
                      stroke="#f59e0b"
                      strokeWidth="1"
                    />
                    <text
                      x="19"
                      y="9"
                      textAnchor="middle"
                      fill="#fef08a"
                      fontSize="7"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      GATEWAY
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Detailed Inspector & Action Strip */}
      <div className="mt-3.5 p-3.5 rounded-xl bg-[#080d16] border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0"
            style={{ boxShadow: `0 0 10px ${theme.primaryHex}33` }}
          >
            {getNodeIcon(selectedNode.type, false)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-xs font-bold text-white tracking-wide truncate">
                {selectedNode.name}
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                {selectedNode.ip}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {selectedNode.status === 'online' ? t.statusOnline : t.statusStandby}
              </span>
              {selectedNode.isGateway && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                  {selectedNode.id === 'node-router' ? t.primaryGatewayLabel : t.secondaryGatewayLabel}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              {selectedNode.details}
            </p>
          </div>
        </div>

        {/* Telemetry Metrics on Selected Node */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">{t.linkSpeed}</span>
            <span className="text-cyan-400 font-bold">{selectedNode.linkSpeed}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">{t.currentLatency}</span>
            <span className="text-emerald-400 font-bold">{selectedNode.ping} ms</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">{t.macAddress}</span>
            <span className="text-slate-300">{selectedNode.mac}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">TX / RX</span>
            <span className="text-slate-300">
              {((selectedNode.txPackets || 0) / 1000).toFixed(1)}k / {((selectedNode.rxPackets || 0) / 1000).toFixed(1)}k
            </span>
          </div>

          <button
            onClick={() => handlePingSelected(selectedNode.id)}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{t.pingDevice}</span>
          </button>
        </div>
      </div>

      {/* Modal: Add Custom Local Device / Secondary Gateway */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#090d16] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#070a10]">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {t.addCustomDevice}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomDevice} className="p-4 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Nume Dispozitiv (ex: Mesh Node Etaj / Switch Managed / Smart Gateway)
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Wi-Fi Extender Birou"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#06090f] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Adresă IP Locală (IPv4)
                </label>
                <input
                  type="text"
                  required
                  placeholder="192.168.1.x"
                  value={newDeviceIp}
                  onChange={(e) => setNewDeviceIp(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#06090f] border border-white/10 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Tip Dispozitiv & Rol
                </label>
                <select
                  value={newDeviceType}
                  onChange={(e) => setNewDeviceType(e.target.value as DeviceType)}
                  className="w-full px-3 py-2 rounded-lg bg-[#06090f] border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="secondary_gateway">Secondary Gateway / Mesh Node AP</option>
                  <option value="router">Managed Router / Switch Core</option>
                  <option value="iot_gateway">Smart IoT Subnet Gateway</option>
                  <option value="cellular_backup">4G/5G Cellular Failover Gateway</option>
                  <option value="nas">NAS Server / Storage Gateway</option>
                  <option value="computer">Secondary Workstation / PC</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                >
                  {t.close}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-bold uppercase tracking-wider transition"
                >
                  {t.addNode}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
