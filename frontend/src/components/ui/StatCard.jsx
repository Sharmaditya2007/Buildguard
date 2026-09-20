import React from 'react';
import { Card } from './Card';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  iconBg = 'bg-amber-950/40 text-amber-400 border border-amber-800/40',
  className = '',
  onClick,
}) => {
  return (
    <Card
      hover={!!onClick}
      onClick={onClick}
      className={`relative overflow-hidden ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {value}
            </span>
            {badge && <div>{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-xs md:text-sm text-slate-400 pt-0.5 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
};
