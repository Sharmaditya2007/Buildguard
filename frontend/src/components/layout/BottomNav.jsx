import React from 'react';

export const BottomNav = ({ items = [], activeTab, onTabChange }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg pb-safe">
      <div
        className="grid h-16 items-center px-1"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center h-full w-full py-1 text-center transition-colors cursor-pointer select-none relative ${
                isActive ? 'text-amber-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {/* Badge counter */}
              {item.badge && item.badge > 0 && (
                <span className="absolute top-1.5 right-3 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {item.badge}
                </span>
              )}

              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-amber-100/60' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[11px] font-bold mt-0.5 truncate max-w-[64px] ${isActive ? 'text-amber-700' : 'text-slate-500'}`}>
                {item.shortLabel || item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
