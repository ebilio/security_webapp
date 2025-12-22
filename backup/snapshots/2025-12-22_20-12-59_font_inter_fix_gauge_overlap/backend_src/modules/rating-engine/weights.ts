// Pesi delle categorie (totale deve essere 1.0)
export const CATEGORY_WEIGHTS = {
  browserSecurity: 0.25,    // 25%
  systemSecurity: 0.30,     // 30%
  networkSecurity: 0.25,    // 25%
  softwareSecurity: 0.20    // 20%
};

// Punteggi massimi per categoria (totale 100)
export const MAX_SCORES = {
  browserSecurity: 25,
  systemSecurity: 30,
  networkSecurity: 25,
  softwareSecurity: 20
};

// Punteggi specifici per checks browser
export const BROWSER_CHECKS = {
  modernBrowser: 10,
  privacyExtensions: 5,
  secureSettings: 5,
  httpsEverywhere: 5
};

// Punteggi specifici per checks sistema
export const SYSTEM_CHECKS = {
  antivirusActive: 10,
  antivirusUpdated: 5,
  firewallActive: 8,
  osUpdated: 3,
  windowsUpdateCheck: 2,
  uacEnabled: 1,
  diskEncryption: 1
};

// Punteggi specifici per checks rete
export const NETWORK_CHECKS = {
  strongPassword: 10,
  encryption: 10,
  closedPorts: 5
};

// Punteggi specifici per checks software
export const SOFTWARE_CHECKS = {
  updatedSoftware: 15,
  disabledServices: 5
};

// Penalità
export const PENALTIES = {
  criticalCVE: -10,
  exposedSensitivePorts: -15,
  noAntivirus: -20,
  obsoleteBrowser: -10,
  weakEncryption: -10,
  noFirewall: -15
};

// Versioni browser considerate "moderne" (aggiornate negli ultimi 6 mesi)
export const BROWSER_VERSIONS = {
  chrome: 120,
  firefox: 121,
  edge: 120,
  safari: 17,
  opera: 105
};

// Porte sensibili che non dovrebbero essere esposte
export const SENSITIVE_PORTS = [
  445,  // SMB
  139,  // NetBIOS
  3389, // RDP
  22,   // SSH (se esposto su WAN)
  23,   // Telnet
  21,   // FTP
  3306, // MySQL
  5432, // PostgreSQL
  27017 // MongoDB
];
