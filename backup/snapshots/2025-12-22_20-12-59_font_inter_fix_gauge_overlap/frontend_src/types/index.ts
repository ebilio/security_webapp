// Shared types con backend (duplicati per semplicità)

export interface SystemInfo {
  hardware: HardwareInfo;
  software: SoftwareInfo;
  os: OSInfo;
  network: NetworkInfo;
}

export interface HardwareInfo {
  cpu: {
    manufacturer: string;
    brand: string;
    cores: number;
    physicalCores: number;
    speed: number;
  };
  memory: {
    total: number;
    free: number;
    used: number;
  };
  storage: Array<{
    device: string;
    size: number;
    used: number;
    available: number;
    mount: string;
  }>;
  graphics: Array<{
    vendor: string;
    model: string;
    vram: number;
  }>;
}

export interface SoftwareInfo {
  installedApps: Array<{
    name: string;
    version: string;
    publisher: string;
  }>;
  processes: number;
}

export interface OSInfo {
  platform: string;
  distro: string;
  release: string;
  kernel: string;
  arch: string;
  hostname: string;
  uptime: number;
}

export interface NetworkInfo {
  interfaces: Array<{
    iface: string;
    ip4: string;
    ip6: string;
    mac: string;
    type: string;
  }>;
  publicIp: string;
  defaultGateway: string;
}

export interface SecurityAssessment {
  antivirus: {
    installed: boolean;
    name?: string;
    enabled: boolean;
    updated: boolean;
  };
  firewall: {
    enabled: boolean;
    name?: string;
    rules?: number;
  };
  vulnerabilities: Array<{
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    software: string;
    version: string;
    description: string;
    cveId?: string;
    recommendation: string;
  }>;
  openPorts: Array<{
    port: number;
    protocol: string;
    service?: string;
    state: string;
  }>;
  securityScore: number;
}

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

export interface ScanProgress {
  stage: string;
  progress: number;
  message: string;
}
