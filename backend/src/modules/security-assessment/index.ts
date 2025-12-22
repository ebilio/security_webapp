import { SecurityAssessment } from '../../types';
import { detectAntivirus } from './antivirus-detector';
import { checkFirewall } from './firewall-checker';
import { scanVulnerabilities } from './vulnerability-scanner';
import { checkWindowsUpdate, checkUAC, checkBitLocker } from './windows-security';
import os from 'os';

export async function performSecurityAssessment(): Promise<SecurityAssessment> {
  const platform = os.platform();

  // Controlli base eseguiti su tutte le piattaforme
  const [antivirus, firewall, vulnerabilities] = await Promise.all([
    detectAntivirus(),
    checkFirewall(),
    scanVulnerabilities()
  ]);

  // Open ports sarà popolato dal network scanner se disponibile
  const openPorts: SecurityAssessment['openPorts'] = [];

  // Controlli specifici per Windows (solo su Windows o WSL)
  let windowsUpdate, uac, diskEncryption;

  if (platform === 'win32' || process.env.WSL_DISTRO_NAME) {
    console.log('Running Windows-specific security checks...');

    try {
      [windowsUpdate, uac, diskEncryption] = await Promise.all([
        checkWindowsUpdate(),
        checkUAC(),
        checkBitLocker()
      ]);
    } catch (error) {
      console.error('Error running Windows security checks:', error);
    }
  }

  // Calcola security score base
  let securityScore = 100;

  if (!antivirus.installed || !antivirus.enabled) {
    securityScore -= 20;
  }

  if (!firewall.enabled) {
    securityScore -= 15;
  }

  securityScore -= vulnerabilities.filter(v => v.severity === 'critical').length * 10;
  securityScore -= vulnerabilities.filter(v => v.severity === 'high').length * 5;

  securityScore = Math.max(0, securityScore);

  return {
    antivirus,
    firewall,
    vulnerabilities,
    openPorts,
    securityScore,
    windowsUpdate,
    uac,
    diskEncryption
  };
}

export * from './antivirus-detector';
export * from './firewall-checker';
export * from './vulnerability-scanner';
// Force reload
