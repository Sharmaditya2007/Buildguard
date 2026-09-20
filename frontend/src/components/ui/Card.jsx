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
    ? 'hover:border-slate-300 hover:shadow-stripe-md transition-all duration-200 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-stripe ${hoverStyles} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-start justify-between gap-4 pb-4 border-b border-slate-100 mb-4 ${className}`}>
    <div>
      {title && <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">{title}</h3>}
      {subtitle && <p className="text-sm md:text-base text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);
