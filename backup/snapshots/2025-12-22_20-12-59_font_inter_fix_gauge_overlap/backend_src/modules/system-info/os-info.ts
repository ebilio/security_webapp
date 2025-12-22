import si from 'systeminformation';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import { OSInfo } from '../../types';

const execAsync = promisify(exec);

async function isWSL(): Promise<boolean> {
  try {
    const procVersion = await readFile('/proc/version', 'utf-8');
    return procVersion.toLowerCase().includes('microsoft') || procVersion.toLowerCase().includes('wsl');
  } catch {
    return false;
  }
}

async function getWindowsHostInfo(): Promise<Partial<OSInfo> | null> {
  try {
    // Prova a ottenere info Windows dall'host tramite PowerShell
    const { stdout: winVersion } = await execAsync(
      'powershell.exe -Command "(Get-CimInstance Win32_OperatingSystem).Caption"',
      { timeout: 3000 }
    );

    const { stdout: winBuild } = await execAsync(
      'powershell.exe -Command "(Get-CimInstance Win32_OperatingSystem).Version"',
      { timeout: 3000 }
    );

    const distro = winVersion.trim();
    const release = winBuild.trim();

    return {
      platform: 'win32',
      distro,
      release,
      arch: 'x64'
    };
  } catch (error) {
    console.error('Failed to get Windows host info:', error);
    return null;
  }
}

export async function getOSInfo(): Promise<OSInfo> {
  try {
    const osInfo = await si.osInfo();
    const wslDetected = await isWSL();

    console.log('🔍 WSL Detection:', wslDetected);
    console.log('📊 Original OS:', osInfo.distro, osInfo.release);

    let platform = osInfo.platform;
    let distro = osInfo.distro;
    let release = osInfo.release;
    let arch = osInfo.arch;

    // Se siamo in WSL, prova a ottenere info Windows host
    if (wslDetected) {
      console.log('🪟 Querying Windows host...');
      const windowsInfo = await getWindowsHostInfo();
      if (windowsInfo) {
        console.log('✅ Windows info retrieved:', windowsInfo.distro);
        platform = windowsInfo.platform || platform;
        distro = windowsInfo.distro || distro;
        release = windowsInfo.release || release;
        arch = windowsInfo.arch || arch;
      } else {
        console.log('❌ Failed to get Windows info');
      }
    }

    return {
      platform,
      distro,
      release,
      kernel: osInfo.kernel,
      arch,
      hostname: os.hostname(),
      uptime: os.uptime()
    };
  } catch (error) {
    console.error('Error getting OS info:', error);
    throw new Error('Failed to retrieve OS information');
  }
}
