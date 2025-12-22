import { Cpu, HardDrive, Monitor, Wifi } from 'lucide-react';
import type { SystemInfo } from '../../types';

interface SystemInfoPanelProps {
  systemInfo: SystemInfo;
}

export function SystemInfoPanel({ systemInfo }: SystemInfoPanelProps) {
  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 ** 3);
    return `${gb.toFixed(2)} GB`;
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-cyber-green-500 mb-6 flex items-center gap-2">
        <Monitor className="w-6 h-6 text-cyber-green-500" />
        Informazioni Sistema
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hardware */}
        <div>
          <h3 className="text-sm font-semibold text-cyber-orange-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyber-orange-500" />
            Hardware
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-cyber-gray-500">CPU</p>
              <p className="text-sm font-medium text-cyber-gray-100">
                {systemInfo.hardware.cpu.brand}
              </p>
              <p className="text-xs text-cyber-gray-300">
                {systemInfo.hardware.cpu.cores} cores @ {systemInfo.hardware.cpu.speed} GHz
              </p>
            </div>

            <div>
              <p className="text-xs text-cyber-gray-500">Memoria RAM</p>
              <p className="text-sm font-medium text-cyber-gray-100">
                {formatBytes(systemInfo.hardware.memory.total)}
              </p>
              <p className="text-xs text-cyber-gray-300">
                Usata: {formatBytes(systemInfo.hardware.memory.used)} ({((systemInfo.hardware.memory.used / systemInfo.hardware.memory.total) * 100).toFixed(1)}%)
              </p>
            </div>

            {systemInfo.hardware.graphics.length > 0 && (
              <div>
                <p className="text-xs text-cyber-gray-500">GPU</p>
                <p className="text-sm font-medium text-cyber-gray-100">
                  {systemInfo.hardware.graphics[0].model}
                </p>
                <p className="text-xs text-cyber-gray-300">{systemInfo.hardware.graphics[0].vendor}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sistema Operativo */}
        <div>
          <h3 className="text-sm font-semibold text-cyber-orange-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-cyber-orange-500" />
            Sistema Operativo
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-cyber-gray-500">OS</p>
              <p className="text-sm font-medium text-cyber-gray-100">
                {systemInfo.os.distro} {systemInfo.os.release}
              </p>
              <p className="text-xs text-cyber-gray-300">{systemInfo.os.arch}</p>
            </div>

            <div>
              <p className="text-xs text-cyber-gray-500">Kernel</p>
              <p className="text-sm font-medium text-cyber-gray-100">{systemInfo.os.kernel}</p>
            </div>

            <div>
              <p className="text-xs text-cyber-gray-500">Hostname</p>
              <p className="text-sm font-medium text-cyber-gray-100">{systemInfo.os.hostname}</p>
            </div>

            <div>
              <p className="text-xs text-cyber-gray-500">Uptime</p>
              <p className="text-sm font-medium text-cyber-gray-100">{formatUptime(systemInfo.os.uptime)}</p>
            </div>
          </div>
        </div>

        {/* Network */}
        <div className="md:col-span-2">
          <h3 className="text-sm font-semibold text-cyber-orange-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Wifi className="w-4 h-4 text-cyber-orange-500" />
            Rete
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-cyber-gray-500">IP Pubblico</p>
              <p className="text-sm font-mono text-cyber-green-500/70">{systemInfo.network.publicIp}</p>
            </div>

            <div>
              <p className="text-xs text-cyber-gray-500">Gateway</p>
              <p className="text-sm font-mono text-cyber-green-500/70">{systemInfo.network.defaultGateway}</p>
            </div>

            <div>
              <p className="text-xs text-cyber-gray-500">Interfacce</p>
              <p className="text-sm font-medium text-cyber-gray-100">
                {systemInfo.network.interfaces.length} rilevate
              </p>
            </div>
          </div>

          {/* Lista interfacce */}
          <div className="mt-4 space-y-2">
            {systemInfo.network.interfaces.slice(0, 3).map((iface, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-cyber-bg-tertiary/50 rounded border border-cyber-green-500/10 hover:border-cyber-green-500/30 transition-all">
                <span className="text-sm font-medium text-cyber-gray-100">{iface.iface}</span>
                <div className="text-xs text-cyber-gray-300 space-x-4">
                  {iface.ip4 && <span className="font-mono">IPv4: {iface.ip4}</span>}
                  {iface.mac && <span className="font-mono">MAC: {iface.mac}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
