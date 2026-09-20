import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { QuickActionTile } from '../../components/common/QuickActionTile';
import {
  Camera,
  Layers,
  PackagePlus,
  HardHat,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { apiClient } from '../../services/api';

export const ContractorDashboard = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    activeSites: 1,
    totalDeliveries: 10,
    verifiedDeliveries: 9,
    pendingApprovals: 1,
    currentStage: 'Framing & Structure',
    completionPercentage: 45,
  });

  useEffect(() => {
    async function loadStats() {
      const res = await apiClient.getHomeownerDashboard();
      if (res.success && res.data) {
        const d = res.data;
        setStats({
          activeSites: 1,
          totalDeliveries: d.totalDeliveries ?? 10,
          verifiedDeliveries: d.verifiedDeliveries ?? 9,
          pendingApprovals: d.pendingRequests ?? 1,
          currentStage: d.currentStage || 'Framing & Structure',
          completionPercentage: d.completionPercentage || 45,
        });
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Contractor Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-stripe space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Site Supervisor & Contractor Portal
              </span>
              <Badge variant="brand" size="sm" className="bg-amber-400/20 text-amber-300 border-amber-300/30">
                On-Site Mode
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold mt-1">
              Apex Builders Operations
            </h1>
            <p className="text-slate-300 text-sm">
              Active Site: Greenwood Villa B-4 (Sector 42, Gurgaon)
            </p>
          </div>

          <Button
            variant="brand"
            size="lg"
            icon={Camera}
            onClick={() => onNavigate('upload-material')}
            className="self-start sm:self-auto shadow-md"
          >
            Quick Log Delivery
          </Button>
        </div>

        {/* 3 Value Pillars for Contractors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs text-slate-300 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span><strong>Proof of Delivery:</strong> Photos protect against claims</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span><strong>Fast Sign-Offs:</strong> Homeowners approve orders fast</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span><strong>2-Tap Logging:</strong> No paperwork or complex apps</span>
          </div>
        </div>
      </div>

      {/* Quick Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          title="Active Sites"
          value={String(stats.activeSites || 1)}
          subtitle="Greenwood Villa B-4"
          icon={HardHat}
        />
        <StatCard
          title="Logged Deliveries"
          value={String(stats.totalDeliveries || 10)}
          subtitle={`${stats.verifiedDeliveries || 9} AI verified`}
          icon={ShieldCheck}
          iconBg="bg-emerald-950/40 text-emerald-400 border border-emerald-800/60"
        />
        <StatCard
          title="Requisitions"
          value={String(stats.pendingApprovals || 1)}
          subtitle="Awaiting homeowner"
          icon={Clock}
          iconBg="bg-amber-950/40 text-amber-400 border border-amber-800/60"
        />
        <StatCard
          title="Current Stage"
          value={`${stats.completionPercentage || 45}%`}
          subtitle={stats.currentStage || 'Framing & Structure'}
          icon={Layers}
          iconBg="bg-blue-950/40 text-blue-400 border border-blue-800/60"
        />
      </div>

      {/* WhatsApp-Style Big Contractor Actions (High Priority on Jobsite) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-bold text-white font-heading">
            On-Site Job Actions
          </h3>
          <span className="text-xs text-slate-400 font-medium">Touch-friendly 1-tap logging</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <QuickActionTile
            title="1. Log Material Delivery"
            subtitle="Snap arrival photo & record count"
            icon={Camera}
            iconBg="bg-amber-950/50 text-amber-300"
            onClick={() => onNavigate('upload-material')}
          />

          <QuickActionTile
            title="2. Post Site Progress"
            subtitle="Upload daily milestone photos"
            icon={Layers}
            iconBg="bg-emerald-950/50 text-emerald-300"
            onClick={() => onNavigate('upload-progress')}
          />

          <QuickActionTile
            title="3. Request Materials"
            subtitle="Submit requisition with instant AI check"
            icon={PackagePlus}
            iconBg="bg-blue-950/50 text-blue-300"
            onClick={() => onNavigate('request-material')}
          />
        </div>
      </div>

      {/* Recent On-Site Tasks */}
      <Card className="p-5 md:p-6 space-y-4 bg-slate-900/90 border border-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="text-base md:text-lg font-bold text-white">
            Recent On-Site Submissions
          </h3>
          <span className="text-xs text-slate-400 font-medium">All items recorded to digital ledger</span>
        </div>

        <div className="divide-y divide-slate-800 space-y-3">
          <div className="pt-3 flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/50 text-emerald-400 border border-emerald-800/60 flex items-center justify-center font-bold flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white block">
                  Delivery Logged: 150 Bags UltraTech Cement
                </span>
                <span className="text-xs text-slate-400">
                  AI Computer Vision: Verified with 96% confidence
                </span>
              </div>
            </div>
            <Badge variant="verified" size="sm">Verified</Badge>
          </div>

          <div className="pt-3 flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950/50 text-blue-400 border border-blue-800/60 flex items-center justify-center font-bold flex-shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white block">
                  Site Photos: Framing & Pillars Inspection
                </span>
                <span className="text-xs text-slate-400">
                  AI detected milestone: 45% Framing complete
                </span>
              </div>
            </div>
            <Badge variant="neutral" size="sm">Active</Badge>
          </div>

          <div className="pt-3 flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-950/50 text-amber-400 border border-amber-800/60 flex items-center justify-center font-bold flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white block">
                  Requisition: 250 Bags Cement for Next Week
                </span>
                <span className="text-xs text-slate-400">
                  Pending homeowner review note
                </span>
              </div>
            </div>
            <Badge variant="warning" size="sm">Under Review</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};
