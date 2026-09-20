import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal / Bottom sheet container */}
      <div
        className={`relative z-10 w-full ${maxWidth} bg-white dark:bg-slate-900 rounded-t-3xl md:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 overflow-hidden max-h-[92vh] flex flex-col transition-all duration-200`}
      >
        {/* Mobile drag bar indicator */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>

        {/* Header */}
        {(title || subtitle) && (
          <div className="flex items-center justify-between px-5 md:px-6 pt-3 md:pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              {title && <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{title}</h3>}
              {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors touch-target flex items-center justify-center cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Scrollable content */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
