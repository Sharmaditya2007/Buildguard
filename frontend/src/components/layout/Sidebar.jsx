import React from 'react';

export const Sidebar = ({ items = [], activeTab, onTabChange, projectName = 'Greenwood Villa B-4' }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900/90 border-r border-slate-800 min-h-[calc(100vh-4rem)] p-4 flex-shrink-0 backdrop-blur-sm">
      {/* Active Project Card */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3.5 mb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Active Project
        </span>
        <h4 className="text-sm font-bold text-white mt-0.5 truncate">
          {projectName}
        </h4>
        <p className="text-xs text-slate-400 mt-0.5">Stage: Framing & Structure</p>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1.5 flex-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-xl flex items-center justify-between font-semibold text-sm transition-all cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold shadow-amber-500/10'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive
                      ? 'bg-slate-950 text-amber-400'
                      : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Helpful transparency footer card */}
      <div className="p-3.5 bg-amber-950/20 border border-amber-800/40 rounded-2xl text-xs text-amber-300">
        <p className="font-bold">BuildGuard AI Engine</p>
        <p className="text-amber-400/90 mt-0.5">
          Independent computer vision auditing active on all site deliveries.
        </p>
      </div>
    </aside>
  );
};
