/**
 * Client-Side Rating Engine
 * Calcola rating di sicurezza basato su informazioni del client
 */

import type { ClientSystemInfo, ClientNetworkInfo, ClientSecurityAssessment } from './clientInfo';

export interface RatingCategory {
  name: string;
  score: number;
  weight: number;
  details: string[];
}

export interface RatingResult {
  overall: number;
  categories: RatingCategory[];
  strengths: string[];
  recommendations: string[];
}

class ClientRatingEngine {
  /**
   * Calcola rating complessivo
   */
  calculateRating(
    systemInfo: ClientSystemInfo,
    networkInfo: ClientNetworkInfo,
    securityAssessment: ClientSecurityAssessment,
    browserFingerprint: any
  ): RatingResult {
    const categories: RatingCategory[] = [
      this.rateBrowserSecurity(systemInfo),
      this.rateConnectionSecurity(systemInfo, networkInfo),
      this.ratePrivacy(systemInfo, browserFingerprint),
      this.rateFeatureSupport(systemInfo),
    ];

    // Calcola overall score pesato
    const totalWeight = categories.reduce((sum, cat) => sum + cat.weight, 0);
    const overall = Math.round(
      categories.reduce((sum, cat) => sum + cat.score * cat.weight, 0) / totalWeight
    );

    // Identifica punti di forza
    const strengths = this.identifyStrengths(systemInfo, securityAssessment);

    // Raccomandazioni
    const recommendations = this.generateRecommendations(
      systemInfo,
      networkInfo,
      securityAssessment
    );

    return {
      overall,
      categories,
      strengths,
      recommendations,
    };
  }

  /**
   * Rating sicurezza browser
   */
  private rateBrowserSecurity(systemInfo: ClientSystemInfo): RatingCategory {
    let score = 100;
    const details: string[] = [];

    // Check browser moderno
    const ua = systemInfo.browser.userAgent.toLowerCase();
    if (ua.includes('msie') || ua.includes('trident')) {
      score -= 40;
      details.push('Browser obsoleto rilevato');
    } else {
      details.push('Browser moderno in uso');
    }

    // Check cookies
    if (!systemInfo.browser.cookieEnabled) {
      score -= 10;
      details.push('Cookie disabilitati');
    } else {
      details.push('Cookie abilitati');
    }

    // Check storage
    if (!systemInfo.features.localStorage) {
      score -= 5;
      details.push('LocalStorage non disponibile');
    }

    return {
      name: 'Sicurezza Browser',
      score: Math.max(0, score),
      weight: 30,
      details,
    };
  }

  /**
   * Rating sicurezza connessione
   */
  private rateConnectionSecurity(
    systemInfo: ClientSystemInfo,
    networkInfo: ClientNetworkInfo
  ): RatingCategory {
    let score = 100;
    const details: string[] = [];

    // Check HTTPS
    if (!systemInfo.security.httpsEnabled) {
      score -= 50;
      details.push('❌ Connessione NON sicura (HTTP)');
    } else {
      details.push('✅ Connessione sicura (HTTPS)');
    }

    // Check mixed content
    if (systemInfo.security.mixedContent) {
      score -= 20;
      details.push('⚠️ Contenuti misti rilevati');
    }

    // Check VPN
    if (networkInfo.vpnDetected) {
      details.push('✅ VPN/Proxy rilevato');
      score += 10; // Bonus per privacy
    }

    // Check connection quality
    if (systemInfo.connection) {
      const type = systemInfo.connection.effectiveType;
      if (type === '4g' || type === 'wifi') {
        details.push(`✅ Connessione veloce (${type})`);
      } else {
        details.push(`⚠️ Connessione lenta (${type})`);
        score -= 5;
      }
    }

    return {
      name: 'Sicurezza Connessione',
      score: Math.max(0, Math.min(100, score)),
      weight: 35,
      details,
    };
  }

  /**
   * Rating privacy
   */
  private ratePrivacy(systemInfo: ClientSystemInfo, fingerprint: any): RatingCategory {
    let score = 100;
    const details: string[] = [];

    // Check Do Not Track
    if (systemInfo.browser.doNotTrack === '1') {
      details.push('✅ Do Not Track abilitato');
      score += 10;
    } else {
      details.push('⚠️ Do Not Track disabilitato');
      score -= 10;
    }

    // Check WebRTC (leak IP)
    if (systemInfo.features.webRTC) {
      details.push('⚠️ WebRTC abilitato (rischio leak IP)');
      score -= 15;
    } else {
      details.push('✅ WebRTC disabilitato');
    }

    // Check fingerprinting resistance
    if (fingerprint) {
      const entropy = this.calculateEntropy(fingerprint);
      if (entropy > 15) {
        details.push('⚠️ Fingerprint altamente identificabile');
        score -= 20;
      } else if (entropy > 10) {
        details.push('⚠️ Fingerprint moderatamente identificabile');
        score -= 10;
      } else {
        details.push('✅ Fingerprint poco identificabile');
      }
    }

    return {
      name: 'Privacy',
      score: Math.max(0, Math.min(100, score)),
      weight: 25,
      details,
    };
  }

