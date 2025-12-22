import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { SecurityAssessment } from '../../types';

interface SecurityAssessmentPanelProps {
  assessment: SecurityAssessment;
}

export function SecurityAssessmentPanel({ assessment }: SecurityAssessmentPanelProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'badge-danger';
      case 'high':
        return 'badge-warning';
      case 'medium':
        return 'badge-warning';
      case 'low':
        return 'badge-info';
      default:
        return 'badge-info';
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-cyber-green-500 mb-6 flex items-center gap-2">
        <Shield className="w-6 h-6 text-cyber-green-500" />
        Valutazione Sicurezza
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Antivirus Status */}
        <div className="p-4 bg-cyber-bg-tertiary/50 rounded-lg border border-cyber-green-500/10 hover:border-cyber-green-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-cyber-gray-100">Antivirus</h3>
            {assessment.antivirus.installed && assessment.antivirus.enabled ? (
              <CheckCircle className="w-5 h-5 text-cyber-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-cyber-orange-500" />
            )}
          </div>

          {assessment.antivirus.installed ? (
            <>
              <p className="text-sm font-medium text-cyber-gray-100 mb-1">
                {assessment.antivirus.name}
              </p>
              <div className="flex items-center gap-2">
                <span className={`badge ${assessment.antivirus.enabled ? 'badge-success' : 'badge-danger'}`}>
                  {assessment.antivirus.enabled ? 'Attivo' : 'Disabilitato'}
                </span>
                {assessment.antivirus.updated && (
                  <span className="badge badge-success">Aggiornato</span>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-cyber-orange-500 font-medium">Nessun antivirus rilevato</p>
          )}
        </div>

        {/* Firewall Status */}
        <div className="p-4 bg-cyber-bg-tertiary/50 rounded-lg border border-cyber-green-500/10 hover:border-cyber-green-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-cyber-gray-100">Firewall</h3>
            {assessment.firewall.enabled ? (
              <CheckCircle className="w-5 h-5 text-cyber-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-cyber-orange-500" />
            )}
          </div>

          {assessment.firewall.enabled ? (
            <>
              <p className="text-sm font-medium text-cyber-gray-100 mb-1">
                {assessment.firewall.name || 'Firewall Attivo'}
              </p>
              <span className="badge badge-success">Attivo</span>
              {assessment.firewall.rules && (
                <p className="text-xs text-cyber-gray-300 mt-1">
                  {assessment.firewall.rules} regole configurate
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-cyber-orange-500 font-medium">Firewall disabilitato</p>
          )}
        </div>
      </div>

      {/* Vulnerabilities */}
      {assessment.vulnerabilities.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-cyber-orange-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-cyber-orange-500" />
            Vulnerabilità Rilevate ({assessment.vulnerabilities.length})
          </h3>

          <div className="space-y-3">
            {assessment.vulnerabilities.slice(0, 5).map((vuln, i) => (
              <div key={i} className="p-3 border border-cyber-green-500/20 rounded-lg bg-cyber-bg-tertiary/30 hover:border-cyber-green-500/40 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge ${getSeverityColor(vuln.severity)}`}>
                        {vuln.severity.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-cyber-gray-100">
                        {vuln.software} {vuln.version}
                      </span>
                    </div>
                    <p className="text-sm text-cyber-gray-300 mb-2">{vuln.description}</p>
                    {vuln.cveId && (
                      <p className="text-xs text-cyber-gray-400 font-mono mb-1">CVE: {vuln.cveId}</p>
                    )}
                    <p className="text-xs text-cyber-green-500">
                      💡 {vuln.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {assessment.vulnerabilities.length > 5 && (
              <p className="text-sm text-cyber-gray-500 text-center">
                + {assessment.vulnerabilities.length - 5} altre vulnerabilità
              </p>
            )}
          </div>
        </div>
      )}

      {/* Open Ports */}
      {assessment.openPorts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-cyber-orange-500 uppercase tracking-wider mb-3">
            Porte Aperte ({assessment.openPorts.length})
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {assessment.openPorts.slice(0, 8).map((port, i) => (
              <div key={i} className="p-2 bg-cyber-bg-tertiary/50 rounded text-center border border-cyber-green-500/10 hover:border-cyber-green-500/30 transition-all">
                <p className="text-sm font-medium font-mono text-cyber-green-500">{port.port}</p>
                <p className="text-xs text-cyber-gray-300">{port.protocol}</p>
                {port.service && (
                  <p className="text-xs text-cyber-gray-400">{port.service}</p>
                )}
              </div>
            ))}
          </div>

          {assessment.openPorts.length > 8 && (
            <p className="text-sm text-cyber-gray-500 text-center mt-2">
              + {assessment.openPorts.length - 8} altre porte
            </p>
          )}
        </div>
      )}

      {/* Security Score */}
      <div className="mt-6 p-4 bg-cyber-bg-secondary rounded-lg border border-cyber-green-500/20">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-cyber-gray-100 uppercase tracking-wider">Security Score</span>
          <span className="text-2xl font-bold text-cyber-green-500 neon-text">
            {assessment.securityScore}/100
          </span>
        </div>
      </div>
    </div>
  );
}
