import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AppShell } from './components/layout/AppShell';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { SignupPage } from './pages/public/SignupPage';

// Homeowner Pages
import { HomeownerDashboard } from './pages/homeowner/HomeownerDashboard';
import { MaterialHistory } from './pages/homeowner/MaterialHistory';
import { ProgressHistory } from './pages/homeowner/ProgressHistory';
import { AiAlertsPage } from './pages/homeowner/AiAlertsPage';
import { ReportsPage } from './pages/homeowner/ReportsPage';

// Contractor Pages
import { ContractorDashboard } from './pages/contractor/ContractorDashboard';
import { UploadMaterial } from './pages/contractor/UploadMaterial';
import { UploadProgress } from './pages/contractor/UploadProgress';
import { RequestMaterial } from './pages/contractor/RequestMaterial';

import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { AiBagCounter } from './components/common/AiBagCounter';

// Navigation Icons
import {
  LayoutDashboard,
  PackageCheck,
  TrendingUp,
  AlertTriangle,
  FileText,
  Camera,
  Layers,
  PackagePlus
} from 'lucide-react';

export default function App() {
  const {
    user,
    role,
    activeProject,
    switchRole,
    logout,
    loginAsHomeowner,
    loginAsContractor
  } = useAuth();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [publicView, setPublicView] = useState('landing'); // 'landing' | 'login' | 'signup'

  // Handle Public Views
  if (!user || role === 'public') {
    if (publicView === 'login') {
      return (
        <LoginPage
          onBack={() => setPublicView('landing')}
          onGoSignup={() => setPublicView('signup')}
        />
      );
    }
    if (publicView === 'signup') {
      return (
        <SignupPage
          onBack={() => setPublicView('landing')}
          onGoLogin={() => setPublicView('login')}
        />
      );
    }
    return (
      <LandingPage
        onGoHomeowner={() => {
          loginAsHomeowner();
          setActiveTab('dashboard');
        }}
        onGoContractor={() => {
          loginAsContractor();
          setActiveTab('contractor-dashboard');
        }}
        onGoLogin={() => setPublicView('login')}
      />
    );
  }

  // Homeowner Navigation Configuration
  const homeownerNav = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'check-image', label: 'Upload to Check', shortLabel: 'Check Image', icon: Camera },
    { id: 'materials', label: 'Materials', icon: PackageCheck },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: 1 },
    { id: 'reports', label: 'Report', icon: FileText },
  ];

  // Contractor Navigation Configuration
  const contractorNav = [
    { id: 'contractor-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload-material', label: 'Log Material', icon: Camera },
    { id: 'upload-progress', label: 'Site Photos', icon: Layers },
    { id: 'request-material', label: 'Requisition', icon: PackagePlus },
  ];

  const currentNavItems = role === 'homeowner' ? homeownerNav : contractorNav;

  return (
    <AppShell
      role={role}
      userName={user.name}
      projectName={activeProject.projectName}
      navItems={currentNavItems}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId)}
      onSwitchRole={() => {
        switchRole();
        setActiveTab(role === 'homeowner' ? 'contractor-dashboard' : 'dashboard');
      }}
      onLogout={() => {
        logout();
        setPublicView('landing');
      }}
    >
      {/* Homeowner View Routing */}
      {role === 'homeowner' && (
        <>
          {activeTab === 'dashboard' && (
            <HomeownerDashboard onNavigate={(tab) => setActiveTab(tab)} />
          )}
          {activeTab === 'check-image' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
                    Upload Image to Check (AI Bag Counter)
                  </h1>
                  <p className="text-sm md:text-base text-slate-500 mt-1">
                    Upload any delivery photo from your phone or computer to automatically count cement bags and audit quantities.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('dashboard')}
                  className="self-start sm:self-auto cursor-pointer"
                >
                  ← Back to Home
                </Button>
              </div>
              <Card className="p-5 sm:p-8 bg-white border border-slate-200 shadow-sm rounded-3xl">
                <AiBagCounter />
              </Card>
            </div>
          )}
          {activeTab === 'materials' && <MaterialHistory />}
          {activeTab === 'progress' && <ProgressHistory />}
          {activeTab === 'alerts' && <AiAlertsPage />}
          {activeTab === 'reports' && <ReportsPage />}
        </>
      )}

      {/* Contractor View Routing */}
      {role === 'contractor' && (
        <>
          {activeTab === 'contractor-dashboard' && (
            <ContractorDashboard onNavigate={(tab) => setActiveTab(tab)} />
          )}
          {activeTab === 'upload-material' && (
            <UploadMaterial onComplete={() => setActiveTab('contractor-dashboard')} />
          )}
          {activeTab === 'upload-progress' && (
            <UploadProgress onComplete={() => setActiveTab('contractor-dashboard')} />
          )}
          {activeTab === 'request-material' && (
            <RequestMaterial onComplete={() => setActiveTab('contractor-dashboard')} />
          )}
        </>
      )}
    </AppShell>
  );
}
