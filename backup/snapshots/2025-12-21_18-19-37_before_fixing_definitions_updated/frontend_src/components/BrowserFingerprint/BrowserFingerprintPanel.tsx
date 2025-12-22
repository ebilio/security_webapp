import { Globe, Eye, Lock } from 'lucide-react';
import type { BrowserFingerprint } from '../../types';

interface BrowserFingerprintPanelProps {
  fingerprint: BrowserFingerprint;
}

export function BrowserFingerprintPanel({ fingerprint }: BrowserFingerprintPanelProps) {
  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Globe className="w-6 h-6 text-primary-600" />
        Browser Fingerprint
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Browser Info */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Informazioni Browser
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Browser</p>
              <p className="text-sm font-medium text-gray-800">
                {fingerprint.browser.name} {fingerprint.browser.version}
              </p>
              <span className={`badge mt-1 ${fingerprint.browser.isUpdated ? 'badge-success' : 'badge-warning'}`}>
                {fingerprint.browser.isUpdated ? 'Aggiornato' : 'Obsoleto'}
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-500">Sistema Operativo</p>
              <p className="text-sm font-medium text-gray-800">
                {fingerprint.os.name} {fingerprint.os.version}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Lingua</p>
              <p className="text-sm font-medium text-gray-800">{fingerprint.language}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Timezone</p>
              <p className="text-sm font-medium text-gray-800">{fingerprint.timezone}</p>
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Privacy & Sicurezza
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Privacy Score</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary-600 h-3 rounded-full transition-all"
                    style={{ width: `${fingerprint.privacyScore}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-800">
                  {fingerprint.privacyScore}/100
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Do Not Track</span>
              <span className={`badge ${fingerprint.doNotTrack ? 'badge-success' : 'badge-warning'}`}>
                {fingerprint.doNotTrack ? 'Attivo' : 'Non attivo'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Cookie Abilitati</span>
              <span className={`badge ${fingerprint.cookieEnabled ? 'badge-info' : 'badge-success'}`}>
                {fingerprint.cookieEnabled ? 'Sì' : 'No'}
              </span>
            </div>

            <div>
              <p className="text-xs text-gray-500">Plugins Rilevati</p>
              <p className="text-sm font-medium text-gray-800">
                {fingerprint.plugins.length} plugins
              </p>
            </div>
          </div>
        </div>

        {/* Screen Info */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Schermo</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Risoluzione</p>
              <p className="text-sm font-medium text-gray-800">
                {fingerprint.screen.width} x {fingerprint.screen.height}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Profondità Colore</p>
              <p className="text-sm font-medium text-gray-800">
                {fingerprint.screen.colorDepth} bit
              </p>
            </div>
          </div>
        </div>

        {/* Fingerprints */}
        <div>
          <h3 className="text-sm font-semibold text-gray-600 uppercase mb-3">Fingerprints</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500">Canvas Fingerprint</p>
              <p className="text-xs font-mono text-gray-700 break-all">
                {fingerprint.canvas}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">WebGL Renderer</p>
              <p className="text-xs font-mono text-gray-700 break-all">
                {fingerprint.webgl}
              </p>
            </div>

            {fingerprint.fonts.length > 0 && (
              <div>
                <p className="text-xs text-gray-500">Font Rilevati</p>
                <p className="text-xs text-gray-700">
                  {fingerprint.fonts.slice(0, 5).join(', ')}
                  {fingerprint.fonts.length > 5 && ` +${fingerprint.fonts.length - 5}`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
