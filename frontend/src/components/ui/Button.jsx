import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer';

  const variants = {
    primary: 'bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 focus:ring-slate-700 shadow-sm',
    brand: 'bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 focus:ring-amber-500 shadow-sm shadow-amber-500/20',
    success: 'bg-emerald-600 text-white hover:bg-emerald-500 focus:ring-emerald-500 shadow-sm shadow-emerald-600/20',
    outline: 'bg-slate-800/80 text-slate-200 border-2 border-slate-700 hover:bg-slate-700/80 hover:border-slate-600 focus:ring-amber-500',
    secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 focus:ring-slate-700',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white',
    danger: 'bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-500 shadow-sm',
  };

  const sizes = {
    sm: 'min-h-[38px] px-3 py-1.5 text-sm gap-1.5',
    md: 'min-h-[44px] px-4 py-2 text-base gap-2',
    lg: 'min-h-[52px] px-6 py-3 text-base md:text-lg gap-2.5', // Default: Mobile-first thumb friendly
    xl: 'min-h-[60px] px-7 py-4 text-lg md:text-xl font-bold gap-3', // WhatsApp-style big action
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.lg} ${widthStyle} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
