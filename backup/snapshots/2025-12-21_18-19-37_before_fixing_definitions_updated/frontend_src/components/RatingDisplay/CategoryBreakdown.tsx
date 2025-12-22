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
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'fail':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(categories).map(([key, category]) => {
        const percentage = (category.score / category.maxScore) * 100;
        const color = percentage >= 70 ? 'bg-green-500' : percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500';
        const isExpanded = expandedCategories.has(key);

        return (
          <div key={key} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Category Header */}
            <div
              className="p-4 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleCategory(key)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">
                    {categoryNames[key as keyof typeof categoryNames]}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {category.score.toFixed(0)}/{category.maxScore} punti
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Category Details (Expandable) */}
            {isExpanded && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="space-y-3">
                  {category.details.map((detail, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getStatusIcon(detail.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {detail.name}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadge(detail.status)}`}>
                            {detail.points}/{detail.maxPoints}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
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
