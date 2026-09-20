import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Camera,
  Layers,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
  TrendingUp,
  FileText
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const PlatformExplainerModal = ({ isOpen, onClose, defaultTab = 'trust' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  if (!isOpen) return null;

  const tabs = [
    { id: 'trust', label: 'Trust Score', icon: ShieldCheck },
    { id: 'vision', label: 'AI Bag Counter', icon: Camera },
    { id: 'rebar', label: 'Milestone Progress', icon: Layers },
    { id: 'requisitions', label: 'Neutral Advisory', icon: Sparkles }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-heading">
                BuildGuard AI Guide & Explainer
              </h2>
              <p className="text-xs text-slate-400">
                How independent visual auditing works on site
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-5 sm:px-6 pt-4 pb-2 border-b border-slate-800/80">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-5 sm:p-6 space-y-5 text-slate-300 text-sm leading-relaxed flex-1">
          {activeTab === 'trust' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Understanding the Project Trust Score
                </h3>
                <Badge variant="verified" size="sm">Score Range: 0 - 100%</Badge>
              </div>
              <p>
                The Trust Score is a transparent mathematical index calculated from physical site deliveries vs. verified photographic logs.
              </p>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold uppercase text-amber-400">Formula</span>
                <div className="text-base font-mono font-bold text-white">
                  Trust Score = (Verified Deliveries / Total Deliveries) × 100
                </div>
                <p className="text-xs text-slate-400">
                  Deliveries with photographic computer vision proof &gt;80% confidence boost the score to give homeowners peace of mind.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-300 text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> 90% - 100% (High Trust)
                  </span>
                  <p className="text-xs text-slate-300">Deliveries consistently logged with verified visual proof.</p>
                </div>
                <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl space-y-1">
                  <span className="font-bold text-amber-300 text-xs flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> &lt;80% (Review Suggested)
                  </span>
                  <p className="text-xs text-slate-300">A delivery requires a clearer photo or quantity clarification.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vision' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-amber-400" />
                  AI Computer Vision Counting
                </h3>
                <Badge variant="brand" size="sm">Real-Time Scan</Badge>
              </div>
              <p>
                Contractors snap a photo of delivered pallets or trucks. Our computer vision model scans the stack, estimates unit count, and provides a confidence rating.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-center">
                  <span className="text-xs font-bold text-amber-400 block">1. Capture</span>
                  <span className="text-xs text-slate-300">Supervisor snaps photo directly in mobile browser.</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-center">
                  <span className="text-xs font-bold text-emerald-400 block">2. Visual Audit</span>
                  <span className="text-xs text-slate-300">AI counts visible bags and calculates confidence score.</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1 text-center">
                  <span className="text-xs font-bold text-blue-400 block">3. Ledger Sync</span>
                  <span className="text-xs text-slate-300">Instant update to homeowner feed and financial summary.</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rebar' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-400" />
                  Milestone Progress Tracking
                </h3>
                <Badge variant="verified" size="sm">Stage Detection</Badge>
              </div>
              <p>
                BuildGuard AI detects structural stages automatically and calibrates the percentage completed:
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <span className="font-bold text-white">Stage 1: Foundation & Excavation</span>
                  <span className="text-emerald-400 font-semibold">10% - 30%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <span className="font-bold text-white">Stage 2: Framing & Structural Slab</span>
                  <span className="text-amber-400 font-semibold">30% - 60%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <span className="font-bold text-white">Stage 3: Brickwork & Roofing</span>
                  <span className="text-blue-400 font-semibold">60% - 85%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <span className="font-bold text-white">Stage 4: Finishing & Handover</span>
                  <span className="text-purple-400 font-semibold">85% - 100%</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requisitions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Neutral Advisory Engine
                </h3>
                <Badge variant="brand" size="sm">Zero Blame</Badge>
              </div>
              <p>
                When a contractor requests new materials, the AI sanity checks the requested volume against house square footage and previous delivery consumption.
              </p>

              <div className="p-4 bg-purple-950/20 border border-purple-800/40 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-purple-300 block">Why this protects contractors:</span>
                <p className="text-xs text-slate-300">
                  Instead of raising false alarm, the AI offers constructive advisory notes (such as checking on-site covered storage to prevent rain damage), speeding up homeowner sign-offs without awkward friction.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-900/90">
          <Button variant="brand" size="md" onClick={onClose} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border-none">
            Got it, thanks!
          </Button>
        </div>
      </div>
    </div>
  );
};
