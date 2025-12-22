import { useMemo } from 'react';

interface RatingGaugeProps {
  score: number;
  size?: number;
}

export function RatingGauge({ score, size = 200 }: RatingGaugeProps) {
  const { color, label, rotation } = useMemo(() => {
    let color = '';
    let label = '';

    if (score >= 80) {
      color = '#22c55e';
      label = 'Eccellente';
    } else if (score >= 60) {
      color = '#86efac';
      label = 'Buono';
    } else if (score >= 40) {
      color = '#fbbf24';
      label = 'Sufficiente';
    } else if (score >= 20) {
      color = '#fb923c';
      label = 'Scarso';
    } else {
      color = '#ef4444';
      label = 'Critico';
    }

    // Rotazione dell'ago (da -90° a 90°, totale 180°)
    const rotation = -90 + (score / 100) * 180;

    return { color, label, rotation };
  }, [score]);

  const radius = size / 2;
  const strokeWidth = size / 10;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = Math.PI * innerRadius;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
        <svg width={size} height={size / 2 + 20} className="transform rotate-0">
          {/* Background arc */}
          <path
            d={`M ${strokeWidth / 2} ${radius} A ${innerRadius} ${innerRadius} 0 0 1 ${size - strokeWidth / 2} ${radius}`}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Progress arc */}
          <path
            d={`M ${strokeWidth / 2} ${radius} A ${innerRadius} ${innerRadius} 0 0 1 ${size - strokeWidth / 2} ${radius}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - score / 100)}
            className="transition-all duration-1000 ease-out"
          />

          {/* Needle */}
          <line
            x1={radius}
            y1={radius}
            x2={radius}
            y2={strokeWidth + 10}
            stroke="#374151"
            strokeWidth={3}
            strokeLinecap="round"
            transform={`rotate(${rotation} ${radius} ${radius})`}
            className="transition-transform duration-1000 ease-out"
          />

          {/* Center dot */}
          <circle cx={radius} cy={radius} r={8} fill="#374151" />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          <div className="text-center">
            <div className="text-4xl font-bold" style={{ color }}>
              {Math.round(score)}
            </div>
            <div className="text-sm text-gray-500 mt-1">{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
