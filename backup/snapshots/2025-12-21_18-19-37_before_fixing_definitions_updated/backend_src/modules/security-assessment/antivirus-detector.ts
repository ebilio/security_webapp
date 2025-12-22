import { exec } from 'child_process';
import { readFile } from 'fs/promises';
import { AntivirusStatus } from '../../types';
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

// Verifica se un antivirus Windows è effettivamente in esecuzione controllando i suoi servizi
async function isAntivirusRunning(avName: string): Promise<boolean> {
  const isWsl = await isWSL();
  const scCommand = isWsl ? 'sc.exe' : 'sc';

  // Mappa dei servizi tipici per ogni antivirus
  const serviceMap: { [key: string]: string[] } = {
    'eset': ['ekrn', 'EsetSecurity'],
    'avg': ['AVG Antivirus', 'AVG Firewall', 'avgbIDSAgent', 'AVGWscReporter'],
    'avast': ['avast! Antivirus', 'AvastSvc', 'aswbidsdriver'],
    'norton': ['Norton Security', 'NortonSecurity'],
    'mcafee': ['McAfee', 'McShield', 'mfemms'],
    'kaspersky': ['AVP', 'KAVFS', 'KAVFSGT'],
    'bitdefender': ['VSSERV', 'bdredline'],
    'defender': ['WinDefend', 'Sense'],
    'windows defender': ['WinDefend', 'Sense']
  };

  // Trova i servizi da controllare basandosi sul nome dell'antivirus
  const avNameLower = avName.toLowerCase();
  let servicesToCheck: string[] = [];

  for (const [key, services] of Object.entries(serviceMap)) {
    if (avNameLower.includes(key)) {
      servicesToCheck = services;
      break;
    }
  }

  if (servicesToCheck.length === 0) {
    // Se non abbiamo servizi specifici, assumiamo che sia attivo
    // (fallback per antivirus meno comuni)
    console.log(`No known services for ${avName}, assuming it's running`);
    return true;
  }

  // Controlla se almeno uno dei servizi è in esecuzione (con timeout di 3 secondi per servizio)
  for (const service of servicesToCheck) {
    try {
      const { stdout } = await execWithTimeout(`${scCommand} query "${service}"`, 3000);
      if (stdout.includes('RUNNING') || stdout.includes('IN ESECUZIONE')) {
        console.log(`Service ${service} is running for ${avName}`);
        return true;
      }
    } catch {
      // Servizio non trovato, timeout o non in esecuzione, prova il prossimo
      continue;
    }
  }

  console.log(`No running services found for ${avName}`);
  return false;
}

export async function detectAntivirus(): Promise<AntivirusStatus> {
  const platform = os.platform();
  const wslDetected = await isWSL();

  try {
    // Se siamo in WSL, rileva antivirus Windows
    if (wslDetected || platform === 'win32') {
      return await detectWindowsAntivirus();
    } else if (platform === 'darwin') {
      return await detectMacAntivirus();
    } else if (platform === 'linux') {
      return await detectLinuxAntivirus();
    }

    return { installed: false, enabled: false, updated: false };
  } catch (error) {
    console.error('Error detecting antivirus:', error);
    return { installed: false, enabled: false, updated: false };
  }
}

