/**
 * Client Info Service
 * Raccoglie informazioni del browser/dispositivo dell'utente usando Web APIs
 */

export interface ClientSystemInfo {
  browser: {
    userAgent: string;
    platform: string;
    language: string;
    languages: readonly string[];
    cookieEnabled: boolean;
    doNotTrack: string | null;
    onLine: boolean;
  };
  screen: {
    width: number;
    height: number;
    availWidth: number;
    availHeight: number;
    colorDepth: number;
    pixelRatio: number;
  };
  hardware: {
    cpuCores: number;
    deviceMemory?: number; // GB, se disponibile
    maxTouchPoints: number;
  };
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
    saveData?: boolean;
  };
  security: {
    secureContext: boolean;
    httpsEnabled: boolean;
    mixedContent: boolean;
  };
  features: {
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
    serviceWorker: boolean;
    webWorker: boolean;
    webGL: boolean;
    webRTC: boolean;
    geolocation: boolean;
    notifications: boolean;
    camera: boolean;
    microphone: boolean;
  };
  timezone: {
    offset: number;
    name: string;
  };
}

export interface ClientNetworkInfo {
  publicIp: string;
  country?: string;
  city?: string;
  isp?: string;
  vpnDetected?: boolean;
}

export interface ClientSecurityAssessment {
  risks: Array<{
    level: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    message: string;
  }>;
  score: number;
  recommendations: string[];
}

class ClientInfoService {
  /**
   * Raccoglie informazioni di sistema del CLIENT
   */
  async getSystemInfo(): Promise<ClientSystemInfo> {
    const nav = navigator as any;

    // Browser info
    const browser = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      languages: navigator.languages,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: nav.doNotTrack || null,
      onLine: navigator.onLine,
    };

    // Screen info
    const screen = {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio || 1,
    };

    // Hardware info
    const hardware = {
      cpuCores: navigator.hardwareConcurrency || 0,
      deviceMemory: nav.deviceMemory, // Chrome only
      maxTouchPoints: navigator.maxTouchPoints || 0,
    };

    // Connection info (se disponibile)
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    const connectionInfo = connection ? {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    } : undefined;

    // Security context
    const security = {
      secureContext: window.isSecureContext,
      httpsEnabled: window.location.protocol === 'https:',
      mixedContent: window.location.protocol === 'https:' && document.querySelector('[src^="http:"]') !== null,
    };

    // Feature detection
    const features = {
      localStorage: this.testFeature(() => window.localStorage !== undefined),
      sessionStorage: this.testFeature(() => window.sessionStorage !== undefined),
      indexedDB: this.testFeature(() => window.indexedDB !== undefined),
      serviceWorker: 'serviceWorker' in navigator,
      webWorker: typeof Worker !== 'undefined',
      webGL: this.testWebGL(),
      webRTC: 'RTCPeerConnection' in window,
      geolocation: 'geolocation' in navigator,
      notifications: 'Notification' in window,
      camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      microphone: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    };

    // Timezone
    const timezone = {
      offset: new Date().getTimezoneOffset(),
      name: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    return {
      browser,
      screen,
      hardware,
      connection: connectionInfo,
      security,
      features,
      timezone,
    };
  }

  /**
   * Ottiene IP pubblico e info di rete del CLIENT
   */
  async getNetworkInfo(): Promise<ClientNetworkInfo> {
    try {
      // Usa ipapi.co per ottenere IP e geolocalizzazione (HTTPS, gratis)
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      return {
        publicIp: data.ip || 'Unknown',
        country: data.country_name,
        city: data.city,
        isp: data.org,
        vpnDetected: data.threat?.is_proxy || false,
      };
    } catch (error) {
      console.error('Error fetching network info:', error);

      // Fallback: prova solo IP con ipify
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        return {
          publicIp: ipData.ip,
        };
      } catch (fallbackError) {
        console.error('Fallback IP fetch failed:', fallbackError);
        return {
          publicIp: 'Unknown',
        };
      }
    }
  }

  /**
   * Esegue security assessment del CLIENT
   */
  async performSecurityAssessment(systemInfo: ClientSystemInfo): Promise<ClientSecurityAssessment> {
    const risks: ClientSecurityAssessment['risks'] = [];
    const recommendations: string[] = [];

    // Check HTTPS
    if (!systemInfo.security.httpsEnabled) {
      risks.push({
        level: 'critical',
        category: 'Connection',
        message: 'Connessione non sicura (HTTP invece di HTTPS)',
      });
      recommendations.push('Accedi sempre ai siti tramite HTTPS');
    }

    // Check mixed content
    if (systemInfo.security.mixedContent) {
      risks.push({
        level: 'high',
        category: 'Connection',
        message: 'Contenuti misti rilevati (HTTP su pagina HTTPS)',
      });
    }

    // Check cookies
    if (!systemInfo.browser.cookieEnabled) {
      risks.push({
        level: 'medium',
        category: 'Browser',
        message: 'I cookie sono disabilitati',
      });
    }

    // Check localStorage
    if (!systemInfo.features.localStorage) {
      risks.push({
        level: 'low',
        category: 'Browser',
        message: 'LocalStorage non disponibile o disabilitato',
      });
    }

    // Check Do Not Track
    if (systemInfo.browser.doNotTrack !== '1') {
      recommendations.push('Abilita "Do Not Track" per maggiore privacy');
    }

    // Check WebRTC (leak di IP)
    if (systemInfo.features.webRTC) {
      risks.push({
        level: 'medium',
        category: 'Privacy',
        message: 'WebRTC abilitato (possibile leak IP con VPN)',
      });
      recommendations.push('Disabilita WebRTC se usi VPN per evitare leak IP');
    }

    // Check outdated browser (basic check)
    const ua = systemInfo.browser.userAgent.toLowerCase();
    if (ua.includes('msie') || ua.includes('trident')) {
      risks.push({
        level: 'critical',
        category: 'Browser',
        message: 'Browser obsoleto rilevato (Internet Explorer)',
      });
      recommendations.push('Aggiorna a un browser moderno (Chrome, Firefox, Edge)');
    }

    // Calcola score (100 - somma rischi)
    const riskPoints = risks.reduce((sum, risk) => {
      switch (risk.level) {
        case 'critical': return sum + 25;
        case 'high': return sum + 15;
        case 'medium': return sum + 10;
        case 'low': return sum + 5;
        default: return sum;
      }
    }, 0);

    const score = Math.max(0, 100 - riskPoints);

    return {
      risks,
      score,
      recommendations,
    };
  }

  /**
   * Test se una feature è disponibile
   */
  private testFeature(fn: () => boolean): boolean {
    try {
      return fn();
    } catch {
      return false;
    }
  }

  /**
   * Test WebGL support
   */
  private testWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  }
}

export const clientInfoService = new ClientInfoService();
