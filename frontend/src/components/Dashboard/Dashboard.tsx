import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import { getBrowserFingerprint } from '../../services/fingerprint';
import { wsService } from '../../services/websocket';
import { RatingGauge } from '../RatingDisplay/RatingGauge';
import { CategoryBreakdown } from '../RatingDisplay/CategoryBreakdown';
import { SystemInfoPanel } from '../SystemInfo/SystemInfoPanel';
import { SecurityAssessmentPanel } from '../SecurityAssessment/SecurityAssessmentPanel';
import { BrowserFingerprintPanel } from '../BrowserFingerprint/BrowserFingerprintPanel';
import type { ScanProgress } from '../../types';

export function Dashboard() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress | null>(null);
  const [browserFingerprint, setBrowserFingerprint] = useState<any>(null);

  // Query per dati completi
  const { data: scanData, refetch: refetchScan, isLoading } = useQuery({
    queryKey: ['completeScan'],
    queryFn: async () => {
      const fp = await getBrowserFingerprint();
      setBrowserFingerprint(fp);

      const data = await apiService.getCompleteScan();

      // Ricalcola rating con fingerprint browser
      const rating = await apiService.calculateRating(fp);

      return { ...data, rating };
    },
    enabled: false
  });

  const handleScan = async () => {
    setIsScanning(true);
    setScanProgress({ stage: 'init', progress: 0, message: 'Avvio scansione...' });

    // Connetti WebSocket
    wsService.connect();

    wsService.onProgress((progress) => {
      setScanProgress(progress);
    });

    wsService.onComplete(async () => {
      await refetchScan();
      setIsScanning(false);
      setScanProgress(null);
      wsService.disconnect();
    });

    wsService.onError((error) => {
      console.error('Scan error:', error);
      setIsScanning(false);
      setScanProgress(null);
      wsService.disconnect();
    });

    wsService.startScan();
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-cyber-bg-secondary shadow-cyber border-b border-cyber-green-500/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-cyber-green-500" />
              <div>
                <h1 className="text-2xl font-bold text-cyber-green-500 neon-text tracking-wide">Security Assessment</h1>
                <p className="text-sm text-cyber-gray-400">Valuta la sicurezza del tuo dispositivo e rete</p>
              </div>
            </div>
            <button
              onClick={handleScan}
              disabled={isScanning || isLoading}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Activity className={`w-5 h-5 ${isScanning ? 'animate-spin text-cyber-green-500' : ''}`} />
              {isScanning ? 'Scansione in corso...' : 'Avvia Scansione'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Scan Progress */}
        {isScanning && scanProgress && (
          <div className="card mb-8 scanning">
            <div className="flex items-center gap-4">
              <Activity className="w-6 h-6 text-cyber-green-500 animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium text-cyber-gray-100">{scanProgress.message}</p>
                <div className="progress-bar mt-2">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${scanProgress.progress}%` }}
                  />
                </div>
              </div>
              <span className="text-2xl font-bold text-cyber-green-500 neon-text">{scanProgress.progress}%</span>
            </div>
          </div>
        )}

        {/* Rating Overview */}
        {scanData && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Main Rating */}
              <div className="card col-span-1">
                <h2 className="text-lg font-semibold text-cyber-green-500 mb-4">Rating Complessivo</h2>
                <RatingGauge score={scanData.rating.overall} />
              </div>

              {/* Category Breakdown */}
              <div className="card col-span-1 lg:col-span-2">
                <h2 className="text-lg font-semibold text-cyber-green-500 mb-4">Dettaglio Categorie</h2>
                <CategoryBreakdown categories={scanData.rating.categories} />
              </div>
            </div>

            {/* Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Strengths */}
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-cyber-green-500" />
                  <h3 className="text-lg font-semibold text-cyber-green-500">Punti di Forza</h3>
                </div>
                {scanData.rating.strengths.length > 0 ? (
                  <ul className="space-y-2">
                    {scanData.rating.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyber-green-500 mt-1">✓</span>
                        <span className="text-sm text-cyber-gray-200">{strength}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-cyber-gray-400">Nessun punto di forza rilevato</p>
                )}
              </div>

              {/* Weaknesses & Recommendations */}
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-cyber-orange-500" />
                  <h3 className="text-lg font-semibold text-cyber-orange-500">Raccomandazioni</h3>
                </div>
                {scanData.rating.recommendations.length > 0 ? (
                  <ul className="space-y-2">
                    {scanData.rating.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-cyber-orange-500 mt-1">⚠</span>
                        <span className="text-sm text-cyber-gray-200">{rec}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-cyber-gray-400">Nessuna raccomandazione</p>
                )}
              </div>
            </div>

            {/* Detailed Panels */}
            <div className="space-y-6">
              <SystemInfoPanel systemInfo={scanData.systemInfo} />
              <SecurityAssessmentPanel assessment={scanData.securityAssessment} />
              {browserFingerprint && <BrowserFingerprintPanel fingerprint={browserFingerprint} />}
            </div>
          </>
        )}

        {/* Empty State */}
        {!scanData && !isScanning && !isLoading && (
          <div className="card text-center py-12">
            <Shield className="w-16 h-16 text-cyber-green-500/50 mx-auto mb-4 animate-pulse-slow" />
            <h3 className="text-xl font-semibold text-cyber-green-500 mb-2">
              Pronto per iniziare
            </h3>
            <p className="text-cyber-gray-400 mb-6">
              Clicca su "Avvia Scansione" per valutare la sicurezza del tuo sistema
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
