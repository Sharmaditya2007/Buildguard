import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

export const AiAlertCard = ({
  alertId,
  type = 'REQUISITION_ANOMALY',
  severity = 'WARNING',
  title,
  description,
  timestamp,
  declaredQuantity,
  aiEstimate,
  status = 'Pending',
  onApprove,
  onReject,
}) => {
  const [actionState, setActionState] = useState(status);
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    if (onApprove) await onApprove(alertId);
    setActionState('Approved');
    setLoading(false);
  };

  const handleReject = async () => {
    setLoading(true);
    if (onReject) await onReject(alertId);
    setActionState('Rejected');
    setLoading(false);
  };

  const isWarning = severity === 'WARNING' || severity === 'HIGH';

  return (
    <Card className="border-l-4 border-l-amber-500 space-y-3">
      {/* Top Tag & Time */}
      <div className="flex items-center justify-between gap-2">
        <Badge
          variant={actionState === 'Approved' ? 'approved' : actionState === 'Rejected' ? 'danger' : isWarning ? 'warning' : 'neutral'}
          icon={AlertTriangle}
          size="sm"
        >
          {actionState === 'Approved' ? 'Approved' : actionState === 'Rejected' ? 'Rejected' : `${severity} • Needs Review`}
        </Badge>

        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {timestamp ? new Date(timestamp).toLocaleDateString() : 'Today'}
        </span>
      </div>

      {/* Title & Description */}
      <div>
        <h4 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug">
          {title}
        </h4>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Comparison Box (if available) */}
      {(declaredQuantity || aiEstimate) && (
        <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 grid grid-cols-2 gap-3 text-xs md:text-sm">
          {declaredQuantity && (
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[11px] uppercase font-bold">Declared</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-200">{declaredQuantity}</span>
            </div>
          )}
          {aiEstimate && (
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[11px] uppercase font-bold">AI Estimate</span>
              <span className="font-extrabold text-amber-700 dark:text-amber-400">{aiEstimate}</span>
            </div>
          )}
        </div>
      )}

      {/* Quick Action Buttons */}
      {actionState === 'Pending' && (onApprove || onReject) && (
        <div className="pt-2 flex items-center gap-2.5">
          <Button
            variant="success"
            size="md"
            icon={CheckCircle}
            className="flex-1"
            loading={loading}
            onClick={handleApprove}
          >
            Approve Request
          </Button>
          <Button
            variant="outline"
            size="md"
            icon={XCircle}
            className="flex-1 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-300 dark:hover:border-rose-700"
            loading={loading}
            onClick={handleReject}
          >
            Reject
          </Button>
        </div>
      )}

      {actionState !== 'Pending' && (
        <div className="pt-1 text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400">
          Decision logged: <span className="font-bold text-slate-800 dark:text-white">{actionState}</span>
        </div>
      )}
    </Card>
  );
};
