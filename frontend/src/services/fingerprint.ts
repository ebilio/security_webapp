import FingerprintJS from '@fingerprintjs/fingerprintjs';
import type { BrowserFingerprint } from '../types';

export async function getBrowserFingerprint(): Promise<BrowserFingerprint> {
  const fp = await FingerprintJS.load();
  const result = await fp.get();

  // Parse user agent
  const ua = navigator.userAgent;
  const browser = parseBrowser(ua);
  const os = parseOS(ua);

  // Canvas fingerprint
  const canvas = await getCanvasFingerprint();

  // WebGL fingerprint
  const webgl = getWebGLFingerprint();

  // Fonts detection
  const fonts = detectFonts();

  // Privacy score calculation
  const privacyScore = calculatePrivacyScore();

  return {
    userAgent: ua,
    browser,
    os,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    plugins: getPlugins(),
    canvas,
    webgl,
    fonts,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack === '1' || (navigator as any).doNotTrack === 'yes',
    privacyScore
  };
}

function parseBrowser(ua: string): BrowserFingerprint['browser'] {
  let name = 'Unknown';
  let version = 'Unknown';
  let isUpdated = false;

  if (ua.includes('Firefox/')) {
    name = 'Firefox';
    version = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
    isUpdated = parseInt(version) >= 121;
  } else if (ua.includes('Edg/')) {
    name = 'Edge';
    version = ua.match(/Edg\/(\d+)/)?.[1] || 'Unknown';
    isUpdated = parseInt(version) >= 120;
  } else if (ua.includes('Chrome/')) {
    name = 'Chrome';
    version = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
    isUpdated = parseInt(version) >= 120;
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    name = 'Safari';
    version = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown';
    isUpdated = parseInt(version) >= 17;
  }

  return { name, version, isUpdated };
}

function parseOS(ua: string): BrowserFingerprint['os'] {
  let name = 'Unknown';
  let version = 'Unknown';

  if (ua.includes('Windows NT')) {
    name = 'Windows';
    const versionMap: Record<string, string> = {
      '10.0': '10/11',
      '6.3': '8.1',
      '6.2': '8',
      '6.1': '7'
    };
    const ntVersion = ua.match(/Windows NT (\d+\.\d+)/)?.[1];
    version = ntVersion ? versionMap[ntVersion] || ntVersion : 'Unknown';
  } else if (ua.includes('Mac OS X')) {
    name = 'macOS';
    version = ua.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace('_', '.') || 'Unknown';
  } else if (ua.includes('Linux')) {
    name = 'Linux';
    version = ua.match(/Linux (\d+\.\d+)/)?.[1] || 'Unknown';
  } else if (ua.includes('Android')) {
    name = 'Android';
    version = ua.match(/Android (\d+\.\d+)/)?.[1] || 'Unknown';
  } else if (ua.includes('iOS')) {
    name = 'iOS';
    version = ua.match(/OS (\d+_\d+)/)?.[1]?.replace('_', '.') || 'Unknown';
  }

  return { name, version };
}

async function getCanvasFingerprint(): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return 'Not supported';

  canvas.width = 200;
  canvas.height = 50;

  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillStyle = '#f60';
  ctx.fillRect(0, 0, 200, 50);
  ctx.fillStyle = '#069';
  ctx.fillText('Canvas Fingerprint', 10, 10);

  return canvas.toDataURL().substring(0, 50);
}

function getWebGLFingerprint(): string {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) return 'Not supported';

  const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
  if (!debugInfo) return 'Available';

  const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  return renderer.substring(0, 50);
}

function detectFonts(): string[] {
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testFonts = [
    'Arial', 'Verdana', 'Times New Roman', 'Courier New',
    'Georgia', 'Palatino', 'Garamond', 'Bookman',
    'Comic Sans MS', 'Trebuchet MS', 'Impact'
  ];

  const detectedFonts: string[] = [];

  testFonts.forEach(font => {
    if (isFontAvailable(font, baseFonts)) {
      detectedFonts.push(font);
    }
  });

  return detectedFonts;
}

