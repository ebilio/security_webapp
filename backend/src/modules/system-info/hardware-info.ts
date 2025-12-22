import si from 'systeminformation';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import { HardwareInfo } from '../../types';

const execAsync = promisify(exec);

async function isWSL(): Promise<boolean> {
  try {
    const procVersion = await readFile('/proc/version', 'utf-8');
    return procVersion.toLowerCase().includes('microsoft') || procVersion.toLowerCase().includes('wsl');
  } catch {
    return false;
  }
}

async function getWindowsHardwareInfo(): Promise<Partial<HardwareInfo> | null> {
  try {
    // CPU info da Windows
    const { stdout: cpuName } = await execAsync(
      'powershell.exe -Command "(Get-CimInstance Win32_Processor).Name"',
      { timeout: 3000 }
    );

    const { stdout: cpuCores } = await execAsync(
      'powershell.exe -Command "(Get-CimInstance Win32_Processor).NumberOfCores"',
      { timeout: 3000 }
    );

    const { stdout: cpuLogical } = await execAsync(
      'powershell.exe -Command "(Get-CimInstance Win32_Processor).NumberOfLogicalProcessors"',
      { timeout: 3000 }
    );

    // RAM info da Windows
    const { stdout: totalRAM } = await execAsync(
      'powershell.exe -Command "(Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory"',
      { timeout: 3000 }
    );

    // GPU info da Windows
    const { stdout: gpuName } = await execAsync(
      'powershell.exe -Command "(Get-CimInstance Win32_VideoController).Name"',
      { timeout: 3000 }
    );

    const physicalCores = parseInt(cpuCores.trim());
    const logicalCores = parseInt(cpuLogical.trim());
    const totalMem = parseInt(totalRAM.trim());

    return {
      cpu: {
        manufacturer: cpuName.includes('Intel') ? 'Intel' : cpuName.includes('AMD') ? 'AMD' : 'Unknown',
        brand: cpuName.trim(),
        cores: logicalCores,
        physicalCores: physicalCores,
        speed: 0 // Non facilmente ottenibile da PowerShell
      },
      memory: {
        total: totalMem,
        free: 0, // Verrà aggiornato
        used: 0
      },
      graphics: gpuName.trim() ? [{
        vendor: gpuName.includes('NVIDIA') ? 'NVIDIA' : gpuName.includes('AMD') ? 'AMD' : gpuName.includes('Intel') ? 'Intel' : 'Unknown',
        model: gpuName.trim(),
        vram: 0
      }] : []
    };
  } catch (error) {
    console.error('Failed to get Windows hardware info:', error);
    return null;
  }
}

export async function getHardwareInfo(): Promise<HardwareInfo> {
  try {
    const [cpu, memory, diskLayout, graphics] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.diskLayout(),
      si.graphics()
    ]);

    const wslDetected = await isWSL();
    let finalCPU = cpu;
    let finalMemory = memory;
    let finalGraphics = graphics;

    // Se siamo in WSL, sovrascrivi con info reali Windows
    if (wslDetected) {
      const windowsHW = await getWindowsHardwareInfo();
      if (windowsHW) {
        if (windowsHW.cpu) {
          finalCPU = {
            ...cpu,
            manufacturer: windowsHW.cpu.manufacturer,
            brand: windowsHW.cpu.brand,
            cores: windowsHW.cpu.cores,
            physicalCores: windowsHW.cpu.physicalCores
          };
        }
        if (windowsHW.memory) {
          finalMemory = {
            ...memory,
            total: windowsHW.memory.total
          };
        }
        if (windowsHW.graphics && windowsHW.graphics.length > 0) {
          finalGraphics = {
            ...graphics,
            controllers: windowsHW.graphics.map((gpu, idx) => ({
              ...graphics.controllers[idx] || {},
              vendor: gpu.vendor,
              model: gpu.model,
              vram: gpu.vram
            })) as any
          };
        }
      }
    }

    return {
      cpu: {
        manufacturer: finalCPU.manufacturer,
        brand: finalCPU.brand,
        cores: finalCPU.cores,
        physicalCores: finalCPU.physicalCores,
        speed: finalCPU.speed
      },
      memory: {
        total: finalMemory.total,
        free: finalMemory.free,
        used: finalMemory.used
      },
      storage: diskLayout.map(disk => ({
        device: disk.device,
        size: disk.size,
        used: 0,
        available: disk.size,
        mount: disk.name
      })),
      graphics: finalGraphics.controllers.map(gpu => ({
        vendor: gpu.vendor || 'Unknown',
        model: gpu.model || 'Unknown',
        vram: gpu.vram || 0
      }))
    };
  } catch (error) {
    console.error('Error getting hardware info:', error);
    throw new Error('Failed to retrieve hardware information');
  }
}
