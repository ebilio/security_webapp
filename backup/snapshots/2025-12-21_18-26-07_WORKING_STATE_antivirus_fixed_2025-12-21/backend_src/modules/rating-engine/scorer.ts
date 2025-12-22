import {
  RatingResult,
  CategoryScore,
  ScoreDetail,
  BrowserFingerprint,
  SecurityAssessment,
  SystemInfo
} from '../../types';
import {
  MAX_SCORES,
  BROWSER_CHECKS,
  SYSTEM_CHECKS,
  NETWORK_CHECKS,
  SOFTWARE_CHECKS,
  PENALTIES,
  BROWSER_VERSIONS,
  SENSITIVE_PORTS
} from './weights';

export class RatingEngine {
  calculateRating(
    browserFingerprint: BrowserFingerprint | null,
    securityAssessment: SecurityAssessment | null,
    systemInfo: SystemInfo
  ): RatingResult {
    const categories = {
      browserSecurity: this.calculateBrowserSecurity(browserFingerprint),
      systemSecurity: this.calculateSystemSecurity(securityAssessment, systemInfo),
      networkSecurity: this.calculateNetworkSecurity(securityAssessment, systemInfo),
      softwareSecurity: this.calculateSoftwareSecurity(securityAssessment)
    };

    const overall = this.calculateOverallScore(categories);
    const { strengths, weaknesses, recommendations } = this.generateInsights(categories, securityAssessment);

    return {
      overall,
      categories,
      strengths,
      weaknesses,
      recommendations
    };
  }

  private calculateBrowserSecurity(fingerprint: BrowserFingerprint | null): CategoryScore {
    const details: ScoreDetail[] = [];
    let score = 0;

    if (!fingerprint) {
      details.push({
        name: 'Browser info non disponibile',
        points: 0,
        maxPoints: MAX_SCORES.browserSecurity,
        status: 'warning',
        message: 'Impossibile valutare sicurezza browser'
      });

      return { score: 0, maxScore: MAX_SCORES.browserSecurity, details };
    }

    // Check browser moderno
    const isBrowserModern = this.isBrowserModern(fingerprint.browser);
    const browserPoints = isBrowserModern ? BROWSER_CHECKS.modernBrowser : 0;
    score += browserPoints;
    details.push({
      name: 'Browser moderno e aggiornato',
      points: browserPoints,
      maxPoints: BROWSER_CHECKS.modernBrowser,
      status: isBrowserModern ? 'pass' : 'fail',
      message: isBrowserModern
        ? `${fingerprint.browser.name} ${fingerprint.browser.version} è aggiornato`
        : `${fingerprint.browser.name} ${fingerprint.browser.version} è obsoleto`
    });

    // Check Do Not Track
    const dntPoints = fingerprint.doNotTrack ? BROWSER_CHECKS.privacyExtensions : 0;
    score += dntPoints;
    details.push({
      name: 'Do Not Track abilitato',
      points: dntPoints,
      maxPoints: BROWSER_CHECKS.privacyExtensions,
      status: fingerprint.doNotTrack ? 'pass' : 'warning',
      message: fingerprint.doNotTrack ? 'DNT abilitato' : 'DNT non abilitato'
    });

    // Check cookies
    const cookiePoints = fingerprint.cookieEnabled ? BROWSER_CHECKS.secureSettings : 0;
    score += cookiePoints;
    details.push({
      name: 'Cookie gestiti correttamente',
      points: cookiePoints,
      maxPoints: BROWSER_CHECKS.secureSettings,
      status: fingerprint.cookieEnabled ? 'pass' : 'warning',
      message: 'Cookie abilitati per funzionalità essenziali'
    });

    // Privacy score
    const privacyPoints = fingerprint.privacyScore > 70 ? BROWSER_CHECKS.httpsEverywhere : 0;
    score += privacyPoints;
    details.push({
      name: 'Privacy score alto',
      points: privacyPoints,
      maxPoints: BROWSER_CHECKS.httpsEverywhere,
      status: fingerprint.privacyScore > 70 ? 'pass' : 'warning',
      message: `Privacy score: ${fingerprint.privacyScore}/100`
    });

    return { score, maxScore: MAX_SCORES.browserSecurity, details };
  }

