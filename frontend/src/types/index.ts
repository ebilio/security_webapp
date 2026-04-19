// Tipi condivisi tra i componenti client-side

export interface BrowserFingerprint {
  userAgent: string;
  browser: {
    name: string;
    version: string;
    isUpdated: boolean;
  };
  os: {
    name: string;
    version: string;
  };
  screen: {
    width: number;
    height: number;
    colorDepth: number;
  };
  timezone: string;
  language: string;
  plugins: string[];
  canvas: string;
  webgl: string;
  fonts: string[];
  cookieEnabled: boolean;
  doNotTrack: boolean;
  privacyScore: number;
}

// Tipi legacy backend — mantenuti per compatibilità futura
// se si reintroduce un server Node.js
export interface RatingResult {
  overall: number;
  categories: {
    browserSecurity: CategoryScore;
    systemSecurity: CategoryScore;
    networkSecurity: CategoryScore;
    softwareSecurity: CategoryScore;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface CategoryScore {
  score: number;
  maxScore: number;
  details: Array<{
    name: string;
    points: number;
    maxPoints: number;
    status: 'pass' | 'fail' | 'warning';
    message: string;
  }>;
}

export interface ScanProgress {
  stage: string;
  progress: number;
  message: string;
}