  /**
   * Rating supporto features moderne
   */
  private rateFeatureSupport(systemInfo: ClientSystemInfo): RatingCategory {
    let score = 0;
    const details: string[] = [];
    const features = systemInfo.features;

    const featureChecks = [
      { key: 'serviceWorker', name: 'Service Workers', points: 10 },
      { key: 'webWorker', name: 'Web Workers', points: 10 },
      { key: 'webGL', name: 'WebGL', points: 10 },
      { key: 'indexedDB', name: 'IndexedDB', points: 10 },
      { key: 'geolocation', name: 'Geolocation', points: 5 },
      { key: 'notifications', name: 'Notifications', points: 5 },
    ];

    featureChecks.forEach(({ key, name, points }) => {
      if (features[key as keyof typeof features]) {
        score += points;
        details.push(`✅ ${name} supportato`);
      } else {
        details.push(`❌ ${name} non supportato`);
      }
    });

    // Hardware moderno
    if (systemInfo.hardware.cpuCores >= 4) {
      score += 20;
      details.push(`✅ Multi-core CPU (${systemInfo.hardware.cpuCores} cores)`);
    }

    if (systemInfo.hardware.deviceMemory && systemInfo.hardware.deviceMemory >= 4) {
      score += 20;
      details.push(`✅ Memoria adeguata (${systemInfo.hardware.deviceMemory} GB)`);
    }

    return {
      name: 'Supporto Features',
      score: Math.min(100, score),
      weight: 10,
      details,
    };
  }

  /**
   * Identifica punti di forza
   */
  private identifyStrengths(
    systemInfo: ClientSystemInfo,
    assessment: ClientSecurityAssessment
  ): string[] {
    const strengths: string[] = [];

    if (systemInfo.security.httpsEnabled) {
      strengths.push('Connessione HTTPS sicura');
    }

    if (systemInfo.browser.doNotTrack === '1') {
      strengths.push('Privacy tracking disabilitato');
    }

    if (!systemInfo.features.webRTC) {
      strengths.push('WebRTC disabilitato per privacy');
    }

    if (systemInfo.hardware.cpuCores >= 4) {
      strengths.push('Hardware moderno e performante');
    }

    if (assessment.score >= 80) {
      strengths.push('Configurazione sicurezza ottimale');
    }

    return strengths;
  }

  /**
   * Genera raccomandazioni
   */
  private generateRecommendations(
    systemInfo: ClientSystemInfo,
    networkInfo: ClientNetworkInfo,
    assessment: ClientSecurityAssessment
  ): string[] {
    const recommendations: string[] = [];

    if (!systemInfo.security.httpsEnabled) {
      recommendations.push('⚠️ Usa sempre HTTPS per connessioni sicure');
    }

    if (systemInfo.browser.doNotTrack !== '1') {
      recommendations.push('💡 Abilita Do Not Track nelle impostazioni browser');
    }

    if (systemInfo.features.webRTC && !networkInfo.vpnDetected) {
      recommendations.push('💡 Disabilita WebRTC se usi VPN per evitare leak IP');
    }

    const ua = systemInfo.browser.userAgent.toLowerCase();
    if (ua.includes('msie') || ua.includes('trident')) {
      recommendations.push('🚨 Aggiorna a un browser moderno per sicurezza');
    }

    if (!systemInfo.features.serviceWorker) {
      recommendations.push('💡 Aggiorna il browser per supporto PWA');
    }

    // Aggiungi raccomandazioni da security assessment
    recommendations.push(...assessment.recommendations);

    return [...new Set(recommendations)]; // Rimuovi duplicati
  }

  /**
   * Calcola entropia del fingerprint (più alto = più identificabile)
   */
  private calculateEntropy(fingerprint: any): number {
    if (!fingerprint) return 0;

    let entropy = 0;

    // Calcolo semplificato dell'entropia
    if (fingerprint.canvas) entropy += 5;
    if (fingerprint.webgl) entropy += 5;
    if (fingerprint.audio) entropy += 3;
    if (fingerprint.fonts?.length > 20) entropy += 3;
    if (fingerprint.plugins?.length > 5) entropy += 2;

    return entropy;
  }
}

export const clientRatingEngine = new ClientRatingEngine();