  private calculateSystemSecurity(
    assessment: SecurityAssessment | null,
    systemInfo: SystemInfo
  ): CategoryScore {
    const details: ScoreDetail[] = [];
    let score = 0;

    if (!assessment) {
      // Valutazione base senza security assessment completo
      details.push({
        name: 'Security assessment non disponibile',
        points: 0,
        maxPoints: MAX_SCORES.systemSecurity,
        status: 'warning',
        message: 'Esegui una scansione di sicurezza completa'
      });

      return { score: 0, maxScore: MAX_SCORES.systemSecurity, details };
    }

    // Check antivirus installato e attivo
    const avPoints = assessment.antivirus.installed && assessment.antivirus.enabled
      ? SYSTEM_CHECKS.antivirusActive
      : 0;
    score += avPoints;
    details.push({
      name: 'Antivirus attivo',
      points: avPoints,
      maxPoints: SYSTEM_CHECKS.antivirusActive,
      status: assessment.antivirus.installed && assessment.antivirus.enabled ? 'pass' : 'fail',
      message: assessment.antivirus.installed
        ? `${assessment.antivirus.name || 'Antivirus'} ${assessment.antivirus.enabled ? 'attivo' : 'disabilitato'}`
        : 'Nessun antivirus rilevato'
    });

    // Check antivirus aggiornato
    const avUpdatedPoints = assessment.antivirus.installed && assessment.antivirus.updated
      ? SYSTEM_CHECKS.antivirusUpdated
      : 0;
    score += avUpdatedPoints;
    details.push({
      name: 'Definizioni antivirus aggiornate',
      points: avUpdatedPoints,
      maxPoints: SYSTEM_CHECKS.antivirusUpdated,
      status: assessment.antivirus.updated ? 'pass' : 'warning',
      message: assessment.antivirus.installed
        ? (assessment.antivirus.updated ? 'Definizioni aggiornate' : 'Definizioni non aggiornate')
        : 'Antivirus non installato'
    });

    // Penalità se non c'è antivirus
    if (!assessment.antivirus.installed) {
      score += PENALTIES.noAntivirus;
    }

    // Check firewall
    const fwPoints = assessment.firewall.enabled ? SYSTEM_CHECKS.firewallActive : 0;
    score += fwPoints;
    details.push({
      name: 'Firewall attivo',
      points: fwPoints,
      maxPoints: SYSTEM_CHECKS.firewallActive,
      status: assessment.firewall.enabled ? 'pass' : 'fail',
      message: assessment.firewall.enabled
        ? `Firewall ${assessment.firewall.name || ''} attivo`
        : 'Firewall disabilitato'
    });

    // Penalità se non c'è firewall
    if (!assessment.firewall.enabled) {
      score += PENALTIES.noFirewall;
    }

    // Check OS aggiornato (basato su uptime e versione)
    const isOSUpdated = this.isOSUpdated(systemInfo.os);
    const osPoints = isOSUpdated ? SYSTEM_CHECKS.osUpdated : 0;
    score += osPoints;
    details.push({
      name: 'Sistema operativo aggiornato',
      points: osPoints,
      maxPoints: SYSTEM_CHECKS.osUpdated,
      status: isOSUpdated ? 'pass' : 'warning',
      message: `${systemInfo.os.distro} ${systemInfo.os.release}`
    });

    // Check Windows Update (solo su Windows)
    if (assessment.windowsUpdate) {
      const wuPoints = assessment.windowsUpdate.enabled && assessment.windowsUpdate.pendingUpdates === 0
        ? SYSTEM_CHECKS.windowsUpdateCheck
        : 0;
      score += wuPoints;
      details.push({
        name: 'Windows Update',
        points: wuPoints,
        maxPoints: SYSTEM_CHECKS.windowsUpdateCheck,
        status: assessment.windowsUpdate.pendingUpdates === 0 ? 'pass' : 'warning',
        message: assessment.windowsUpdate.pendingUpdates === 0
          ? 'Sistema completamente aggiornato'
          : `${assessment.windowsUpdate.pendingUpdates} aggiornamenti pendenti`
      });
    }

    // Check UAC (solo su Windows)
    if (assessment.uac) {
      const uacPoints = assessment.uac.enabled ? SYSTEM_CHECKS.uacEnabled : 0;
      score += uacPoints;
      details.push({
        name: 'UAC (User Account Control)',
        points: uacPoints,
        maxPoints: SYSTEM_CHECKS.uacEnabled,
        status: assessment.uac.enabled ? 'pass' : 'fail',
        message: assessment.uac.enabled ? 'UAC abilitato' : 'UAC disabilitato'
      });
    }

    // Check disk encryption (BitLocker su Windows)
    if (assessment.diskEncryption) {
      const encPoints = assessment.diskEncryption.enabled ? SYSTEM_CHECKS.diskEncryption : 0;
      score += encPoints;
      details.push({
        name: 'Crittografia disco',
        points: encPoints,
        maxPoints: SYSTEM_CHECKS.diskEncryption,
        status: assessment.diskEncryption.enabled ? 'pass' : 'warning',
        message: assessment.diskEncryption.enabled
          ? `${assessment.diskEncryption.type}: ${assessment.diskEncryption.volumes || 1} volumi criptati`
          : 'Crittografia disco non abilitata'
      });
    }

    return { score: Math.max(0, score), maxScore: MAX_SCORES.systemSecurity, details };
  }

