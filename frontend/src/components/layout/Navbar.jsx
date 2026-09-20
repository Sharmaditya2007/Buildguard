import React from 'react';
import { HardHat, ShieldCheck, UserCheck, LogOut, ArrowRightLeft } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { apiClient } from '../../services/api';

export const Navbar = ({
  role = 'homeowner',
  userName = 'Alice M.',
  projectName = 'Greenwood Villa B-4',
  onSwitchRole,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-stripe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-sm font-extrabold flex-shrink-0">
            <HardHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-lg md:text-xl text-slate-900 tracking-tight">
                BuildGuard<span className="text-amber-600">AI</span>
              </span>
              <Badge
                variant={role === 'homeowner' ? 'verified' : 'brand'}
                size="sm"
                className="hidden sm:inline-flex capitalize font-bold"
              >
                {role}
              </Badge>
            </div>
            <span className="text-xs text-slate-400 hidden sm:block font-medium">
              Site: {projectName}
            </span>
          </div>
        </div>

        {/* Right actions: Role switch & user menu */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Landing Page link */}
          <button
            onClick={onLogout}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title="View Public Landing Page"
          >
            Landing Page
          </button>

          {/* 1-Tap Quick Demo Role Switcher */}
          <button
            onClick={onSwitchRole}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300/80 rounded-xl text-xs md:text-sm font-bold text-slate-800 transition-colors touch-target"
            title="Switch view between Homeowner and Contractor"
          >
            <ArrowRightLeft className="w-4 h-4 text-amber-600" />
            <span className="hidden xs:inline">Switch to</span>
            <span className="text-amber-700 capitalize font-extrabold">
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
            className="hidden lg:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="Reset LocalStorage DB"
          >
            Reset DB
          </button>

          {/* User Profile avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm select-none">
              {userName.charAt(0)}
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
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
