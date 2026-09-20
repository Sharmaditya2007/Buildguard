import React from 'react';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const TrustGauge = ({ percentage = 95, totalDeliveries = 12, aiVerified = 11, discrepancies = 1 }) => {
  const isHigh = percentage >= 90;
  const isMedium = percentage >= 70 && percentage < 90;

  const colorClass = isHigh
    ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
    : isMedium
    ? 'text-amber-600 bg-amber-50 border-amber-200'
    : 'text-rose-600 bg-rose-50 border-rose-200';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-stripe p-5 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Material Integrity Audit
          </span>
          <h4 className="text-lg md:text-xl font-bold text-slate-900 mt-0.5">
            AI Trust Score
          </h4>
          <p className="text-sm text-slate-500 mt-1">
            {aiVerified} of {totalDeliveries} deliveries verified by computer vision
          </p>
        </div>

        {/* Large visual score circle */}
        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 flex flex-col items-center justify-center flex-shrink-0 ${colorClass}`}>
          <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {percentage}%
          </span>
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
            {isHigh ? 'High Trust' : isMedium ? 'Good' : 'Needs Review'}
          </span>
        </div>
      </div>

      {discrepancies > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs md:text-sm text-amber-800 bg-amber-50/70 px-3 py-2 rounded-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
          <span>{discrepancies} delivery has an active visual note awaiting clarification</span>
        </div>
      )}
    </div>
  );
};
