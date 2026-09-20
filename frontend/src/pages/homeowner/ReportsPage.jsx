import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Printer, Download, ShieldCheck, FileText, CheckCircle2, Calendar } from 'lucide-react';

export const ReportsPage = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
            Project Transparency Audit Report
          </h1>
          <p className="text-sm md:text-base text-slate-500 mt-0.5">
            Verified materials, structural progress logs, and AI audit history.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            icon={Printer}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            variant="brand"
            size="md"
            icon={Download}
            onClick={handlePrint}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Formal Audit Document Card */}
      <Card className="p-6 md:p-10 space-y-8 bg-white border border-slate-200">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b pb-6 border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-2xl text-slate-900">
                BuildGuard<span className="text-amber-600">AI</span>
              </span>
              <Badge variant="verified" size="sm" icon={ShieldCheck}>
                Certified Audit
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">
              Independent Civil Verification Ledger
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 space-y-0.5">
            <p className="font-bold text-slate-800">Report ID: BG-2026-VILLA-B4</p>
            <p>Generated on: {new Date().toLocaleDateString()}</p>
            <p>Status: Active Construction</p>
          </div>
        </div>

        {/* Project Metadata Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs md:text-sm">
          <div>
            <span className="text-slate-400 block font-bold text-[11px] uppercase">Project Name</span>
            <span className="font-bold text-slate-900">Greenwood Villa B-4</span>
          </div>
          <div>
            <span className="text-slate-400 block font-bold text-[11px] uppercase">Built-Up Area</span>
            <span className="font-bold text-slate-900">2,400 Sqft</span>
          </div>
          <div>
            <span className="text-slate-400 block font-bold text-[11px] uppercase">Current Milestone</span>
            <span className="font-bold text-amber-700">Framing & Structure (45%)</span>
          </div>
          <div>
            <span className="text-slate-400 block font-bold text-[11px] uppercase">Contractor</span>
            <span className="font-bold text-slate-900">Apex Builders Pvt Ltd</span>
          </div>
        </div>

        {/* Audit Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-xs text-slate-500 font-bold uppercase">Material Integrity Score</span>
            <p className="text-3xl font-extrabold text-emerald-600">90%</p>
            <span className="text-xs text-slate-400">9 of 10 deliveries verified</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-xs text-slate-500 font-bold uppercase">Total Materials Logged</span>
            <p className="text-3xl font-extrabold text-slate-900">10</p>
            <span className="text-xs text-slate-400">Photographic proof recorded</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 text-center space-y-1">
            <span className="text-xs text-slate-500 font-bold uppercase">Site Stage Completion</span>
            <p className="text-3xl font-extrabold text-amber-600">45%</p>
            <span className="text-xs text-slate-400">Foundation & Framing complete</span>
          </div>
        </div>

        {/* Verified Materials Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-base md:text-lg font-bold text-slate-900">
            Material Audit Ledger
          </h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                <tr>
                  <th className="p-3">Material Description</th>
                  <th className="p-3">Declared Qty</th>
                  <th className="p-3">AI Vision Status</th>
                  <th className="p-3">Logged Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">UltraTech 53 Grade Cement</td>
                  <td className="p-3">150 bags</td>
                  <td className="p-3"><Badge variant="verified" size="sm">Verified (96%)</Badge></td>
                  <td className="p-3">Today</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Fe-550D TMT Steel Rebar</td>
                  <td className="p-3">4 Metric Tons</td>
                  <td className="p-3"><Badge variant="verified" size="sm">Verified (92%)</Badge></td>
                  <td className="p-3">2 days ago</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">First-Class Red Clay Bricks</td>
                  <td className="p-3">4,000 units</td>
                  <td className="p-3"><Badge variant="warning" size="sm">Variance (3,200 visible)</Badge></td>
                  <td className="p-3">4 days ago</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Coarse River Sand</td>
                  <td className="p-3">12 Metric Tons</td>
                  <td className="p-3"><Badge variant="verified" size="sm">Verified (90%)</Badge></td>
                  <td className="p-3">1 week ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Sign-Off Footer */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Digital ledger signed by BuildGuard AI Transparency Engine</span>
          </div>
          <div className="text-right">
            Verified for Homeowner & Contractor Co-Ownership
          </div>
        </div>
      </Card>
    </div>
  );
};
