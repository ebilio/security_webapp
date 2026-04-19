/**
 * useScan — custom hook che orchestra i 5 step di scansione.
 *
 * Estratto da Dashboard.tsx per rispettare SRP:
 * il componente si occupa solo del rendering,
 * questo hook gestisce stato, sequenza e gestione errori.
 */

import { useState, useCallback } from 'react';
import { getBrowserFingerprint }  from '../services/fingerprint';
import { clientInfoService }      from '../services/clientInfo';
import { clientRatingEngine }     from '../services/ratingEngine';
import type { BrowserFingerprint } from '../types';
import type {
  ClientSystemInfo,
  ClientNetworkInfo,
  ClientSecurityAssessment,
} from '../services/clientInfo';
import type { RatingResult } from '../services/ratingEngine';

export interface ScanProgress {
  stage: string;
  progress: number;
  message: string;
}

export interface ScanData {
  systemInfo:         ClientSystemInfo;
  networkInfo:        ClientNetworkInfo;
  securityAssessment: ClientSecurityAssessment;
  browserFingerprint: BrowserFingerprint;
  rating:             RatingResult;
}

export interface UseScanReturn {
  isScanning:   boolean;
  scanProgress: ScanProgress | null;
  scanData:     ScanData | null;
  scanError:    string | null;
  startScan:    () => Promise<void>;
  clearError:   () => void;
}

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export function useScan(): UseScanReturn {
  const [isScanning,   setIsScanning]   = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress | null>(null);
  const [scanData,     setScanData]     = useState<ScanData | null>(null);
  const [scanError,    setScanError]    = useState<string | null>(null);

  const startScan = useCallback(async () => {
    try {
      setIsScanning(true);
      setScanData(null);
      setScanError(null);

      // Step 1 — Browser fingerprint
      setScanProgress({ stage: 'fingerprint', progress: 20, message: 'Analisi fingerprint browser...' });
      await sleep(500);
      const browserFingerprint = await getBrowserFingerprint();

      // Step 2 — System info
      setScanProgress({ stage: 'system-info', progress: 40, message: 'Raccolta informazioni sistema...' });
      await sleep(500);
      const systemInfo = await clientInfoService.getSystemInfo();

      // Step 3 — Network info
      setScanProgress({ stage: 'network-info', progress: 60, message: 'Rilevamento rete e IP pubblico...' });
      await sleep(500);
      const networkInfo = await clientInfoService.getNetworkInfo();

      // Step 4 — Security assessment
      setScanProgress({ stage: 'security-assessment', progress: 80, message: 'Valutazione sicurezza...' });
      await sleep(500);
      const securityAssessment = await clientInfoService.performSecurityAssessment(systemInfo);

      // Step 5 — Rating
      setScanProgress({ stage: 'rating', progress: 95, message: 'Calcolo rating...' });
      await sleep(500);
      const rating = clientRatingEngine.calculateRating(
        systemInfo,
        networkInfo,
        securityAssessment,
        browserFingerprint,
      );

      setScanProgress({ stage: 'complete', progress: 100, message: 'Scansione completata!' });
      await sleep(300);

      setScanData({ systemInfo, networkInfo, securityAssessment, browserFingerprint, rating });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Errore sconosciuto durante la scansione.';
      setScanError(message);
    } finally {
      setIsScanning(false);
      setScanProgress(null);
    }
  }, []);

  const clearError = useCallback(() => setScanError(null), []);

  return { isScanning, scanProgress, scanData, scanError, startScan, clearError };
}
