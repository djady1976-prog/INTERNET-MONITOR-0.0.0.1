import React, { useState } from 'react';
import { NetworkTelemetry, ThemeColors, SupportedLanguage } from '../../types';
import { Network, Copy, Check, RefreshCw } from 'lucide-react';
import { cyberSound } from '../../utils/cyberSound';
import { translations } from '../../i18n/translations';

interface Props {
  telemetry: NetworkTelemetry;
  theme: ThemeColors;
  onRefresh: () => void;
  lang: SupportedLanguage;
}

export const NetworkDetailsWidget: React.FC<Props> = ({ telemetry, theme, onRefresh, lang }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const t = translations[lang];

  const copyToClipboard = (text: string, key: string) => {
    cyberSound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const details = [
    { label: t.publicIpv4, value: telemetry.ipV4, copyable: true, key: 'ipv4' },
    { label: t.ipv6Addr, value: telemetry.ipV6, copyable: true, key: 'ipv6' },
    { label: t.ispProvider, value: telemetry.isp, copyable: false, key: 'isp' },
    { label: t.autonomousSystem, value: telemetry.asn, copyable: false, key: 'asn' },
    { label: t.geoLocation, value: `${telemetry.city}, ${telemetry.country}`, copyable: false, key: 'geo' },
    { label: t.gatewayRoute, value: telemetry.gateway, copyable: false, key: 'gateway' },
    { label: t.dnsServers, value: telemetry.dnsServer, copyable: false, key: 'dns' },
    { label: t.mtuSize, value: `${telemetry.mtu} Bytes`, copyable: false, key: 'mtu' },
    { label: t.networkAdapter, value: telemetry.adapterName, copyable: false, key: 'adapter' },
    { label: t.securityProtocol, value: `${telemetry.tlsVersion} · ${telemetry.httpProtocol}`, copyable: false, key: 'tls' },
  ];

  return (
    <div className="w-full flex flex-col p-4 rounded-xl bg-[#0c121e]/90 border border-white/5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            {t.techDetailsTitle}
          </h3>
        </div>

        <button
          onClick={onRefresh}
          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
          title={t.refreshTech}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {details.map((item) => (
          <div
            key={item.key}
            className="p-2 rounded-lg bg-[#080d16] border border-white/5 flex items-center justify-between text-xs hover:border-white/10 transition"
          >
            <div className="flex flex-col gap-0.5 truncate pr-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{item.label}</span>
              <span className="font-mono text-slate-100 font-medium truncate">{item.value}</span>
            </div>

            {item.copyable && (
              <button
                onClick={() => copyToClipboard(item.value, item.key)}
                className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-cyan-400 transition shrink-0 cursor-pointer"
                title={t.copyClipboard}
              >
                {copiedKey === item.key ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
