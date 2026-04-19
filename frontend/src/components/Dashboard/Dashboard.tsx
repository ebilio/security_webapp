import { Shield, Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useScan } from '../../hooks/useScan';
import { RatingGauge } from '../RatingDisplay/RatingGauge';
import { BrowserFingerprintPanel } from '../BrowserFingerprint/BrowserFingerprintPanel';

export function Dashboard() {
  const { isScanning, scanProgress, scanData, scanError, startScan, clearError } = useScan();

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
                <p className="text-sm text-cyber-gray-400">Valuta la sicurezza del tuo browser e connessione</p>
              </div>
            </div>
            <button
              onClick={startScan}
              disabled={isScanning}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Activity className={`w-5 h-5 ${isScanning ? 'animate-spin text-cyber-green-500' : ''}`} />
              {isScanning ? 'Scansione in corso...' : 'Avvia Scansione'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Banner errore inline — sostituisce alert() */}
        {scanError && (
          <div className="flex items-start gap-3 p-4 mb-6 rounded-lg border border-red-500/40 bg-red-500/10">
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-300">Errore durante la scansione</p>
              <p className="text-xs text-red-400/80 mt-1">{scanError}</p>
            </div>
            <button onClick={clearError} className="text-red-400 hover:text-red-200 text-lg leading-none" aria-label="Chiudi errore">×</button>
          </div>
        )}

        {/* Scan Progress */}
        {isScanning && scanProgress && (
          <div className="card mb-8 scanning">
            <div className="flex items-center gap-4">
              <Activity className="w-6 h-6 text-cyber-green-500 animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium text-cyber-gray-100">{scanProgress.message}</p>
                <div className="progress-bar mt-2">
                  <div className="progress-bar-fill" style={{ width: `${scanProgress.progress}%` }} />
                </div>
              </div>
              <span className="text-2xl font-bold text-cyber-green-500 neon-text">{scanProgress.progress}%</span>
            </div>
          </div>
        )}

        {/* Risultati scansione */}
        {scanData && (
          <>
            {/* Rating + categorie */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="card col-span-1">
                <h2 className="text-lg font-semibold text-cyber-green-500 mb-4">Rating Complessivo</h2>
                <RatingGauge score={scanData.rating.overall} />
              </div>
              <div className="card col-span-1 lg:col-span-2">
                <h2 className="text-lg font-semibold text-cyber-green-500 mb-4">Dettaglio Categorie</h2>
                <div className="space-y-4">
                  {scanData.rating.categories.map((category, i) => (
                    <div key={i} className="border-l-2 border-cyber-green-500 pl-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-cyber-gray-100 font-medium">{category.name}</span>
                        <span className="text-cyber-green-500 font-bold">{category.score}%</span>
                      </div>
                      <div className="text-xs text-cyber-gray-400 space-y-1">
                        {category.details.slice(0, 3).map((detail, j) => (
                          <div key={j}>{detail}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rete */}
            {scanData.networkInfo.publicIp && (
              <div className="card mb-8">
                <h3 className="text-lg font-semibold text-cyber-green-500 mb-4">Informazioni Rete</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-cyber-gray-400">IP Pubblico:</span>
                    <p className="text-cyber-gray-100 font-mono">{scanData.networkInfo.publicIp}</p>
                  </div>
                  {scanData.networkInfo.country && (
                    <div>
                      <span className="text-cyber-gray-400">Paese:</span>
                      <p className="text-cyber-gray-100">{scanData.networkInfo.country}</p>
                    </div>
                  )}
                  {scanData.networkInfo.city && (
                    <div>
                      <span className="text-cyber-gray-400">Città:</span>
                      <p className="text-cyber-gray-100">{scanData.networkInfo.city}</p>
                    </div>
                  )}
                  {scanData.networkInfo.isp && (
                    <div>
                      <span className="text-cyber-gray-400">ISP:</span>
                      <p className="text-cyber-gray-100">{scanData.networkInfo.isp}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Punti di forza e raccomandazioni */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

            {/* Rischi */}
            {scanData.securityAssessment.risks.length > 0 && (
              <div className="card mb-8">
                <h3 className="text-lg font-semibold text-cyber-orange-500 mb-4">Rischi Rilevati</h3>
                <div className="space-y-2">
                  {scanData.securityAssessment.risks.map((risk, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded border-l-4 ${
                        risk.level === 'critical' ? 'border-red-500 bg-red-500/10'
                        : risk.level === 'high'   ? 'border-orange-500 bg-orange-500/10'
                        : risk.level === 'medium' ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-blue-500 bg-blue-500/10'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs text-cyber-gray-400 uppercase">{risk.category}</span>
                          <p className="text-sm text-cyber-gray-100">{risk.message}</p>
                        </div>
                        <span className="text-xs font-bold uppercase">{risk.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Browser Fingerprint */}
            <BrowserFingerprintPanel fingerprint={scanData.browserFingerprint} />
          </>
        )}

        {/* Empty state */}
        {!scanData && !isScanning && !scanError && (
          <div className="card text-center py-12">
            <Shield className="w-16 h-16 text-cyber-green-500/50 mx-auto mb-4 animate-pulse-slow" />
            <h3 className="text-xl font-semibold text-cyber-green-500 mb-2">Pronto per iniziare</h3>
            <p className="text-cyber-gray-400 mb-6">
              Clicca su "Avvia Scansione" per valutare la sicurezza del tuo browser
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
