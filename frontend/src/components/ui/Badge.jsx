import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon: Icon,
  className = '',
}) => {
  const variants = {
    verified: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    normal: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    review: 'bg-amber-50 text-amber-800 border border-amber-200',
    flagged: 'bg-amber-50 text-amber-800 border border-amber-200',
    
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    discrepancy: 'bg-rose-50 text-rose-700 border border-rose-200',
    rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
    
    pending: 'bg-blue-50 text-blue-700 border border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    brand: 'bg-amber-100/70 text-amber-900 border border-amber-300',
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
