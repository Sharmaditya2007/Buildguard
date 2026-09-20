import React from 'react';
import { ChevronRight } from 'lucide-react';

export const QuickActionTile = ({
  title,
  subtitle,
  icon: Icon,
  onClick,
  badge,
  iconBg = 'bg-amber-100 text-amber-800',
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full min-h-[72px] p-4 md:p-5 bg-white rounded-2xl border-2 border-slate-200 hover:border-amber-400 hover:shadow-stripe-md active:scale-[0.99] transition-all flex items-center justify-between gap-4 text-left cursor-pointer group ${className}`}
    >
      <div className="flex items-center gap-3.5">
        {Icon && (
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${iconBg}`}>
            <Icon className="w-6 h-6 md:w-7 md:h-7" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base md:text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
              {title}
            </span>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-xs md:text-sm text-slate-500 mt-0.5 line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 transition-colors flex-shrink-0" />
    </button>
  );
};
