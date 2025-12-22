import { useMemo } from 'react';

interface RatingGaugeProps {
  score: number;
  size?: number;
}

export function RatingGauge({ score, size = 200 }: RatingGaugeProps) {
  const { color, glowColor, label, rotation } = useMemo(() => {
    let color = '';
    let glowColor = '';
    let label = '';

    if (score >= 80) {
      color = '#00ff41';        // Neon green for excellent
      glowColor = 'rgba(0, 255, 65, 0.5)';
      label = 'Eccellente';
    } else if (score >= 60) {
      color = '#4dffa3';        // Light green for good
      glowColor = 'rgba(77, 255, 163, 0.5)';
      label = 'Buono';
    } else if (score >= 40) {
      color = '#ff6b35';        // Orange for sufficient
      glowColor = 'rgba(255, 107, 53, 0.5)';
      label = 'Sufficiente';
    } else if (score >= 20) {
      color = '#ff5419';        // Dark orange for poor
      glowColor = 'rgba(255, 84, 25, 0.5)';
      label = 'Scarso';
    } else {
      color = '#ff6b35';        // Red-orange for critical
      glowColor = 'rgba(255, 107, 53, 0.5)';
      label = 'Critico';
    }

    // Rotazione dell'ago (da -90° a 90°, totale 180°)
    const rotation = -90 + (score / 100) * 180;

    return { color, glowColor, label, rotation };
  }, [score]);

  const radius = size / 2;
  const strokeWidth = size / 10;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = Math.PI * innerRadius;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
        <svg width={size} height={size / 2 + 20} className="transform rotate-0">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background arc */}
          <path
            d={`M ${strokeWidth / 2} ${radius} A ${innerRadius} ${innerRadius} 0 0 1 ${size - strokeWidth / 2} ${radius}`}
            fill="none"
            stroke="#1a1f3a"
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
            filter="url(#glow)"
          />

          {/* Needle */}
          <line
            x1={radius}
            y1={radius}
            x2={radius}
            y2={strokeWidth + 10}
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            transform={`rotate(${rotation} ${radius} ${radius})`}
            className="transition-transform duration-1000 ease-out"
            filter="url(#glow)"
          />

          {/* Center dot */}
          <circle cx={radius} cy={radius} r={8} fill={color} filter="url(#glow)" />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          <div className="text-center">
            <div className="text-4xl font-bold neon-text font-rajdhani" style={{ color, textShadow: `0 0 20px ${glowColor}` }}>
              {Math.round(score)}
            </div>
            <div className="text-sm text-cyber-gray-400 mt-1 font-rajdhani uppercase tracking-wider">{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