  private calculateNetworkSecurity(
    assessment: SecurityAssessment | null,
    _systemInfo: SystemInfo
  ): CategoryScore {
    const details: ScoreDetail[] = [];
    let score = 0;

    // Check porte chiuse
    const openPorts = assessment?.openPorts || [];
    const sensitivePorts = openPorts.filter(p => SENSITIVE_PORTS.includes(p.port));

    if (sensitivePorts.length === 0) {
      score += NETWORK_CHECKS.closedPorts;
      details.push({
        name: 'Porte sensibili chiuse',
        points: NETWORK_CHECKS.closedPorts,
        maxPoints: NETWORK_CHECKS.closedPorts,
        status: 'pass',
        message: 'Nessuna porta sensibile esposta'
      });
    } else {
      score += PENALTIES.exposedSensitivePorts * sensitivePorts.length;
      details.push({
        name: 'Porte sensibili chiuse',
        points: 0,
        maxPoints: NETWORK_CHECKS.closedPorts,
        status: 'fail',
        message: `${sensitivePorts.length} porte sensibili esposte: ${sensitivePorts.map(p => p.port).join(', ')}`
      });
    }

    // Check encryption (placeholder - richiederebbe scan WiFi)
    const encryptionPoints = NETWORK_CHECKS.encryption / 2; // Assumiamo encryption media
    score += encryptionPoints;
    details.push({
      name: 'Encryption di rete',
      points: encryptionPoints,
      maxPoints: NETWORK_CHECKS.encryption,
      status: 'warning',
      message: 'Verifica manualmente encryption WiFi (WPA2/WPA3)'
    });

    // Check password router (placeholder)
    const passwordPoints = NETWORK_CHECKS.strongPassword / 2;
    score += passwordPoints;
    details.push({
      name: 'Password router forte',
      points: passwordPoints,
      maxPoints: NETWORK_CHECKS.strongPassword,
      status: 'warning',
      message: 'Verifica manualmente password router'
    });

    return { score: Math.max(0, score), maxScore: MAX_SCORES.networkSecurity, details };
  }

