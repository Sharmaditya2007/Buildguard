import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Printer, Download, ShieldCheck, FileText, CheckCircle2, Calendar } from 'lucide-react';
import { apiClient } from '../../services/api';

export const ReportsPage = () => {
  const [data, setData] = useState({
    projectName: 'Greenwood Villa B-4',
    currentStage: 'Framing & Structure',
    completionPercentage: 45,
    trustScore: 92,
    totalDeliveries: 10,
    verifiedDeliveries: 9,
    discrepancies: 1,
    contractor: 'Apex Builders Pvt Ltd',
    materialsList: [
      {
        materialType: 'UltraTech 53 Grade Cement',
        quantity: '150 bags',
        status: 'Verified',
        date: new Date().toLocaleDateString(),
        confidence: '96%'
      },
      {
        materialType: 'Fe-550D TMT Steel Rebar',
        quantity: '4 Metric Tons',
        status: 'Verified',
        date: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
        confidence: '92%'
      },
      {
        materialType: 'First-Class Red Clay Bricks',
        quantity: '4,000 units',
        status: 'Discrepancy Detected',
        date: new Date(Date.now() - 86400000 * 4).toLocaleDateString(),
        confidence: 'Variance (3,200 visible)'
      },
      {
        materialType: 'Coarse River Sand',
        quantity: '12 Metric Tons',
        status: 'Verified',
        date: new Date(Date.now() - 86400000 * 7).toLocaleDateString(),
        confidence: '90%'
      },
      {
        materialType: '20mm Crushed Granite Aggregate',
        quantity: '15 Metric Tons',
        status: 'Verified',
        date: new Date(Date.now() - 86400000 * 9).toLocaleDateString(),
        confidence: '94%'
      },
      {
        materialType: 'Ready-Mix Concrete M25 Grade',
        quantity: '8 Cubic Meters',
        status: 'Verified',
        date: new Date(Date.now() - 86400000 * 12).toLocaleDateString(),
        confidence: '95%'
      }
    ]
  });

  useEffect(() => {
    async function loadData() {
      const dashRes = await apiClient.getHomeownerDashboard();
      const matRes = await apiClient.getMaterialHistory();

      const d = dashRes?.data || {};
      const mats = matRes?.data || [];

      setData(prev => ({
        ...prev,
        projectName: d.projectName || prev.projectName,
        currentStage: d.currentStage || prev.currentStage,
        completionPercentage: d.completionPercentage || prev.completionPercentage,
        trustScore: d.trustScore || prev.trustScore,
        totalDeliveries: d.totalDeliveries ?? prev.totalDeliveries,
        verifiedDeliveries: d.verifiedDeliveries ?? prev.verifiedDeliveries,
        discrepancies: d.discrepancies ?? prev.discrepancies,
        materialsList: mats.length > 0 ? mats.slice(0, 8).map(m => ({
          materialType: m.materialType,
          quantity: m.quantity,
          status: m.status || 'Verified',
          date: m.date ? new Date(m.date).toLocaleDateString() : 'Recent',
          confidence: m.notes?.includes('%') ? m.notes.match(/\d+%/)[0] : 'Verified'
        })) : prev.materialsList
      }));
    }
    loadData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
            Project Transparency Audit Report
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-0.5">
            Verified materials, structural progress logs, and AI audit history.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            icon={Printer}
            onClick={handlePrint}
            className="dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
          >
            Print
          </Button>
          <Button
            variant="brand"
            size="md"
            icon={Download}
            onClick={handlePrint}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border-none"
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Formal Audit Document Card */}
      <Card className="p-6 md:p-10 space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {/* Document Header */}
        <div className="flex items-start justify-between border-b pb-6 border-slate-200 dark:border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
                BuildGuard<span className="text-amber-500">AI</span>
              </span>
              <Badge variant="verified" size="sm" icon={ShieldCheck}>
                Certified Audit
              </Badge>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider font-bold">
              Independent Civil Verification Ledger
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
            <p className="font-bold text-slate-800 dark:text-slate-200">Report ID: BG-2026-VILLA-B4</p>
            <p>Generated on: {new Date().toLocaleDateString()}</p>
            <p>Status: Active Construction</p>
          </div>
        </div>

        {/* Project Metadata Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs md:text-sm">
          <div>
            <span className="text-slate-400 dark:text-slate-500 block font-bold text-[11px] uppercase">Project Name</span>
            <span className="font-bold text-slate-900 dark:text-white">{data.projectName}</span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500 block font-bold text-[11px] uppercase">Built-Up Area</span>
            <span className="font-bold text-slate-900 dark:text-white">2,400 Sqft</span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500 block font-bold text-[11px] uppercase">Current Milestone</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">{data.currentStage} ({data.completionPercentage}%)</span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500 block font-bold text-[11px] uppercase">Contractor</span>
            <span className="font-bold text-slate-900 dark:text-white">{data.contractor}</span>
          </div>
        </div>

        {/* Audit Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Material Integrity Score</span>
            <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{data.trustScore}%</p>
            <span className="text-xs text-slate-400 dark:text-slate-500">{data.verifiedDeliveries} of {data.totalDeliveries} deliveries verified</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Total Materials Logged</span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{data.totalDeliveries}</p>
            <span className="text-xs text-slate-400 dark:text-slate-500">Photographic proof recorded</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center space-y-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Site Stage Completion</span>
            <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{data.completionPercentage}%</p>
            <span className="text-xs text-slate-400 dark:text-slate-500">{data.currentStage} in progress</span>
          </div>
        </div>

        {/* Verified Materials Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
            Material Audit Ledger
          </h3>
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs md:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-750 font-bold text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="p-3">Material Description</th>
                  <th className="p-3">Declared Qty</th>
                  <th className="p-3">AI Vision Status</th>
                  <th className="p-3">Logged Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {data.materialsList.map((m, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{m.materialType}</td>
                    <td className="p-3">{m.quantity}</td>
                    <td className="p-3">
                      {m.status === 'Verified' ? (
                        <Badge variant="verified" size="sm">Verified ({m.confidence || '95%'})</Badge>
                      ) : (
                        <Badge variant="warning" size="sm">Variance Detected</Badge>
                      )}
                    </td>
                    <td className="p-3">{m.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Sign-Off Footer */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 dark:text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
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
