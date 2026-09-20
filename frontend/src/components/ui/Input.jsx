import React from 'react';

export const Input = ({
  label,
  helperText,
  error,
  icon: Icon,
  suffix,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm md:text-base font-semibold text-slate-200"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          className={`w-full min-h-[50px] px-4 py-3 text-base md:text-lg text-white bg-slate-850 border-2 rounded-xl transition-colors
            ${Icon ? 'pl-11' : ''}
            ${suffix ? 'pr-14' : ''}
            ${error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-4 focus:ring-rose-950/50'
              : 'border-slate-700 hover:border-slate-600 focus:border-amber-400 focus:ring-4 focus:ring-amber-950/40'
            }
            focus:outline-none placeholder:text-slate-500 disabled:bg-slate-800 disabled:cursor-not-allowed ${className}`}
          {...props}
        />

        {suffix && (
          <div className="absolute right-3.5 text-sm md:text-base font-medium text-slate-400 pointer-events-none select-none">
            {suffix}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-sm font-medium text-rose-400 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs md:text-sm text-slate-400 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export const Select = ({
  label,
  helperText,
  error,
  options = [],
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm md:text-base font-semibold text-slate-200">
          {label}
        </label>
      )}

      <select
        id={inputId}
        className={`w-full min-h-[50px] px-4 py-3 text-base md:text-lg text-white bg-slate-850 border-2 rounded-xl transition-colors
          ${error
            ? 'border-rose-500/80 focus:border-rose-500 focus:ring-4 focus:ring-rose-950/50'
            : 'border-slate-700 hover:border-slate-600 focus:border-amber-400 focus:ring-4 focus:ring-amber-950/40'
          }
          focus:outline-none cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className="text-sm font-medium text-rose-400 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs md:text-sm text-slate-400 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};
