import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon: Icon,
  className = '',
}) => {
  const variants = {
    verified: 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60',
    success: 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60',
    approved: 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60',
    normal: 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60',
    
    warning: 'bg-amber-950/50 text-amber-300 border border-amber-800/60',
    review: 'bg-amber-950/50 text-amber-300 border border-amber-800/60',
    flagged: 'bg-amber-950/50 text-amber-300 border border-amber-800/60',
    
    danger: 'bg-rose-950/50 text-rose-300 border border-rose-800/60',
    discrepancy: 'bg-rose-950/50 text-rose-300 border border-rose-800/60',
    rejected: 'bg-rose-950/50 text-rose-300 border border-rose-800/60',
    
    pending: 'bg-blue-950/50 text-blue-300 border border-blue-800/60',
    neutral: 'bg-slate-800 text-slate-300 border border-slate-700',
    brand: 'bg-amber-950/60 text-amber-300 border border-amber-800/70',
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
