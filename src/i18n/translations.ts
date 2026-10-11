export type SupportedLanguage = 'ro' | 'en' | 'it' | 'de';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

export interface TranslationSchema {
  appTitle: string;
  appBadge: string;
  appSubtitle: string;
  windowsTag: string;
  liveMonitoring: string;
  monitoringPaused: string;
  wifiEthernet: string;
  firewallSecure: string;
  pause: string;
  resume: string;
  probeNow: string;
  customize: string;
  installWindows: string;
  minimizeTip: string;
  maximizeTip: string;
  closeTip: string;
  daemonRunningTitle: string;
  daemonRunningDesc: string;
  language: string;

  // Header
  highLatencyAlert: string;
  exportJson: string;
  exportCsv: string;

  // Gauges
  downloadBandwidth: string;
  downloadBandwidthSub: string;
  uploadBandwidth: string;
  uploadBandwidthSub: string;
  currentLatency: string;
  currentLatencySub: string;
  networkStability: string;
  networkStabilitySub: string;

  // Latency Chart
  latencyChartTitle: string;
  currentVal: string;
  averageVal: string;
  jitterVal: string;
  packetLossVal: string;

  // Speedtest
  speedTestTitle: string;
  certifiedResult: string;
  cdnServer: string;
  startSpeedTest: string;
  testInProgress: string;
  download: string;
  upload: string;
  pingRtt: string;
  jitterVariation: string;
  phaseIdle: string;
  phasePing: string;
  phaseDownload: string;
  phaseUpload: string;
  phaseComplete: string;

  // Servers
  multiServerTitle: string;
  activeGlobalNodes: string;
  trend: string;
  pingNow: string;

  // Traceroute
  tracerouteTitle: string;
  tracerouteHint: string;
  zeroPacketLoss: string;
  node: string;
  location: string;
  latency: string;

  // Local Topology Node-Link Diagram
  localTopologyTitle: string;
  localTopologySubtitle: string;
  scanNetwork: string;
  scanningTopology: string;
  gatewayDevicesFound: string;
  deviceDetails: string;
  linkSpeed: string;
  linkType: string;
  macAddress: string;
  ipAddress: string;
  deviceRole: string;
  statusOnline: string;
  statusStandby: string;
  addCustomDevice: string;
  pingDevice: string;
  topologyLayoutTree: string;
  topologyLayoutMesh: string;
  allDevices: string;
  gatewaysOnly: string;
  deviceHostPC: string;
  deviceMainRouter: string;
  deviceMeshExtender: string;
  deviceIoTGateway: string;
  deviceCellularBackup: string;
  deviceNasGateway: string;
  primaryGatewayLabel: string;
  secondaryGatewayLabel: string;

  // QoS
  qosTitle: string;
  bufferbloat: string;
  gaming: string;
  streaming: string;
  voip: string;
  browsing: string;
  cloudSync: string;

  // Protocol Donut
  protocolTitle: string;
  packetBreakdown: string;
  totalTraffic: string;

  // Packet Matrix
  packetMatrixTitle: string;
  integrity: string;
  optimal: string;
  normal: string;
  delayed: string;
  dropped: string;
  hoverBlockHint: string;
  packet: string;

  // Histogram
  histogramTitle: string;
  latencyConsistency: string;

  // Waveform
  waveformTitle: string;
  samplingDsp: string;

  // Bandwidth
  bandwidthTitle: string;
  now: string;

  // Custom Targets Manager
  targetsTitle: string;
  configuredNodes: string;
  namePlaceholder: string;
  hostPlaceholder: string;
  addNode: string;
  deleteNode: string;

  // Technical Details
  techDetailsTitle: string;
  publicIpv4: string;
  ipv6Addr: string;
  ispProvider: string;
  autonomousSystem: string;
  geoLocation: string;
  gatewayRoute: string;
  dnsServers: string;
  mtuSize: string;
  networkAdapter: string;
  securityProtocol: string;
  copyClipboard: string;
  refreshTech: string;

  // Logs
  logsTitle: string;
  filterAll: string;
  filterWarnings: string;
  filterErrors: string;
  exportLog: string;
  clearLog: string;
  noEvents: string;

  // Customizer Modal
  customizerTitle: string;
  neonColorThemes: string;
  refreshRate: string;
  columnsLayout: string;
  columns2: string;
  columns3: string;
  columnsCompact: string;
  latencyAlertThreshold: string;
  scanlinesCRT: string;
  scanlinesDesc: string;
  visibleWidgets: string;
  saveAndApply: string;

  // Installer Modal
  installerTitle: string;
  nativeDesktopTitle: string;
  nativeDesktopDesc: string;
  alreadyInstalled: string;
  installNow: string;
  batchShortcutBtn: string;
  edgeChromeHint: string;
  batchInstallerTitle: string;
  batchInstallerDesc: string;
  downloadSetupBat: string;
  powershellDaemonTitle: string;
  powershellDaemonDesc: string;
  downloadScriptAgent: string;
  certifiedSecurity: string;
  close: string;

  // Footer
  footerRefresh: string;
  footerAlert: string;
  footerTheme: string;

  // About Card
  aboutTitle: string;
  aboutBtn: string;
  developedBy: string;
  developerRole: string;
  appVersion: string;
  engineBuild: string;
}

