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
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Monitor className="w-6 h-6 text-primary-600" />
        Informazioni Sistema
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hardware */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Hardware
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">CPU</p>
              <p className="text-sm font-medium text-gray-800">
                {systemInfo.hardware.cpu.brand}
              </p>
              <p className="text-xs text-gray-600">
                {systemInfo.hardware.cpu.cores} cores @ {systemInfo.hardware.cpu.speed} GHz
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Memoria RAM</p>
              <p className="text-sm font-medium text-gray-800">
                {formatBytes(systemInfo.hardware.memory.total)}
              </p>
              <p className="text-xs text-gray-600">
                Usata: {formatBytes(systemInfo.hardware.memory.used)} ({((systemInfo.hardware.memory.used / systemInfo.hardware.memory.total) * 100).toFixed(1)}%)
              </p>
            </div>

            {systemInfo.hardware.graphics.length > 0 && (
              <div>
                <p className="text-xs text-gray-500">GPU</p>
                <p className="text-sm font-medium text-gray-800">
                  {systemInfo.hardware.graphics[0].model}
                </p>
                <p className="text-xs text-gray-600">{systemInfo.hardware.graphics[0].vendor}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sistema Operativo */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3 flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            Sistema Operativo
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">OS</p>
              <p className="text-sm font-medium text-gray-800">
                {systemInfo.os.distro} {systemInfo.os.release}
              </p>
              <p className="text-xs text-gray-600">{systemInfo.os.arch}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Kernel</p>
              <p className="text-sm font-medium text-gray-800">{systemInfo.os.kernel}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Hostname</p>
              <p className="text-sm font-medium text-gray-800">{systemInfo.os.hostname}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Uptime</p>
              <p className="text-sm font-medium text-gray-800">{formatUptime(systemInfo.os.uptime)}</p>
            </div>
          </div>
        </div>

        {/* Network */}
        <div className="md:col-span-2">
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3 flex items-center gap-2">
            <Wifi className="w-4 h-4" />
            Rete
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">IP Pubblico</p>
              <p className="text-sm font-medium text-gray-800">{systemInfo.network.publicIp}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Gateway</p>
              <p className="text-sm font-medium text-gray-800">{systemInfo.network.defaultGateway}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Interfacce</p>
              <p className="text-sm font-medium text-gray-800">
                {systemInfo.network.interfaces.length} rilevate
              </p>
            </div>
          </div>

          {/* Lista interfacce */}
          <div className="mt-4 space-y-2">
            {systemInfo.network.interfaces.slice(0, 3).map((iface, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">{iface.iface}</span>
                <div className="text-xs text-gray-600 space-x-4">
                  {iface.ip4 && <span>IPv4: {iface.ip4}</span>}
                  {iface.mac && <span>MAC: {iface.mac}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