function isFontAvailable(font: string, baseFonts: string[]): boolean {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;

  const text = 'mmmmmmmmmmlli';
  const baseWidths: Record<string, number> = {};

  baseFonts.forEach(baseFont => {
    ctx.font = `72px ${baseFont}`;
    baseWidths[baseFont] = ctx.measureText(text).width;
  });

  return baseFonts.some(baseFont => {
    ctx.font = `72px ${font}, ${baseFont}`;
    return ctx.measureText(text).width !== baseWidths[baseFont];
  });
}

function getPlugins(): string[] {
  const plugins: string[] = [];

  if (navigator.plugins && navigator.plugins.length > 0) {
    for (let i = 0; i < navigator.plugins.length; i++) {
      plugins.push(navigator.plugins[i].name);
    }
  }

  return plugins;
}

function calculatePrivacyScore(): number {
  let score = 30; // Reduced base score to accommodate more checks

  // Do Not Track (+10 points)
  if (navigator.doNotTrack === '1' || (navigator as any).doNotTrack === 'yes') {
    score += 10;
  }

  // Cookies disabled (+8 points)
  if (!navigator.cookieEnabled) {
    score += 8;
  }

  // Pochi plugins (meno tracciamento) (+8 points)
  if (navigator.plugins.length < 5) {
    score += 8;
  }

  // WebGL disabled (più privacy) (+10 points)
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    score += 10;
  }

  // Privacy-focused browser detection (+12 points)
  const ua = navigator.userAgent;
  if (ua.includes('Brave')) {
    score += 12;
  } else if (ua.includes('Firefox') && (navigator as any).globalPrivacyControl) {
    score += 10; // Firefox with enhanced privacy
  }

  // Third-party cookies blocked (+8 points)
  // Check if third-party cookies are restricted via document.cookie in iframe context
  try {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.sandbox.add('allow-same-origin');
    document.body.appendChild(iframe);
    const iframeDoc = iframe.contentDocument;
    if (iframeDoc) {
      try {
        iframeDoc.cookie = 'test=1';
        if (!iframeDoc.cookie) {
          score += 8; // Third-party cookies blocked
        }
      } catch {
        score += 8; // Exception indicates blocking
      }
    }
    document.body.removeChild(iframe);
  } catch {
    // If we can't test, assume some protection
    score += 4;
  }

  // Canvas fingerprinting protection (+8 points)
  // Test if canvas returns randomized or blocked data
  const canvas1 = document.createElement('canvas');
  const canvas2 = document.createElement('canvas');
  const ctx1 = canvas1.getContext('2d');
  const ctx2 = canvas2.getContext('2d');

  if (ctx1 && ctx2) {
    canvas1.width = canvas2.width = 100;
    canvas1.height = canvas2.height = 100;

    ctx1.fillStyle = '#FF0000';
    ctx1.fillRect(0, 0, 100, 100);
    ctx2.fillStyle = '#FF0000';
    ctx2.fillRect(0, 0, 100, 100);

    const data1 = canvas1.toDataURL();
    const data2 = canvas2.toDataURL();

    // If canvas data is randomized, they should differ
    if (data1 !== data2) {
      score += 8;
    }
  }

  // Hardware concurrency masking (+6 points)
  // Privacy browsers may limit or mask CPU core count
  const cores = navigator.hardwareConcurrency;
  if (cores === undefined || cores <= 2) {
    score += 6;
  }

  // LocalStorage restrictions (+6 points)
  try {
    localStorage.setItem('privacy_test', 'test');
    localStorage.removeItem('privacy_test');
  } catch {
    score += 6; // LocalStorage blocked
  }

  // Reduced fonts (privacy protection) (+6 points)
  const detectedFonts = detectFonts();
  if (detectedFonts.length < 5) {
    score += 6;
  }

  // Global Privacy Control (+8 points)
  if ((navigator as any).globalPrivacyControl === true) {
    score += 8;
  }

  // Battery API disabled (+4 points)
  if (!(navigator as any).getBattery) {
    score += 4;
  }

  return Math.min(100, score);
}
