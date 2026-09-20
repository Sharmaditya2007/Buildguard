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
    ? 'hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-stripe-md transition-all duration-200 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-stripe text-slate-900 dark:text-slate-100 backdrop-blur-sm transition-colors ${hoverStyles} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-4 ${className}`}>
    <div>
      {title && <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white leading-snug">{title}</h3>}
      {subtitle && <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);