export const translations: Record<SupportedLanguage, TranslationSchema> = {
  ro: {
    appTitle: 'NetPulse Neon',
    appBadge: 'Monitor Windows Pro',
    appSubtitle: 'Sistem Avansat de Telemetrie & Diagnostic Bandă Internet în Timp Real',
    windowsTag: 'Win64',
    liveMonitoring: 'Monitorizare Activă',
    monitoringPaused: 'Pauză Live',
    wifiEthernet: 'Wi-Fi 6 / 2.5 Gbps',
    firewallSecure: 'Firewall: Securizat',
    pause: 'Pauză',
    resume: 'Reia Monitorizarea',
    probeNow: 'Probează Acum',
    customize: 'Personalizează',
    installWindows: 'Instalează pe Windows',
    minimizeTip: 'Minimizează în bară',
    maximizeTip: 'Maximizează ecran complet',
    closeTip: 'Minimizează în fundal / Tray Windows',
    daemonRunningTitle: 'NetPulse Daemon Rulează în Fundal',
    daemonRunningDesc: 'Monitorizarea continuă în Windows System Tray.',
    language: 'Limbă',
    
    // Header
    highLatencyAlert: 'Latență Ridicată',
    exportJson: 'JSON',
    exportCsv: 'CSV',

    // Gauges
    downloadBandwidth: 'Descărcare Bandă',
    downloadBandwidthSub: 'Lățime de Bandă Maximă',
    uploadBandwidth: 'Încărcare Bandă',
    uploadBandwidthSub: 'Flux În Amonte',
    currentLatency: 'Latență Curentă',
    currentLatencySub: 'Timp de Răspuns RTT',
    networkStability: 'Stabilitate Rețea',
    networkStabilitySub: 'Scor Fără Jitter',

    // Latency Chart
    latencyChartTitle: 'Evoluție Latență în Timp Real (Ultimele 60s)',
    currentVal: 'Curent',
    averageVal: 'Medie',
    jitterVal: 'Jitter',
    packetLossVal: 'Pierdere',

    // Speedtest
    speedTestTitle: 'Test Viteză Bandă Internet (Speedtest Pro)',
    certifiedResult: 'Rezultat Certificat',
    cdnServer: 'Server: Digi / Cloudflare CDN',
    startSpeedTest: 'Pornește Test Viteză',
    testInProgress: 'Test în Curs...',
    download: 'Descărcare',
    upload: 'Încărcare',
    pingRtt: 'Ping RTT',
    jitterVariation: 'Jitter Variație',
    phaseIdle: 'Gata pentru testul de performanță a rețelei.',
    phasePing: 'Calculare Latență & Stabilitate RTT...',
    phaseDownload: 'Descărcare fluxuri de date masive (Multi-Thread)...',
    phaseUpload: 'Măsurare rată încărcare pe noduri regionale...',
    phaseComplete: 'Test finalizat cu succes!',

    // Servers
    multiServerTitle: 'Comparație Latență Multi-Server DNS & Cloud',
    activeGlobalNodes: '5 noduri globale active',
    trend: 'Tendință',
    pingNow: 'Ping imediat',

    // Traceroute
    tracerouteTitle: 'Topologie Rută & Traceroute Vizual (6 Noduri)',
    tracerouteHint: 'Faceți clic pe orice nod din rută pentru a vizualiza parametrii de rutare și latența detaliată.',
    zeroPacketLoss: '0% Pierderi de Pachete',
    node: 'Nod',
    location: 'Locație',
    latency: 'Latență',

    // Local Topology Node-Link Diagram
    localTopologyTitle: 'Topologie Rețea Locală LAN & Gateway-uri Secundare',
    localTopologySubtitle: 'Diagramă vizuală nod-legătură: Computer, Router Primar și Gateway-uri secundare detectate',
    scanNetwork: 'Scanează Rețea',
    scanningTopology: 'Scanare ARP & Descoperire Gateway...',
    gatewayDevicesFound: 'gateway-uri detectate',
    deviceDetails: 'Detalii Dispozitiv',
    linkSpeed: 'Viteză Legătură',
    linkType: 'Tip Conexiune',
    macAddress: 'Adresă MAC',
    ipAddress: 'Adresă IP Locală',
    deviceRole: 'Rol în Rețea',
    statusOnline: 'Activ / Online',
    statusStandby: 'Standby / Rezervă',
    addCustomDevice: 'Adaugă Dispozitiv',
    pingDevice: 'Ping Dispozitiv',
    topologyLayoutTree: 'Arbore Ierarhic',
    topologyLayoutMesh: 'Rețea Radială / Mesh',
    allDevices: 'Toate Nodurile',
    gatewaysOnly: 'Doar Gateway-uri',
    deviceHostPC: 'Acest Computer (Gazdă Windows)',
    deviceMainRouter: 'Router Principal / Gateway ONT',
    deviceMeshExtender: 'Nod Wi-Fi 6 Mesh / Extender',
    deviceIoTGateway: 'Gateway IoT / Punte Zigbee-Thread',
    deviceCellularBackup: 'Gateway Failover 4G/5G Backup',
    deviceNasGateway: 'Server Stocare NAS / Gateway SMB',
    primaryGatewayLabel: 'Gateway Primar',
    secondaryGatewayLabel: 'Gateway Secundar',

    // QoS
    qosTitle: 'Calitatea Serviciului (QoS Radar)',
    bufferbloat: 'Bufferbloat',
    gaming: 'Gaming Competitiv',
    streaming: 'Streaming 4K / HDR',
    voip: 'Apeluri Video & VoIP',
    browsing: 'Navigare Web (TTFB)',
    cloudSync: 'Cloud Sync & Backup',

    // Protocol Donut
    protocolTitle: 'Distribuție Protocoale de Rețea',
    packetBreakdown: 'Packet Breakdown',
    totalTraffic: 'Trafic Total',

    // Packet Matrix
    packetMatrixTitle: 'Matrice Sănătate Pachete & Integritate Conexiune',
    integrity: 'Integritate',
    optimal: 'Optim (<25ms)',
    normal: 'Normal (25-50ms)',
    delayed: 'Întârziat (>50ms)',
    dropped: 'Pierdut (Drop)',
    hoverBlockHint: 'Treceți cursorul peste blocuri pentru detalii pachet',
    packet: 'Pachet',

    // Histogram
    histogramTitle: 'Histogramă Distribuție Spectrală Jitter',
    latencyConsistency: 'Consistență Latență',

    // Waveform
    waveformTitle: 'Osciloscop Undă & Frecvență Pachete',
    samplingDsp: 'Eșantionare: 1000Hz · DSP Activ',

    // Bandwidth
    bandwidthTitle: 'Consum Lățime de Bandă (Sesiune Curentă)',
    now: 'Acum',

    // Custom Targets Manager
    targetsTitle: 'Administrare Servere de Monitorizat',
    configuredNodes: 'noduri configurate',
    namePlaceholder: 'Nume (ex: Server Jocuri / Discord)',
    hostPlaceholder: 'Domeniu sau IP (ex: discord.com)',
    addNode: 'Adaugă Nod',
    deleteNode: 'Șterge nod',

    // Technical Details
    techDetailsTitle: 'Informații Text & Parametri Tehnici Rețea Windows',
    publicIpv4: 'Adresă Publică IPv4',
    ipv6Addr: 'Adresă IPv6',
    ispProvider: 'Furnizor Internet (ISP)',
    autonomousSystem: 'Sistem Autonom (ASN)',
    geoLocation: 'Locație Geografică',
    gatewayRoute: 'Gateway Rutare Implicit',
    dnsServers: 'Servere DNS Primare',
    mtuSize: 'Dimensiune MTU Pachet',
    networkAdapter: 'Placă de Rețea Windows',
    securityProtocol: 'Protocol de Securitate',
    copyClipboard: 'Copiază în clipboard',
    refreshTech: 'Actualizează datele de rețea',

    // Logs
    logsTitle: 'Jurnal Diagnostic & Evenimente Rețea în Timp Real',
    filterAll: 'Toate',
    filterWarnings: 'Avertizări',
    filterErrors: 'Erori',
    exportLog: 'Exportă Jurnal (.log)',
    clearLog: 'Șterge Jurnal',
    noEvents: 'Niciun eveniment înregistrat.',

    // Customizer Modal
    customizerTitle: 'Personalizare Tablou de Bord NetPulse',
    neonColorThemes: 'Scheme de Culori Neon Futuriste',
    refreshRate: 'Rata de Reîmprospătare',
    columnsLayout: 'Aranjament Coloane',
    columns2: '2 Coloane',
    columns3: '3 Coloane',
    columnsCompact: 'Compact',
    latencyAlertThreshold: 'Prag de Alertă Latență Ping',
    scanlinesCRT: 'Efect Scanlines CRT (Aspect Cyberpunk)',
    scanlinesDesc: 'Adaugă textură fină de monitor retro-futurist pe ecran',
    visibleWidgets: 'Componente & Grafice Vizibile',
    saveAndApply: 'Salvează și Aplică',

    // Installer Modal
    installerTitle: 'Instalare NetPulse Neon pe Windows (10 / 11)',
    nativeDesktopTitle: 'Instalare Directă ca Aplicație Desktop Nativă',
    nativeDesktopDesc: 'Instalează NetPulse în meniul Start, pe bara de activități (Taskbar) și pe Desktop-ul Windows. Aplicația rulează într-o fereastră izolată fără bare de browser, cu suport offline complet și pornire rapidă.',
    alreadyInstalled: 'Deja Instalat',
    installNow: 'Instalează Acum',
    batchShortcutBtn: 'Comandă Rapidă .bat',
    edgeChromeHint: 'Compatibil cu Microsoft Edge și Google Chrome pe Windows 10 & 11 (sau apăsați pictograma de instalare din bara de adrese a browserului).',
    batchInstallerTitle: 'Instalator Executabil Desktop (.bat)',
    batchInstallerDesc: 'Generează automat o scurtătură dedicată cu pictograma NetPulse pe Desktop-ul Windows și lansează programul în mod Standalone Window (Kiosk/App).',
    downloadSetupBat: 'Descarcă Setup.bat',
    powershellDaemonTitle: 'Daemon Avansat Windows PowerShell (.ps1)',
    powershellDaemonDesc: 'Rulează direct în PowerShell pe Windows pentru a interoga adaptoarele fizice de rețea (Wi-Fi/Ethernet), statistici de pachete în timp real și logare automată în fișier local.',
    downloadScriptAgent: 'Descarcă Script Agent',
    certifiedSecurity: 'Certificat sigur: Nu necesită drepturi de administrator (UAC). Fără dependențe terțe, compatibil Windows 64-bit & ARM64.',
    close: 'Închide',

    // Footer
    footerRefresh: 'Reîmprospătare',
    footerAlert: 'Prag Alertă',
    footerTheme: 'Schema Neon',

    // About Card
    aboutTitle: 'Despre NetPulse Neon',
    aboutBtn: 'Despre',
    developedBy: 'DEVELOPED BY: ANDREI ADRIAN BUTA',
    developerRole: 'Arhitect Software & Inginer de Sistem',
    appVersion: 'Versiune: v2.4.0 Pro Edition',
    engineBuild: 'Motor Telemetrie Timp Real Win64',
  },

  en: {
    appTitle: 'NetPulse Neon',
    appBadge: 'Windows Pro Monitor',
    appSubtitle: 'Advanced Real-Time Internet Bandwidth Telemetry & Diagnostics System',
    windowsTag: 'Win64',
    liveMonitoring: 'Live Monitoring',
    monitoringPaused: 'Monitoring Paused',
    wifiEthernet: 'Wi-Fi 6 / 2.5 Gbps',
    firewallSecure: 'Firewall: Secured',
    pause: 'Pause',
    resume: 'Resume Monitoring',
    probeNow: 'Probe Now',
    customize: 'Customize',
    installWindows: 'Install on Windows',
    minimizeTip: 'Minimize to taskbar',
    maximizeTip: 'Toggle fullscreen mode',
    closeTip: 'Minimize to Windows System Tray',
    daemonRunningTitle: 'NetPulse Daemon Running in Background',
    daemonRunningDesc: 'Continuous monitoring active in Windows System Tray.',
    language: 'Language',

    // Header
    highLatencyAlert: 'High Latency Spike',
    exportJson: 'JSON',
    exportCsv: 'CSV',

    // Gauges
    downloadBandwidth: 'Download Bandwidth',
    downloadBandwidthSub: 'Peak Downstream Throughput',
    uploadBandwidth: 'Upload Bandwidth',
    uploadBandwidthSub: 'Upstream Throughput',
    currentLatency: 'Current Latency',
    currentLatencySub: 'RTT Response Time',
    networkStability: 'Network Stability',
    networkStabilitySub: 'Jitter-Free Score',

    // Latency Chart
    latencyChartTitle: 'Real-Time Latency History (Past 60s)',
    currentVal: 'Current',
    averageVal: 'Avg',
    jitterVal: 'Jitter',
    packetLossVal: 'Loss',

    // Speedtest
    speedTestTitle: 'Broadband Speed Test (Speedtest Pro)',
    certifiedResult: 'Certified Result',
    cdnServer: 'Server: Digi / Cloudflare CDN',
    startSpeedTest: 'Start Speed Test',
    testInProgress: 'Testing in Progress...',
    download: 'Download',
    upload: 'Upload',
    pingRtt: 'Ping RTT',
    jitterVariation: 'Jitter Variation',
    phaseIdle: 'Ready for network throughput diagnostic test.',
    phasePing: 'Calculating Round-Trip Latency & Jitter...',
    phaseDownload: 'Downloading massive multi-thread data streams...',
    phaseUpload: 'Measuring upstream transfer to regional nodes...',
    phaseComplete: 'Speed test completed successfully!',

    // Servers
    multiServerTitle: 'Multi-Server DNS & Cloud Latency Comparison',
    activeGlobalNodes: '5 active global edge nodes',
    trend: 'Trend',
    pingNow: 'Ping target now',

    // Traceroute
    tracerouteTitle: 'Route Topology & Visual Traceroute (6 Hops)',
    tracerouteHint: 'Click on any node in the route to view hop routing telemetry and detailed latency.',
    zeroPacketLoss: '0% Packet Loss',
    node: 'Hop',
    location: 'Location',
    latency: 'Latency',

    // Local Topology Node-Link Diagram
    localTopologyTitle: 'Local Network LAN Topology & Gateway Link Map',
    localTopologySubtitle: 'Visual node-link diagram: Computer, Main Router, and detected secondary gateway devices',
    scanNetwork: 'Scan LAN',
    scanningTopology: 'ARP Probe & Gateway Discovery in progress...',
    gatewayDevicesFound: 'gateways detected',
    deviceDetails: 'Device Telemetry',
    linkSpeed: 'Link Speed',
    linkType: 'Link Medium',
    macAddress: 'Hardware MAC',
    ipAddress: 'Local IP Address',
    deviceRole: 'Network Role',
    statusOnline: 'Active / Online',
    statusStandby: 'Standby / Ready',
    addCustomDevice: 'Add Device',
    pingDevice: 'Ping Device',
    topologyLayoutTree: 'Tree Hierarchy',
    topologyLayoutMesh: 'Radial / Mesh',
    allDevices: 'All Nodes',
    gatewaysOnly: 'Gateways Only',
    deviceHostPC: 'This Computer (Host PC)',
    deviceMainRouter: 'Primary Gateway / ONT Router',
    deviceMeshExtender: 'Wi-Fi 6 Mesh Extender Node',
    deviceIoTGateway: 'Smart IoT Gateway / Thread-Zigbee Bridge',
    deviceCellularBackup: 'Cellular 4G/5G Failover Gateway',
    deviceNasGateway: 'Network Attached Storage (NAS) SMB Gateway',
    primaryGatewayLabel: 'Primary Gateway',
    secondaryGatewayLabel: 'Secondary Gateway',

    // QoS
    qosTitle: 'Quality of Service (QoS Radar)',
    bufferbloat: 'Bufferbloat',
    gaming: 'Competitive Gaming',
    streaming: '4K / HDR Streaming',
    voip: 'Video Calls & VoIP',
    browsing: 'Web Browsing (TTFB)',
    cloudSync: 'Cloud Sync & Backup',

    // Protocol Donut
    protocolTitle: 'Network Protocol Distribution',
    packetBreakdown: 'Packet Breakdown',
    totalTraffic: 'Total Traffic',

    // Packet Matrix
    packetMatrixTitle: 'Packet Health Matrix & Link Integrity',
    integrity: 'Integrity',
    optimal: 'Optimal (<25ms)',
    normal: 'Normal (25-50ms)',
    delayed: 'Delayed (>50ms)',
    dropped: 'Dropped (Lost)',
    hoverBlockHint: 'Hover over blocks for individual packet telemetry',
    packet: 'Packet',

    // Histogram
    histogramTitle: 'Spectral Jitter Distribution Histogram',
    latencyConsistency: 'Latency Consistency',

    // Waveform
    waveformTitle: 'Packet Frequency Oscilloscope',
    samplingDsp: 'Sampling: 1000Hz · DSP Active',

    // Bandwidth
    bandwidthTitle: 'Bandwidth Consumption (Current Session)',
    now: 'Now',

    // Custom Targets Manager
    targetsTitle: 'Monitored Target Servers Manager',
    configuredNodes: 'configured nodes',
    namePlaceholder: 'Name (e.g. Gaming Server / Discord)',
    hostPlaceholder: 'Domain or IP (e.g. discord.com)',
    addNode: 'Add Node',
    deleteNode: 'Remove node',

    // Technical Details
    techDetailsTitle: 'Windows Network Technical Parameters & Info',
    publicIpv4: 'Public IPv4 Address',
    ipv6Addr: 'IPv6 Address',
    ispProvider: 'Internet Service Provider (ISP)',
    autonomousSystem: 'Autonomous System (ASN)',
    geoLocation: 'Geographical Location',
    gatewayRoute: 'Default Routing Gateway',
    dnsServers: 'Primary DNS Servers',
    mtuSize: 'Packet MTU Size',
    networkAdapter: 'Windows Network Adapter',
    securityProtocol: 'Security Protocol',
    copyClipboard: 'Copy to clipboard',
    refreshTech: 'Refresh network parameters',

    // Logs
    logsTitle: 'Real-Time Diagnostic & Event Log',
    filterAll: 'All',
    filterWarnings: 'Warnings',
    filterErrors: 'Errors',
    exportLog: 'Export Log (.log)',
    clearLog: 'Clear Log',
    noEvents: 'No telemetry events recorded.',

    // Customizer Modal
    customizerTitle: 'Customize NetPulse Dashboard',
    neonColorThemes: 'Futuristic Neon Color Themes',
    refreshRate: 'Refresh Interval',
    columnsLayout: 'Columns Layout',
    columns2: '2 Columns',
    columns3: '3 Columns',
    columnsCompact: 'Compact',
    latencyAlertThreshold: 'Ping Latency Alert Threshold',
    scanlinesCRT: 'CRT Scanlines Effect (Cyberpunk Mode)',
    scanlinesDesc: 'Adds a vintage high-tech CRT monitor raster overlay',
    visibleWidgets: 'Visible Widgets & Components',
    saveAndApply: 'Save and Apply',

    // Installer Modal
    installerTitle: 'Install NetPulse Neon on Windows (10 / 11)',
    nativeDesktopTitle: 'Direct Installation as Native Desktop App',
    nativeDesktopDesc: 'Installs NetPulse into the Windows Start Menu, Taskbar, and Desktop. Runs in an isolated desktop window without browser chrome, with instant launch and complete offline support.',
    alreadyInstalled: 'Already Installed',
    installNow: 'Install App Now',
    batchShortcutBtn: 'Desktop Shortcut .bat',
    edgeChromeHint: 'Supported on Microsoft Edge and Google Chrome on Windows 10 & 11 (or click the install icon in your browser address bar).',
    batchInstallerTitle: 'Desktop Launcher Setup Script (.bat)',
    batchInstallerDesc: 'Automatically generates a dedicated desktop shortcut with the NetPulse brand icon and launches in Standalone Application Mode.',
    downloadSetupBat: 'Download Setup.bat',
    powershellDaemonTitle: 'Advanced Windows PowerShell Daemon (.ps1)',
    powershellDaemonDesc: 'Executes natively in Windows PowerShell to query physical network adapters (Wi-Fi/Ethernet), real-time packet throughput, and local log creation.',
    downloadScriptAgent: 'Download Agent Script',
    certifiedSecurity: 'Certified Safe: No administrator rights (UAC) required. Zero third-party dependencies, compatible with Windows 64-bit & ARM64.',
    close: 'Close',

    // Footer
    footerRefresh: 'Refresh Rate',
    footerAlert: 'Alert Threshold',
    footerTheme: 'Neon Scheme',

    // About Card
    aboutTitle: 'About NetPulse Neon',
    aboutBtn: 'About',
    developedBy: 'DEVELOPED BY: ANDREI ADRIAN BUTA',
    developerRole: 'Software Architect & System Engineer',
    appVersion: 'Version: v2.4.0 Pro Edition',
    engineBuild: 'Win64 Real-Time Telemetry Engine',
  },

  it: {
    appTitle: 'NetPulse Neon',
    appBadge: 'Monitor Windows Pro',
    appSubtitle: 'Sistema Avanzato di Telemetria e Diagnostica della Banda Internet in Tempo Reale',
    windowsTag: 'Win64',
    liveMonitoring: 'Monitoraggio Attivo',
    monitoringPaused: 'Monitoraggio in Pausa',
    wifiEthernet: 'Wi-Fi 6 / 2.5 Gbps',
    firewallSecure: 'Firewall: Protetto',
    pause: 'Pausa',
    resume: 'Riprendi Monitoraggio',
    probeNow: 'Sonda Ora',
    customize: 'Personalizza',
    installWindows: 'Installa su Windows',
    minimizeTip: 'Riduci a icona',
    maximizeTip: 'Attiva schermo intero',
    closeTip: 'Riduci nella barra delle applicazioni Windows',
    daemonRunningTitle: 'Daemon NetPulse in Esecuzione in Background',
    daemonRunningDesc: 'Monitoraggio continuo attivo nella System Tray di Windows.',
    language: 'Lingua',

    // Header
    highLatencyAlert: 'Picco di Latenza Elevata',
    exportJson: 'JSON',
    exportCsv: 'CSV',

    // Gauges
    downloadBandwidth: 'Banda in Download',
    downloadBandwidthSub: 'Velocità Massima Downstream',
    uploadBandwidth: 'Banda in Upload',
    uploadBandwidthSub: 'Flusso Upstream',
    currentLatency: 'Latenza Attuale',
    currentLatencySub: 'Tempo di Risposta RTT',
    networkStability: 'Stabilità di Rete',
    networkStabilitySub: 'Punteggio Senza Jitter',

    // Latency Chart
    latencyChartTitle: 'Cronologia Latenza in Tempo Reale (Ultimi 60s)',
    currentVal: 'Attuale',
    averageVal: 'Media',
    jitterVal: 'Jitter',
    packetLossVal: 'Perdita',

    // Speedtest
    speedTestTitle: 'Test Velocità Banda Larga (Speedtest Pro)',
    certifiedResult: 'Risultato Certificato',
    cdnServer: 'Server: Digi / Cloudflare CDN',
    startSpeedTest: 'Avvia Test di Velocità',
    testInProgress: 'Test in Corso...',
    download: 'Download',
    upload: 'Upload',
    pingRtt: 'Ping RTT',
    jitterVariation: 'Variazione Jitter',
    phaseIdle: 'Pronto per il test diagnostico della velocità di rete.',
    phasePing: 'Calcolo Latenza di Andata e Ritorno & Jitter...',
    phaseDownload: 'Download di flussi di dati massivi multi-thread...',
    phaseUpload: 'Misurazione velocità di upload verso nodi regionali...',
    phaseComplete: 'Test di velocità completato con successo!',

    // Servers
    multiServerTitle: 'Confronto Latenza Multi-Server DNS & Cloud',
    activeGlobalNodes: '5 nodi globali attivi',
    trend: 'Tendenza',
    pingNow: 'Esegui ping ora',

    // Traceroute
    tracerouteTitle: 'Topologia di Routing & Traceroute Visivo (6 Nodi)',
    tracerouteHint: 'Fai clic su qualsiasi nodo per visualizzare i parametri di instradamento e la latenza dettagliata.',
    zeroPacketLoss: '0% Perdita Pacchetti',
    node: 'Nodo',
    location: 'Posizione',
    latency: 'Latenza',

    // Local Topology Node-Link Diagram
    localTopologyTitle: 'Topologia Rete Locale LAN & Gateway Secondari',
    localTopologySubtitle: 'Diagramma visivo nodi-collegamenti: Computer, Router Primario e gateway secondari rilevati',
    scanNetwork: 'Scansiona Rete',
    scanningTopology: 'Scansione ARP & Ricerca Gateway in corso...',
    gatewayDevicesFound: 'gateway rilevati',
    deviceDetails: 'Telemetria Dispositivo',
    linkSpeed: 'Velocità Collegamento',
    linkType: 'Mezzo di Connessione',
    macAddress: 'Indirizzo MAC',
    ipAddress: 'Indirizzo IP Locale',
    deviceRole: 'Ruolo di Rete',
    statusOnline: 'Attivo / Online',
    statusStandby: 'Standby / Riserva',
    addCustomDevice: 'Aggiungi Dispositivo',
    pingDevice: 'Ping Dispositivo',
    topologyLayoutTree: 'Gerarchia ad Albero',
    topologyLayoutMesh: 'Radiale / Mesh',
    allDevices: 'Tutti i Nodi',
    gatewaysOnly: 'Solo Gateway',
    deviceHostPC: 'Questo Computer (Host Windows)',
    deviceMainRouter: 'Router Primario / Gateway ONT',
    deviceMeshExtender: 'Nodo Mesh Wi-Fi 6 / Ripetitore',
    deviceIoTGateway: 'Gateway IoT Smart / Bridge Zigbee-Thread',
    deviceCellularBackup: 'Gateway Failover Backup 4G/5G',
    deviceNasGateway: 'Server Storage NAS / Gateway SMB',
    primaryGatewayLabel: 'Gateway Primario',
    secondaryGatewayLabel: 'Gateway Secondario',

    // QoS
    qosTitle: 'Qualità del Servizio (Radar QoS)',
    bufferbloat: 'Bufferbloat',
    gaming: 'Gaming Competitivo',
    streaming: 'Streaming 4K / HDR',
    voip: 'Videochiamate e VoIP',
    browsing: 'Navigazione Web (TTFB)',
    cloudSync: 'Cloud Sync & Backup',

    // Protocol Donut
    protocolTitle: 'Distribuzione Protocolli di Rete',
    packetBreakdown: 'Dettaglio Pacchetti',
    totalTraffic: 'Traffico Totale',

    // Packet Matrix
    packetMatrixTitle: 'Matrice Integrità Pacchetti & Connessione',
    integrity: 'Integrità',
    optimal: 'Ottimale (<25ms)',
    normal: 'Normale (25-50ms)',
    delayed: 'Rallentato (>50ms)',
    dropped: 'Perso (Drop)',
    hoverBlockHint: 'Passa il cursore sui blocchi per dettagli sui singoli pacchetti',
    packet: 'Pacchetto',

    // Histogram
    histogramTitle: 'Istogramma Distribuzione Spettrale Jitter',
    latencyConsistency: 'Consistenza Latenza',

    // Waveform
    waveformTitle: 'Oscilloscopio Frequenza Pacchetti',
    samplingDsp: 'Campionamento: 1000Hz · DSP Attivo',

    // Bandwidth
    bandwidthTitle: 'Consumo Larghezza di Banda (Sessione Corrente)',
    now: 'Ora',

    // Custom Targets Manager
    targetsTitle: 'Gestione Server di Monitoraggio',
    configuredNodes: 'nodi configurati',
    namePlaceholder: 'Nome (es: Server Giochi / Discord)',
    hostPlaceholder: 'Dominio o IP (es: discord.com)',
    addNode: 'Aggiungi Nodo',
    deleteNode: 'Rimuovi nodo',

    // Technical Details
    techDetailsTitle: 'Parametri Tecnici e Informazioni Rete Windows',
    publicIpv4: 'Indirizzo IPv4 Pubblico',
    ipv6Addr: 'Indirizzo IPv6',
    ispProvider: 'Fornitore di Rete (ISP)',
    autonomousSystem: 'Sistema Autonomo (ASN)',
    geoLocation: 'Posizione Geografica',
    gatewayRoute: 'Gateway Predefinito',
    dnsServers: 'Server DNS Primari',
    mtuSize: 'Dimensione Pacchetto MTU',
    networkAdapter: 'Scheda di Rete Windows',
    securityProtocol: 'Protocollo di Sicurezza',
    copyClipboard: 'Copia negli appunti',
    refreshTech: 'Aggiorna parametri di rete',

    // Logs
    logsTitle: 'Registro Diagnostico ed Eventi in Tempo Reale',
    filterAll: 'Tutti',
    filterWarnings: 'Avvisi',
    filterErrors: 'Errori',
    exportLog: 'Esporta Registro (.log)',
    clearLog: 'Cancella Registro',
    noEvents: 'Nessun evento registrato.',

    // Customizer Modal
    customizerTitle: 'Personalizza Dashboard NetPulse',
    neonColorThemes: 'Schemi di Colori Neon Futuristi',
    refreshRate: 'Frequenza di Aggiornamento',
    columnsLayout: 'Disposizione Colonne',
    columns2: '2 Colonne',
    columns3: '3 Colonne',
    columnsCompact: 'Compatta',
    latencyAlertThreshold: 'Soglia Allarme Latenza Ping',
    scanlinesCRT: 'Effetto Scanline CRT (Modalità Cyberpunk)',
    scanlinesDesc: 'Aggiunge una texture raster tipica dei monitor retrò-futuristici',
    visibleWidgets: 'Componenti & Grafici Visibili',
    saveAndApply: 'Salva e Applica',

    // Installer Modal
    installerTitle: 'Installazione NetPulse Neon su Windows (10 / 11)',
    nativeDesktopTitle: 'Installazione Diretta come App Desktop Nativa',
    nativeDesktopDesc: 'Installa NetPulse nel menu Start, sulla barra delle applicazioni e sul Desktop di Windows. Funziona in una finestra desktop isolata senza barre del browser, con avvio rapido e supporto offline.',
    alreadyInstalled: 'Già Installato',
    installNow: 'Installa Ora',
    batchShortcutBtn: 'Collegamento .bat',
    edgeChromeHint: 'Supportato su Microsoft Edge e Google Chrome su Windows 10 & 11 (oppure fai clic sull\'icona di installazione nella barra degli indirizzi).',
    batchInstallerTitle: 'Programma di Installazione Desktop (.bat)',
    batchInstallerDesc: 'Crea automaticamente un collegamento con l\'icona ufficiale di NetPulse sul Desktop e avvia in modalità standalone kiosk.',
    downloadSetupBat: 'Scarica Setup.bat',
    powershellDaemonTitle: 'Daemon Avanzato Windows PowerShell (.ps1)',
    powershellDaemonDesc: 'Viene eseguito nativamente in PowerShell su Windows per monitorare le schede di rete fisiche (Wi-Fi/Ethernet) e salvare i log locali.',
    downloadScriptAgent: 'Scarica Script Daemon',
    certifiedSecurity: 'Certificato Sicuro: Nessun privilegio di amministratore (UAC) richiesto. Senza dipendenze esterne, compatibile con Windows 64-bit e ARM64.',
    close: 'Chiudi',

    // Footer
    footerRefresh: 'Aggiornamento',
    footerAlert: 'Soglia Allarme',
    footerTheme: 'Tema Neon',

    // About Card
    aboutTitle: 'Informazioni su NetPulse Neon',
    aboutBtn: 'Info',
    developedBy: 'DEVELOPED BY: ANDREI ADRIAN BUTA',
    developerRole: 'Architetto Software & Ingegnere di Sistema',
    appVersion: 'Versione: v2.4.0 Pro Edition',
    engineBuild: 'Motore di Telemetria in Tempo Reale Win64',
  },

  de: {
    appTitle: 'NetPulse Neon',
    appBadge: 'Windows Pro Monitor',
    appSubtitle: 'Erweitertes Echtzeit-System für Internet-Bandbreitentelemetrie und Diagnose',
    windowsTag: 'Win64',
    liveMonitoring: 'Aktive Überwachung',
    monitoringPaused: 'Überwachung Pausiert',
    wifiEthernet: 'Wi-Fi 6 / 2.5 Gbps',
    firewallSecure: 'Firewall: Gesichert',
    pause: 'Pause',
    resume: 'Überwachung Fortsetzen',
    probeNow: 'Jetzt Prüfen',
    customize: 'Anpassen',
    installWindows: 'Unter Windows installieren',
    minimizeTip: 'In die Taskleiste minimieren',
    maximizeTip: 'Vollbildmodus umschalten',
    closeTip: 'In den Windows-Infobereich (System Tray) minimieren',
    daemonRunningTitle: 'NetPulse Daemon Läuft im Hintergrund',
    daemonRunningDesc: 'Kontinuierliche Überwachung aktiv im Windows-Infobereich.',
    language: 'Sprache',

    // Header
    highLatencyAlert: 'Hohe Latenzspitze',
    exportJson: 'JSON',
    exportCsv: 'CSV',

    // Gauges
    downloadBandwidth: 'Download-Geschwindigkeit',
    downloadBandwidthSub: 'Maximale Downstream-Bandbreite',
    uploadBandwidth: 'Upload-Geschwindigkeit',
    uploadBandwidthSub: 'Upstream-Durchsatz',
    currentLatency: 'Aktuelle Latenz',
    currentLatencySub: 'RTT-Antwortzeit',
    networkStability: 'Netzwerkstabilität',
    networkStabilitySub: 'Jitter-Freier Wert',

    // Latency Chart
    latencyChartTitle: 'Echtzeit-Latenzverlauf (Letzte 60s)',
    currentVal: 'Aktuell',
    averageVal: 'Mittelwert',
    jitterVal: 'Jitter',
    packetLossVal: 'Verlust',

    // Speedtest
    speedTestTitle: 'Breitband-Geschwindigkeitstest (Speedtest Pro)',
    certifiedResult: 'Zertifiziertes Ergebnis',
    cdnServer: 'Server: Digi / Cloudflare CDN',
    startSpeedTest: 'Geschwindigkeitstest Starten',
    testInProgress: 'Test Läuft...',
    download: 'Download',
    upload: 'Upload',
    pingRtt: 'Ping RTT',
    jitterVariation: 'Jitter-Abweichung',
    phaseIdle: 'Bereit für den Netzwerkdurchsatz-Diagnosetest.',
    phasePing: 'Berechnung von Umlaufzeit (RTT) & Jitter...',
    phaseDownload: 'Herunterladen massiver Multi-Thread-Datenströme...',
    phaseUpload: 'Messung der Upload-Rate zu regionalen Knoten...',
    phaseComplete: 'Geschwindigkeitstest erfolgreich abgeschlossen!',

    // Servers
    multiServerTitle: 'Multi-Server DNS & Cloud Latenzvergleich',
    activeGlobalNodes: '5 aktive globale Knotenpunkte',
    trend: 'Trend',
    pingNow: 'Ziel jetzt anpingen',

    // Traceroute
    tracerouteTitle: 'Routing-Topologie & Visuelles Traceroute (6 Hops)',
    tracerouteHint: 'Klicken Sie auf einen Knotenpunkt, um Routing-Parameter und detaillierte Latenz anzuzeigen.',
    zeroPacketLoss: '0% Paketverlust',
    node: 'Hop',
    location: 'Standort',
    latency: 'Latenz',

    // Local Topology Node-Link Diagram
    localTopologyTitle: 'Lokale LAN-Netzwerktopologie & Sekundäre Gateways',
    localTopologySubtitle: 'Visuelles Knoten-Verbindungs-Diagramm: Computer, Hauptrouter und erkannte sekundäre Gateway-Geräte',
    scanNetwork: 'Netzwerk Scannen',
    scanningTopology: 'ARP-Scan & Gateway-Erkennung läuft...',
    gatewayDevicesFound: 'Gateways erkannt',
    deviceDetails: 'Gerätetelemetrie',
    linkSpeed: 'Verbindungsgeschwindigkeit',
    linkType: 'Verbindungstyp',
    macAddress: 'Hardware-MAC-Adresse',
    ipAddress: 'Lokale IP-Adresse',
    deviceRole: 'Netzwerkfunktion',
    statusOnline: 'Aktiv / Online',
    statusStandby: 'Standby / Ausweich',
    addCustomDevice: 'Gerät Hinzufügen',
    pingDevice: 'Gerät Anpingen',
    topologyLayoutTree: 'Baum-Hierarchie',
    topologyLayoutMesh: 'Radiales / Mesh-Netz',
    allDevices: 'Alle Knoten',
    gatewaysOnly: 'Nur Gateways',
    deviceHostPC: 'Dieser Computer (Windows Host-PC)',
    deviceMainRouter: 'Hauptgateway / ONT-Glasfaser-Router',
    deviceMeshExtender: 'Wi-Fi 6 Mesh-Knoten / Repeater',
    deviceIoTGateway: 'Smart-Home-IoT-Gateway / Zigbee-Bridge',
    deviceCellularBackup: 'Mobilfunk 4G/5G Failover-Gateway',
    deviceNasGateway: 'NAS-Netzwerkspeicher / SMB-Gateway',
    primaryGatewayLabel: 'Primäres Gateway',
    secondaryGatewayLabel: 'Sekundäres Gateway',

    // QoS
    qosTitle: 'Dienstgüte (QoS-Radar)',
    bufferbloat: 'Bufferbloat',
    gaming: 'Kompetitives Gaming',
    streaming: '4K / HDR Streaming',
    voip: 'Videoanrufe & VoIP',
    browsing: 'Websurfen (TTFB)',
    cloudSync: 'Cloud-Synchronisierung',

    // Protocol Donut
    protocolTitle: 'Verteilung der Netzwerkprotokolle',
    packetBreakdown: 'Paketaufschlüsselung',
    totalTraffic: 'Gesamtverkehr',

    // Packet Matrix
    packetMatrixTitle: 'Paket-Integritätsmatrix & Verbindungszustand',
    integrity: 'Integrität',
    optimal: 'Optimal (<25ms)',
    normal: 'Normal (25-50ms)',
    delayed: 'Verzögert (>50ms)',
    dropped: 'Verloren (Drop)',
    hoverBlockHint: 'Bewegen Sie den Mauszeiger über Blöcke für individuelle Paketdetails',
    packet: 'Paket',

    // Histogram
    histogramTitle: 'Spektrales Jitter-Verteilungshistogramm',
    latencyConsistency: 'Latenzkonsistenz',

    // Waveform
    waveformTitle: 'Paketfrequenz-Oszilloskop',
    samplingDsp: 'Abtastung: 1000Hz · DSP Aktiv',

    // Bandwidth
    bandwidthTitle: 'Bandbreitenverbrauch (Aktuelle Sitzung)',
    now: 'Jetzt',

    // Custom Targets Manager
    targetsTitle: 'Verwaltung Überwachter Zielserver',
    configuredNodes: 'konfigurierte Knoten',
    namePlaceholder: 'Name (z.B. Gameserver / Discord)',
    hostPlaceholder: 'Domain oder IP (z.B. discord.com)',
    addNode: 'Knoten Hinzufügen',
    deleteNode: 'Knoten entfernen',

    // Technical Details
    techDetailsTitle: 'Technische Parameter & Info des Windows-Netzwerks',
    publicIpv4: 'Öffentliche IPv4-Adresse',
    ipv6Addr: 'IPv6-Adresse',
    ispProvider: 'Internetanbieter (ISP)',
    autonomousSystem: 'Autonomes System (ASN)',
    geoLocation: 'Geografischer Standort',
    gatewayRoute: 'Standardgateway',
    dnsServers: 'Primäre DNS-Server',
    mtuSize: 'Paket-MTU-Größe',
    networkAdapter: 'Windows-Netzwerkadapter',
    securityProtocol: 'Sicherheitsprotokoll',
    copyClipboard: 'In die Zwischenablage kopieren',
    refreshTech: 'Netzwerkparameter aktualisieren',

    // Logs
    logsTitle: 'Echtzeit-Diagnose- und Ereignisprotokoll',
    filterAll: 'Alle',
    filterWarnings: 'Warnungen',
    filterErrors: 'Fehler',
    exportLog: 'Protokoll Exportieren (.log)',
    clearLog: 'Protokoll Löschen',
    noEvents: 'Keine Telemetrieereignisse aufgezeichnet.',

    // Customizer Modal
    customizerTitle: 'NetPulse Dashboard Anpassen',
    neonColorThemes: 'Futuristische Neon-Farbschemata',
    refreshRate: 'Aktualisierungsrate',
    columnsLayout: 'Spaltenanordnung',
    columns2: '2 Spalten',
    columns3: '3 Spalten',
    columnsCompact: 'Kompakt',
    latencyAlertThreshold: 'Ping-Latenz-Alarmschwelle',
    scanlinesCRT: 'CRT-Scanlines-Effekt (Cyberpunk-Modus)',
    scanlinesDesc: 'Fügt eine feine Rastertextur im Stil von Retro-Monitoren hinzu',
    visibleWidgets: 'Sichtbare Widgets & Komponenten',
    saveAndApply: 'Speichern und Anwenden',

    // Installer Modal
    installerTitle: 'NetPulse Neon unter Windows (10 / 11) installieren',
    nativeDesktopTitle: 'Direkte Installation als Native Desktop-App',
    nativeDesktopDesc: 'Installiert NetPulse im Windows-Startmenü, in der Taskleiste und auf dem Desktop. Läuft in einem isolierten Desktop-Fenster ohne Browserleisten, mit Schnellstart und vollständiger Offline-Unterstützung.',
    alreadyInstalled: 'Bereits Installiert',
    installNow: 'Jetzt Installieren',
    batchShortcutBtn: 'Desktop-Verknüpfung .bat',
    edgeChromeHint: 'Unterstützt von Microsoft Edge und Google Chrome unter Windows 10 & 11 (oder klicken Sie auf das Installationssymbol in Ihrer Adressleiste).',
    batchInstallerTitle: 'Desktop-Starter-Setup-Skript (.bat)',
    batchInstallerDesc: 'Erstellt automatisch eine dedizierte Desktop-Verknüpfung mit dem NetPulse-Symbol und startet im Standalone-Fenstermodus.',
    downloadSetupBat: 'Setup.bat Herunterladen',
    powershellDaemonTitle: 'Erweiterter Windows PowerShell Daemon (.ps1)',
    powershellDaemonDesc: 'Läuft nativ in Windows PowerShell, um physische Netzwerkadapter (WLAN/Ethernet), Echtzeit-Paketdurchsatz und lokale Protokolle abzufragen.',
    downloadScriptAgent: 'Agent-Skript Herunterladen',
    certifiedSecurity: 'Geprüft Sicher: Keine Administratorrechte (UAC) erforderlich. Ohne externe Abhängigkeiten, kompatibel mit Windows 64-Bit & ARM64.',
    close: 'Schließen',

    // Footer
    footerRefresh: 'Aktualisierung',
    footerAlert: 'Alarmschwelle',
    footerTheme: 'Neon-Farbschema',

    // About Card
    aboutTitle: 'Über NetPulse Neon',
    aboutBtn: 'Über',
    developedBy: 'DEVELOPED BY: ANDREI ADRIAN BUTA',
    developerRole: 'Software-Architekt & System-Ingenieur',
    appVersion: 'Version: v2.4.0 Pro Edition',
    engineBuild: 'Echtzeit-Telemetrie-Engine Win64',
  },
};

export type TranslationKey = keyof TranslationSchema;
