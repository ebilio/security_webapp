// System Information Types
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

// Security Assessment Types
export interface SecurityAssessment {
  antivirus: AntivirusStatus;
  firewall: FirewallStatus;
  vulnerabilities: Vulnerability[];
  openPorts: OpenPort[];
  securityScore: number;
  windowsUpdate?: WindowsUpdateStatus;
  uac?: UACStatus;
  diskEncryption?: DiskEncryptionStatus;
}

export interface AntivirusStatus {
  installed: boolean;
  name?: string;
  enabled: boolean;
  updated: boolean;
}

export interface FirewallStatus {
  enabled: boolean;
  name?: string;
  rules?: number;
}

export interface WindowsUpdateStatus {
  enabled: boolean;
  pendingUpdates: number;
  lastCheck?: string;
}

export interface UACStatus {
  enabled: boolean;
  level?: string;
}

export interface DiskEncryptionStatus {
  enabled: boolean;
  type?: string; // BitLocker, FileVault, LUKS
  volumes?: number;
}

export interface Vulnerability {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  software: string;
  version: string;
  description: string;
  cveId?: string;
  recommendation: string;
}

export interface OpenPort {
  port: number;
  protocol: string;
  service?: string;
  state: string;
}

// Network Scan Types
export interface NetworkDevice {
  ip: string;
  mac: string;
  hostname?: string;
  vendor?: string;
  openPorts: number[];
  os?: string;
}

export interface NetworkScanResult {
  devices: NetworkDevice[];
  subnet: string;
  gateway: string;
  scanDuration: number;
}

// Rating Types
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
  details: ScoreDetail[];
}

export interface ScoreDetail {
  name: string;
  points: number;
  maxPoints: number;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

// Browser Fingerprint Types (shared con frontend)
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

// WebSocket Event Types
export interface ScanProgress {
  stage: string;
  progress: number;
  message: string;
}

export interface ScanComplete {
  systemInfo: SystemInfo;
  securityAssessment: SecurityAssessment;
  rating: RatingResult;
}
