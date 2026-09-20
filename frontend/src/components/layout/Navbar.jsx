import React from 'react';
import { HardHat, ShieldCheck, UserCheck, LogOut, ArrowRightLeft, Sun, Moon } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { apiClient } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = ({
  role = 'homeowner',
  userName = 'Alice M.',
  projectName = 'Greenwood Villa B-4',
  onSwitchRole,
  onLogout,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200/80 dark:border-slate-800 shadow-stripe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-sm font-extrabold flex-shrink-0 shadow-amber-500/20">
            <HardHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-lg md:text-xl text-slate-900 dark:text-white tracking-tight">
                BuildGuard<span className="text-amber-500">AI</span>
              </span>
              <Badge
                variant={role === 'homeowner' ? 'verified' : 'brand'}
                size="sm"
                className="hidden sm:inline-flex capitalize font-bold"
              >
                {role}
              </Badge>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-400 hidden sm:block font-medium">
              Site: {projectName}
            </span>
          </div>
        </div>

        {/* Right actions: Role switch, theme toggle & user menu */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 transition-all cursor-pointer"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 md:w-5 md:h-5 text-amber-400 animate-in spin-in-180 duration-300" />
            ) : (
              <Moon className="w-4 h-4 md:w-5 md:h-5 text-slate-600 animate-in spin-in-180 duration-300" />
            )}
          </button>

          {/* Landing Page link */}
          <button
            onClick={onLogout}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            title="View Public Landing Page"
          >
            Landing Page
          </button>

          {/* 1-Tap Quick Demo Role Switcher */}
          <button
            onClick={onSwitchRole}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-300/80 dark:border-slate-700 rounded-xl text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors touch-target cursor-pointer"
            title="Switch view between Homeowner and Contractor"
          >
            <ArrowRightLeft className="w-4 h-4 text-amber-500" />
            <span className="hidden xs:inline">Switch to</span>
            <span className="text-amber-600 dark:text-amber-400 capitalize font-extrabold">
              {role === 'homeowner' ? 'Contractor' : 'Homeowner'}
            </span>
          </button>

          {/* Reset Demo Database button */}
          <button
            onClick={() => {
              if (window.confirm('Reset local database back to default initial state (10 deliveries, 92% trust score)?')) {
                apiClient.resetDatabase();
                window.location.reload();
              }
            }}
            className="hidden lg:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            title="Reset LocalStorage DB"
          >
            Reset DB
          </button>

          {/* User Profile avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 flex items-center justify-center font-black text-sm select-none shadow-sm">
              {userName.charAt(0)}
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
