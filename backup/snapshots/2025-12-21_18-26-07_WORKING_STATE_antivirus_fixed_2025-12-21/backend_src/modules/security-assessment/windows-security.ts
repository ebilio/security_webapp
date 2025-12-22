import { exec } from 'child_process';
import { readFile } from 'fs/promises';
import { WindowsUpdateStatus, UACStatus, DiskEncryptionStatus } from '../../types';

// Helper per eseguire comandi con timeout
async function execWithTimeout(command: string, timeoutMs: number = 5000): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = exec(command, (error, stdout, stderr) => {
      if (error && !error.killed) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });

    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error(`Command timed out after ${timeoutMs}ms: ${command}`));
    }, timeoutMs);

    child.on('exit', () => {
      clearTimeout(timeout);
    });
  });
}

async function isWSL(): Promise<boolean> {
  try {
    const procVersion = await readFile('/proc/version', 'utf-8');
    return procVersion.toLowerCase().includes('microsoft') || procVersion.toLowerCase().includes('wsl');
  } catch {
    return false;
  }
}

/**
 * Controlla lo stato di Windows Update
 * OTTIMIZZATO: Usa solo il fallback veloce, Get-WindowsUpdate è troppo lento e causa blocchi
 */
export async function checkWindowsUpdate(): Promise<WindowsUpdateStatus> {
  try {
    const isWsl = await isWSL();
    const scCommand = isWsl ? 'sc.exe' : 'sc';

    // Controlla solo se il servizio Windows Update è in esecuzione (veloce, con timeout di 5 secondi)
    const { stdout } = await execWithTimeout(`${scCommand} query wuauserv`, 5000);

    const enabled = stdout.includes('RUNNING') || stdout.includes('IN ESECUZIONE');

    console.log(`Windows Update service: ${enabled ? 'running' : 'not running'}`);

    return {
      enabled: enabled,
      pendingUpdates: 0 // Non controlliamo gli aggiornamenti pendenti perché Get-WindowsUpdate è troppo lento
    };
  } catch (error) {
    console.error('Error checking Windows Update service:', error);
    return {
      enabled: false,
      pendingUpdates: 0
    };
  }
}

/**
 * Controlla se UAC (User Account Control) è abilitato
 */
export async function checkUAC(): Promise<UACStatus> {
  try {
    const isWsl = await isWSL();
    const psCommand = isWsl ? 'powershell.exe' : 'powershell';

    // Controlla UAC tramite registro (con timeout di 8 secondi)
    const { stdout } = await execWithTimeout(
      `${psCommand} -Command "Get-ItemProperty -Path 'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System' -Name EnableLUA | Select-Object -ExpandProperty EnableLUA"`,
      8000
    );

    const enabled = stdout.trim() === '1';

    console.log(`UAC: ${enabled ? 'abilitato' : 'disabilitato'}`);

    return {
      enabled: enabled,
      level: enabled ? 'enabled' : 'disabled'
    };
  } catch (error) {
    console.error('Error checking UAC:', error);
    return {
      enabled: false
    };
  }
}

/**
 * Controlla se BitLocker è abilitato
 */
export async function checkBitLocker(): Promise<DiskEncryptionStatus> {
  try {
    const isWsl = await isWSL();
    const psCommand = isWsl ? 'powershell.exe' : 'powershell';

    // Controlla BitLocker (con timeout di 10 secondi)
    const { stdout } = await execWithTimeout(
      `${psCommand} -Command "Get-BitLockerVolume | Where-Object {$_.ProtectionStatus -eq 'On'} | Measure-Object | Select-Object -ExpandProperty Count"`,
      10000
    );

    const encryptedVolumes = parseInt(stdout.trim()) || 0;

    console.log(`BitLocker: ${encryptedVolumes} volumi criptati`);

    return {
      enabled: encryptedVolumes > 0,
      type: 'BitLocker',
      volumes: encryptedVolumes
    };
  } catch (error) {
    console.error('Error checking BitLocker:', error);
    return {
      enabled: false,
      type: 'BitLocker',
      volumes: 0
    };
  }
}
