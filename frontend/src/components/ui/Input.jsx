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
          className="block text-sm md:text-base font-semibold text-slate-800"
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
          className={`w-full min-h-[50px] px-4 py-3 text-base md:text-lg text-slate-900 bg-white border-2 rounded-xl transition-colors
            ${Icon ? 'pl-11' : ''}
            ${suffix ? 'pr-14' : ''}
            ${error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
              : 'border-slate-200 hover:border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-100'
            }
            focus:outline-none placeholder:text-slate-400 disabled:bg-slate-100 disabled:cursor-not-allowed ${className}`}
          {...props}
        />

        {suffix && (
          <div className="absolute right-3.5 text-sm md:text-base font-medium text-slate-500 pointer-events-none select-none">
            {suffix}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-sm font-medium text-rose-600 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs md:text-sm text-slate-500 mt-1">{helperText}</p>
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
        <label htmlFor={inputId} className="block text-sm md:text-base font-semibold text-slate-800">
          {label}
        </label>
      )}

      <select
        id={inputId}
        className={`w-full min-h-[50px] px-4 py-3 text-base md:text-lg text-slate-900 bg-white border-2 rounded-xl transition-colors
          ${error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
            : 'border-slate-200 hover:border-slate-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-100'
          }
          focus:outline-none cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className="text-sm font-medium text-rose-600 mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs md:text-sm text-slate-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};