async function detectWindowsAntivirus(): Promise<AntivirusStatus> {
  const isWsl = await isWSL();
  const psCommand = isWsl ? 'powershell.exe' : 'powershell';

  // Metodo 1: Rileva TUTTI gli antivirus tramite Windows Security Center (con timeout di 8 secondi)
  try {
    const { stdout } = await execWithTimeout(
      `${psCommand} -Command "Get-CimInstance -Namespace root/SecurityCenter2 -ClassName AntiVirusProduct | Select-Object displayName, productState | ConvertTo-Json"`,
      8000
    );

    const products = JSON.parse(stdout.trim());
    console.log('Antivirus products found:', products);

    // Se è un singolo prodotto, convertilo in array
    const avList = Array.isArray(products) ? products : [products];

    if (avList.length > 0) {
      // Decodifica del productState di Windows Security Center
      // Formato hex a 6 cifre: 0xDDSSPP
      // DD = Definition status (00=updated, 01=???, 04-10=out-of-date)
      // SS = Security provider state (00=disabled, 01/10/11=enabled)
      // PP = Product type

      const decodeProductState = (state: number) => {
        // Converti productState in hex a 6 cifre (es. 266240 = 0x041000)
        const hex = state.toString(16).padStart(6, '0');

        // Formato: 0xDDSSPP
        // DD (primi 2 char) = Definition status (00=updated, 10=out-of-date)
        // SS (char 2-3) = Security provider state (00=off, 01/10/11=on)
        // PP (ultimi 2) = Product type

        const defStatus = hex.substring(0, 2);
        const providerState = hex.substring(2, 4);

        // Provider is enabled if state is "01", "10", or "11" (any non-zero)
        const enabled = providerState !== '00';

        // Definitions are updated if status is "00" or "01"
        const updated = defStatus === '00' || defStatus === '01';

        return { enabled, updated };
      };

      // Controlla TUTTI gli antivirus rilevati
      const runningAVs: Array<{av: any, enabled: boolean, updated: boolean}> = [];

      for (const av of avList) {
        const { enabled, updated } = decodeProductState(av.productState);

        try {
          const isRunning = await isAntivirusRunning(av.displayName);

          if (isRunning) {
            runningAVs.push({ av, enabled, updated });
            console.log(`✓ Found running AV: ${av.displayName} (Enabled: ${enabled}, Updated: ${updated})`);
          } else {
            console.log(`✗ ${av.displayName} - no running services found`);
          }
        } catch (error) {
          console.log(`✗ Error checking ${av.displayName}:`, error);
          continue;
        }
      }

      if (runningAVs.length === 0) {
        console.log('No running antivirus found in Security Center');
        // Fallback al metodo Windows Defender
      } else {
        // Priorità di selezione:
        // 1. Antivirus di terze parti abilitato (non Windows Defender)
        // 2. Qualsiasi antivirus abilitato
        // 3. Primo antivirus trovato

        const thirdPartyEnabled = runningAVs.find(
          item => item.enabled && !item.av.displayName.toLowerCase().includes('defender')
        );

        const anyEnabled = runningAVs.find(item => item.enabled);

        const selectedAV = thirdPartyEnabled || anyEnabled || runningAVs[0];
        const state = selectedAV.av.productState;
        const hex = state.toString(16).padStart(6, '0');

        console.log(`\n=== Antivirus Selected ===`);
        console.log(`Name: ${selectedAV.av.displayName}`);
        console.log(`State: ${state} (0x${hex})`);
        console.log(`Enabled: ${selectedAV.enabled}`);
        console.log(`Updated: ${selectedAV.updated}`);
        console.log(`All detected: ${runningAVs.map(av => av.av.displayName).join(', ')}`);

        return {
          installed: true,
          name: selectedAV.av.displayName,
          enabled: selectedAV.enabled,
          updated: selectedAV.updated
        };
      }
    }
  } catch (error) {
    console.error('Error checking Security Center:', error);
  }

  // Metodo 2 (Fallback): Check specifico per Windows Defender (con timeout di 8 secondi)
  try {
    const { stdout } = await execWithTimeout(
      `${psCommand} -Command "Get-MpComputerStatus | Select-Object AntivirusEnabled, RealTimeProtectionEnabled, AntivirusSignatureLastUpdated | ConvertTo-Json"`,
      8000
    );

    const status = JSON.parse(stdout.trim());
    console.log('Windows Defender status (fallback):', status);

    return {
      installed: true,
      name: 'Windows Defender',
      enabled: status.AntivirusEnabled && status.RealTimeProtectionEnabled,
      updated: true
    };
  } catch (error) {
    console.error('Error checking Windows Defender:', error);
  }

  // Metodo 3 (Ultimo fallback): Controlla servizio WinDefend (con timeout di 5 secondi)
  try {
    const scCommand = isWsl ? 'sc.exe' : 'sc';
    await execWithTimeout(`${scCommand} query WinDefend`, 5000);
    return {
      installed: true,
      name: 'Windows Defender',
      enabled: true,
      updated: true
    };
  } catch (fallbackError) {
    console.error('All antivirus detection methods failed:', fallbackError);
    return { installed: false, enabled: false, updated: false };
  }
}

async function detectMacAntivirus(): Promise<AntivirusStatus> {
  // macOS non ha un antivirus built-in tradizionale
  // Check per software comuni come Sophos, Avast, etc.
  const commonAV = ['Sophos', 'Avast', 'AVG', 'Norton', 'McAfee'];

  for (const av of commonAV) {
    try {
      await execWithTimeout(`ps aux | grep -i ${av}`, 3000);
      return {
        installed: true,
        name: av,
        enabled: true,
        updated: true
      };
    } catch {
      continue;
    }
  }

  return { installed: false, enabled: false, updated: false };
}

async function detectLinuxAntivirus(): Promise<AntivirusStatus> {
  // Check ClamAV
  try {
    await execWithTimeout('which clamscan', 3000);

    // Prova a controllare il servizio senza sudo
    try {
      const { stdout } = await execWithTimeout('systemctl is-active clamav-daemon', 5000);
      console.log('ClamAV daemon status:', stdout.trim());

      return {
        installed: true,
        name: 'ClamAV',
        enabled: stdout.trim() === 'active',
        updated: true
      };
    } catch {
      // Se non riesce a controllare il servizio, assume installato ma stato sconosciuto
      console.log('ClamAV installed but daemon status unknown');
      return {
        installed: true,
        name: 'ClamAV',
        enabled: false,
        updated: true
      };
    }
  } catch (error) {
    console.log('ClamAV not found:', error);
    return { installed: false, enabled: false, updated: false };
  }
}
