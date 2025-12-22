import { exec } from 'child_process';
import { readFile } from 'fs/promises';
import { FirewallStatus } from '../../types';
import os from 'os';

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

export async function checkFirewall(): Promise<FirewallStatus> {
  const platform = os.platform();
  const wslDetected = await isWSL();

  try {
    // Se siamo in WSL, controlla firewall Windows
    if (wslDetected || platform === 'win32') {
      return await checkWindowsFirewall();
    } else if (platform === 'darwin') {
      return await checkMacFirewall();
    } else if (platform === 'linux') {
      return await checkLinuxFirewall();
    }

    return { enabled: false };
  } catch (error) {
    console.error('Error checking firewall:', error);
    return { enabled: false };
  }
}

async function checkWindowsFirewall(): Promise<FirewallStatus> {
  try {
    // Determina se siamo in WSL per usare il comando corretto
    const isWsl = await isWSL();
    const netshCommand = isWsl ? 'netsh.exe' : 'netsh';

    const { stdout } = await execWithTimeout(`${netshCommand} advfirewall show allprofiles state`, 8000);

    console.log('Windows Firewall output:', stdout);

    // Supporta sia output in inglese che in italiano
    const enabled = stdout.includes('ON') ||
                   stdout.includes('Attivato') ||
                   stdout.toUpperCase().includes('STATO') && stdout.toUpperCase().includes('ON');

    return {
      enabled,
      name: 'Windows Firewall'
    };
  } catch (error) {
    console.error('Error checking Windows Firewall:', error);
    return { enabled: false, name: 'Windows Firewall' };
  }
}

async function checkMacFirewall(): Promise<FirewallStatus> {
  try {
    const { stdout } = await execWithTimeout('sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate', 8000);

    const enabled = stdout.includes('enabled');

    return {
      enabled,
      name: 'macOS Firewall'
    };
  } catch (error) {
    return { enabled: false, name: 'macOS Firewall' };
  }
}

async function checkLinuxFirewall(): Promise<FirewallStatus> {
  // Check UFW - prova prima senza sudo (con timeout)
  try {
    let stdout;
    try {
      const result = await execWithTimeout('ufw status', 5000);
      stdout = result.stdout;
    } catch {
      // Prova con sudo se il comando senza sudo fallisce
      const result = await execWithTimeout('sudo ufw status', 5000);
      stdout = result.stdout;
    }

    console.log('UFW status:', stdout);

    if (stdout.includes('active') || stdout.includes('attivo')) {
      return { enabled: true, name: 'UFW' };
    }
  } catch (error) {
    console.log('UFW check failed, trying iptables:', error);
  }

  // Check iptables - prova prima senza sudo (con timeout)
  try {
    let stdout;
    try {
      const result = await execWithTimeout('iptables -L -n', 5000);
      stdout = result.stdout;
    } catch {
      // Prova con sudo se il comando senza sudo fallisce
      const result = await execWithTimeout('sudo iptables -L -n', 5000);
      stdout = result.stdout;
    }

    console.log('iptables rules count:', stdout.split('\n').length);

    // Se ci sono regole, assumiamo firewall attivo
    const hasRules = stdout.split('\n').length > 10;

    return {
      enabled: hasRules,
      name: 'iptables',
      rules: stdout.split('\n').length
    };
  } catch (error) {
    console.error('iptables check failed:', error);
    return { enabled: false };
  }
}
