import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon: Icon,
  className = '',
}) => {
  const variants = {
    verified: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60',
    success: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60',
    approved: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60',
    normal: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60',
    
    warning: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60',
    review: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60',
    flagged: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60',
    
    danger: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60',
    discrepancy: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60',
    rejected: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60',
    
    pending: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60',
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    brand: 'bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800/70',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs font-semibold rounded-md gap-1',
    md: 'px-2.5 py-1 text-xs md:text-sm font-semibold rounded-lg gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm md:text-base font-bold rounded-xl gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium ${variants[variant] || variants.neutral} ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      <span>{children}</span>
    </span>
  );
};
