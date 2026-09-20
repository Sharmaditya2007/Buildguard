import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AiAlertCard } from '../../components/common/AiAlertCard';
import { AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../services/api';

export const AiAlertsPage = () => {
  const [alerts, setAlerts] = useState([
    {
      alertId: 'alert-req-1',
      type: 'REQUISITION_ANOMALY',
      severity: 'WARNING',
      title: 'Material Requisition Review: UltraTech 53 Grade Cement',
      description: 'The requested 250 bags brings total foundation stage cement to 700 bags, which is higher than typical for a 2,400 sqft residential structure. Checking on-site weather-safe storage first is recommended before placing a new shipment.',
      timestamp: new Date().toISOString(),
      declaredQuantity: '250 bags requested',
      aiEstimate: '150-175 bags standard benchmark',
      status: 'Pending'
    },
    {
      alertId: 'alert-mat-1',
      type: 'MATERIAL_DISCREPANCY',
      severity: 'WARNING',
      title: 'Visual Count Variation: Red Clay Bricks',
      description: 'The visible front rows contain roughly 3,200 bricks compared to 4,000 on the delivery invoice. Some inventory may be stacked behind the main pallet wall out of direct camera view.',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      declaredQuantity: '4,000 bricks',
      aiEstimate: '3,200 visible',
      status: 'Pending'
    }
  ]);

  useEffect(() => {
    async function loadAlerts() {
      const res = await apiClient.getAiAlerts();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setAlerts(res.data);
      }
    }
    loadAlerts();
  }, []);

  const handleApprove = async (id) => {
    await apiClient.approveMaterialRequest(id, 'Approved by homeowner after checking site.');
    setAlerts(prev => prev.map(a => a.alertId === id ? { ...a, status: 'Approved' } : a));
  };

  const handleReject = async (id) => {
    await apiClient.rejectMaterialRequest(id, 'Requested quantity is higher than immediate stage requirements.');
    setAlerts(prev => prev.map(a => a.alertId === id ? { ...a, status: 'Rejected' } : a));
  };

  const pendingCount = alerts.filter(a => a.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
            AI Transparency Alerts & Reviews
          </h1>
          {pendingCount > 0 && (
            <Badge variant="warning" size="md">
              {pendingCount} Pending
            </Badge>
          )}
        </div>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">
          Calm, independent civil engineering observations designed to prevent waste and billing misunderstandings.
        </p>
      </div>

      {/* Reassurance Banner */}
      <Card className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 flex items-start gap-3">
        <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs md:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed">
          <span className="font-bold block text-emerald-900 dark:text-emerald-300">Objective Assistance Guarantee</span>
          BuildGuard AI reports visual observations and consumption guidelines neutrally. We never accuse contractors of theft or misconduct, ensuring cooperative problem solving on your project.
        </div>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <Card className="text-center py-12 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">All clear! No active alerts</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">All deliveries and material orders are currently aligned.</p>
          </Card>
        ) : (
          alerts.map(alert => (
            <AiAlertCard
              key={alert.alertId}
              alertId={alert.alertId}
              type={alert.type}
              severity={alert.severity}
              title={alert.title}
              description={alert.description}
              timestamp={alert.timestamp}
              declaredQuantity={alert.declaredQuantity}
              aiEstimate={alert.aiEstimate}
              status={alert.status}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        )}
      </div>
    </div>
  );
};
