import React from 'react';

export const ProgressBar = ({
  percentage = 0,
  label,
  subtitle,
  showPercentage = true,
  size = 'md',
  color = 'brand',
  className = '',
}) => {
  const clamped = Math.min(Math.max(Number(percentage) || 0, 0), 100);

  const colors = {
    brand: 'bg-amber-500',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-600',
  };

  const heights = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5',
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm md:text-base">
          <div>
            {label && <span className="font-bold text-slate-200">{label}</span>}
            {subtitle && <span className="text-slate-400 ml-2 text-xs md:text-sm">({subtitle})</span>}
          </div>
          {showPercentage && (
            <span className="font-extrabold text-white text-base md:text-lg">
              {clamped}%
            </span>
          )}
        </div>
      )}

      <div className={`w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/60 ${heights[size] || heights.md}`}>
        <div
          className={`h-full transition-all duration-500 ease-out rounded-full ${colors[color] || colors.brand}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
