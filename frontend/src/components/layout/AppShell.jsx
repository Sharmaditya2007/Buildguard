import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

export const AppShell = ({
  children,
  role,
  userName,
  projectName,
  navItems = [],
  activeTab,
  onTabChange,
  onSwitchRole,
  onLogout,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Navbar */}
      <Navbar
        role={role}
        userName={userName}
        projectName={projectName}
        onSwitchRole={onSwitchRole}
        onLogout={onLogout}
      />

      {/* Main body area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar
          items={navItems}
          activeTab={activeTab}
          onTabChange={onTabChange}
          projectName={projectName}
        />

        {/* Content Viewport with pb-24 on mobile so bottom nav never blocks content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-12 overflow-y-auto max-w-5xl">
          {children}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav
        items={navItems}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </div>
  );
};
