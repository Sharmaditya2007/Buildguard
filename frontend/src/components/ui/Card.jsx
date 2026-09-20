import React from 'react';

export const Card = ({
  children,
  className = '',
  onClick,
  hover = false,
  padding = 'p-5 md:p-6',
  ...props
}) => {
  const hoverStyles = hover
    ? 'hover:border-slate-700 hover:shadow-stripe-md transition-all duration-200 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`bg-slate-900/90 rounded-2xl border border-slate-800 shadow-stripe text-slate-100 backdrop-blur-sm transition-colors ${hoverStyles} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-start justify-between gap-4 pb-4 border-b border-slate-800/80 mb-4 ${className}`}>
    <div>
      {title && <h3 className="text-lg md:text-xl font-bold text-white leading-snug">{title}</h3>}
      {subtitle && <p className="text-sm md:text-base text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);
