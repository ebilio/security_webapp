import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { RatingResult } from '../../types';

interface CategoryBreakdownProps {
  categories: RatingResult['categories'];
}

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const categoryNames = {
    browserSecurity: 'Sicurezza Browser',
    systemSecurity: 'Sicurezza Sistema',
    networkSecurity: 'Sicurezza Rete',
    softwareSecurity: 'Sicurezza Software'
  };

  const toggleCategory = (key: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedCategories(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-cyber-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-cyber-orange-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-cyber-orange-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-cyber-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-cyber-green-500/10 text-cyber-green-500 border border-cyber-green-500/30';
      case 'fail':
        return 'bg-cyber-orange-500/10 text-cyber-orange-500 border border-cyber-orange-500/30';
      case 'warning':
        return 'bg-cyber-orange-500/10 text-cyber-orange-500 border border-cyber-orange-500/30';
      default:
        return 'bg-cyber-gray-800/50 text-cyber-gray-400 border border-cyber-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(categories).map(([key, category]) => {
        const percentage = (category.score / category.maxScore) * 100;
        const color = percentage >= 70
          ? 'bg-gradient-to-r from-cyber-green-500 to-cyber-green-400 shadow-neon-green'
          : percentage >= 40
            ? 'bg-gradient-to-r from-cyber-orange-500 to-cyber-orange-400 shadow-neon-orange'
            : 'bg-gradient-to-r from-danger-500 to-danger-400';
        const isExpanded = expandedCategories.has(key);

        return (
          <div key={key} className="border border-cyber-green-500/20 rounded-lg overflow-hidden hover:border-cyber-green-500/40 transition-all">
            {/* Category Header */}
            <div
              className="p-4 bg-cyber-bg-tertiary/50 cursor-pointer hover:bg-cyber-bg-tertiary transition-colors"
              onClick={() => toggleCategory(key)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-cyber-green-500">
                    {categoryNames[key as keyof typeof categoryNames]}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-cyber-green-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-cyber-green-500" />
                  )}
                </div>
                <span className="text-sm font-medium text-cyber-gray-300">
                  {category.score.toFixed(0)}/{category.maxScore} punti
                </span>
              </div>
              <div className="w-full bg-cyber-bg-secondary rounded-full h-2.5 border border-cyber-green-500/20">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Category Details (Expandable) */}
            {isExpanded && (
              <div className="p-4 bg-cyber-bg-secondary/50 border-t border-cyber-green-500/20">
                <div className="space-y-3">
                  {category.details.map((detail, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-cyber-bg-tertiary rounded-lg border border-cyber-green-500/10 hover:border-cyber-green-500/30 transition-all"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getStatusIcon(detail.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-cyber-gray-100">
                            {detail.name}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(detail.status)}`}>
                            {detail.points}/{detail.maxPoints}
                          </span>
                        </div>
                        <p className="text-xs text-cyber-gray-400">
                          {detail.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
