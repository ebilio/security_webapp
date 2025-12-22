import { SystemInfo } from '../../types';
import { getHardwareInfo } from './hardware-info';
import { getSoftwareInfo } from './software-info';
import { getOSInfo } from './os-info';
import { getNetworkInfo } from './network-info';

export async function getSystemInfo(): Promise<SystemInfo> {
  const [hardware, software, os, network] = await Promise.all([
    getHardwareInfo(),
    getSoftwareInfo(),
    getOSInfo(),
    getNetworkInfo()
  ]);

  return {
    hardware,
    software,
    os,
    network
  };
}

export * from './hardware-info';
export * from './software-info';
export * from './os-info';
export * from './network-info';