  private calculateSoftwareSecurity(assessment: SecurityAssessment | null): CategoryScore {
    const details: ScoreDetail[] = [];
    let score = 0;

    if (!assessment) {
      details.push({
        name: 'Software assessment non disponibile',
        points: 0,
        maxPoints: MAX_SCORES.softwareSecurity,
        status: 'warning',
        message: 'Esegui una scansione di sicurezza completa'
      });

      return { score: 0, maxScore: MAX_SCORES.softwareSecurity, details };
    }

    // Check vulnerabilità CVE
    const criticalVulns = assessment.vulnerabilities.filter(v => v.severity === 'critical' || v.severity === 'high');

    if (criticalVulns.length === 0) {
      score += SOFTWARE_CHECKS.updatedSoftware;
      details.push({
        name: 'Software aggiornato (no CVE critici)',
        points: SOFTWARE_CHECKS.updatedSoftware,
        maxPoints: SOFTWARE_CHECKS.updatedSoftware,
        status: 'pass',
        message: 'Nessuna vulnerabilità critica rilevata'
      });
    } else {
      const penalty = PENALTIES.criticalCVE * criticalVulns.length;
      score += penalty;
      details.push({
        name: 'Software aggiornato (no CVE critici)',
        points: 0,
        maxPoints: SOFTWARE_CHECKS.updatedSoftware,
        status: 'fail',
        message: `${criticalVulns.length} vulnerabilità critiche trovate`
      });
    }

    // Check servizi disabilitati (basato su porte aperte)
    const unnecessaryPorts = assessment.openPorts.length;
    const servicesPoints = unnecessaryPorts < 5 ? SOFTWARE_CHECKS.disabledServices : 0;
    score += servicesPoints;
    details.push({
      name: 'Servizi non necessari disabilitati',
      points: servicesPoints,
      maxPoints: SOFTWARE_CHECKS.disabledServices,
      status: unnecessaryPorts < 5 ? 'pass' : 'warning',
      message: `${unnecessaryPorts} porte aperte rilevate`
    });

    return { score: Math.max(0, score), maxScore: MAX_SCORES.softwareSecurity, details };
  }

  private calculateOverallScore(categories: RatingResult['categories']): number {
    const total =
      categories.browserSecurity.score +
      categories.systemSecurity.score +
      categories.networkSecurity.score +
      categories.softwareSecurity.score;

    // Normalizza su scala 0-100
    return Math.max(0, Math.min(100, total));
  }

  private generateInsights(
    categories: RatingResult['categories'],
    assessment: SecurityAssessment | null
  ): { strengths: string[]; weaknesses: string[]; recommendations: string[] } {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const recommendations: string[] = [];

    // Evita warning unused variable
    const _categories = categories;

    // Analizza ogni categoria
    Object.entries(_categories).forEach(([category, data]) => {
      const percentage = (data.score / data.maxScore) * 100;

      if (percentage >= 80) {
        const passed = data.details.filter(d => d.status === 'pass');
        if (passed.length > 0) {
          strengths.push(`${this.getCategoryName(category)}: ${passed[0].message}`);
        }
      } else if (percentage < 50) {
        const failed = data.details.filter(d => d.status === 'fail');
        if (failed.length > 0) {
          weaknesses.push(`${this.getCategoryName(category)}: ${failed[0].message}`);
        }
      }
    });

    // Genera raccomandazioni
    if (assessment) {
      if (!assessment.antivirus.installed) {
        recommendations.push('Installa e attiva un antivirus affidabile');
      }
      if (!assessment.firewall.enabled) {
        recommendations.push('Attiva il firewall del sistema');
      }
      if (assessment.vulnerabilities.length > 0) {
        recommendations.push(`Aggiorna il software per risolvere ${assessment.vulnerabilities.length} vulnerabilità`);
      }
      if (assessment.openPorts.length > 10) {
        recommendations.push('Chiudi le porte non necessarie');
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('Continua a mantenere il sistema aggiornato');
      recommendations.push('Esegui scansioni periodiche');
    }

    return { strengths, weaknesses, recommendations };
  }

  private isBrowserModern(browser: BrowserFingerprint['browser']): boolean {
    const browserName = browser.name.toLowerCase();
    const version = parseInt(browser.version.split('.')[0]);

    const minVersions: Record<string, number> = BROWSER_VERSIONS;

    for (const [name, minVersion] of Object.entries(minVersions)) {
      if (browserName.includes(name)) {
        return version >= minVersion;
      }
    }

    return true; // Se non riconosciuto, assumiamo sia moderno
  }

  private isOSUpdated(os: SystemInfo['os']): boolean {
    // Logica semplificata: considera aggiornato se non è Windows 7/8 o versioni molto vecchie
    const distro = os.distro.toLowerCase();

    if (distro.includes('windows')) {
      return !distro.includes('7') && !distro.includes('8') && !distro.includes('xp');
    }

    return true; // Linux/Mac generalmente aggiornati
  }

  private getCategoryName(category: string): string {
    const names: Record<string, string> = {
      browserSecurity: 'Sicurezza Browser',
      systemSecurity: 'Sicurezza Sistema',
      networkSecurity: 'Sicurezza Rete',
      softwareSecurity: 'Sicurezza Software'
    };

    return names[category] || category;
  }
}
