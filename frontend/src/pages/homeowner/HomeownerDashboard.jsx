import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/ui/StatCard';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TrustGauge } from '../../components/common/TrustGauge';
import { QuickActionTile } from '../../components/common/QuickActionTile';
import { PhotoGalleryCard } from '../../components/common/PhotoGalleryCard';
import {
  PackageCheck,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Camera,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Upload
} from 'lucide-react';
import { apiClient } from '../../services/api';
import { AiBagCounter } from '../../components/common/AiBagCounter';

export const HomeownerDashboard = ({ onNavigate }) => {
  const [showInlineScanner, setShowInlineScanner] = useState(false);
  const [directUserImage, setDirectUserImage] = useState(null);
  const homeFileInputRef = useRef(null);

  const handleHomeDirectUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        setDirectUserImage(dataUrl);
        setShowInlineScanner(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  const [data, setData] = useState({
    projectName: 'Greenwood Villa B-4',
    currentStage: 'Framing & Structure',
    completionPercentage: 45,
    trustScore: 90,
    totalDeliveries: 10,
    verifiedDeliveries: 9,
    discrepancies: 1,
    pendingRequests: 1,
    aiSummary: 'Foundation and framing appear 45% complete with structural reinforcement aligned.',
    recentDeliveries: [
      {
        id: '1',
        materialType: 'UltraTech 53 Grade Cement',
        quantity: '150 bags',
        status: 'Verified',
        date: new Date().toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=60',
        uploader: 'Apex Builders',
        notes: 'Approximately 150 bags detected with 96% confidence.'
      },
      {
        id: '2',
        materialType: 'Fe-550D TMT Steel Rebar',
        quantity: '4 Metric Tons',
        status: 'Verified',
        date: new Date(Date.now() - 86400000).toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=60',
        uploader: 'Apex Builders',
        notes: 'Steel bundles verified on trailer bed.'
      }
    ]
  });

  useEffect(() => {
    async function fetchDashboard() {
      const res = await apiClient.getHomeownerDashboard();
      if (res.success && res.data) {
        const d = res.data;
        setData(prev => ({
          ...prev,
          projectName: d.project?.projectName || d.projectName || prev.projectName,
          currentStage: d.progress?.currentStage || d.currentStage || prev.currentStage,
          completionPercentage: d.progress?.completionPercentage || d.completionPercentage || prev.completionPercentage,
          aiSummary: d.progress?.aiSummary || d.aiSummary || prev.aiSummary,
          trustScore: d.materials?.trustScorePercentage || d.trustScore || prev.trustScore,
          totalDeliveries: d.materials?.totalDeliveries ?? d.totalDeliveries ?? prev.totalDeliveries,
          verifiedDeliveries: d.materials?.aiVerified ?? d.verifiedDeliveries ?? prev.verifiedDeliveries,
          discrepancies: d.materials?.aiDiscrepancies ?? d.discrepancies ?? prev.discrepancies,
          pendingRequests: d.requests?.pending ?? d.pendingRequests ?? prev.pendingRequests,
          recentDeliveries: d.recentDeliveries && d.recentDeliveries.length > 0 ? d.recentDeliveries : prev.recentDeliveries
        }));
      }
    }
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6">
      {/* Friendly Welcome Card */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-stripe space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Homeowner Project Oversight
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold mt-1">
              {data.projectName}
            </h1>
            <p className="text-slate-300 text-sm md:text-base mt-0.5">
              Sector 42, Gurgaon • Contractor: Apex Builders
            </p>
          </div>

          <Badge variant="brand" size="lg" className="self-start sm:self-auto bg-amber-500/20 text-amber-300 border-amber-400/30">
            Active Milestone: {data.currentStage}
          </Badge>
        </div>

        {/* Milestone Progress Bar */}
        <div className="pt-2">
          <ProgressBar
            percentage={data.completionPercentage}
            label="Overall Construction Progress"
            color="brand"
            size="lg"
            className="text-white [&_span]:text-white [&_.bg-slate-100]:bg-slate-700/50"
          />
        </div>

        <p className="text-xs md:text-sm text-slate-300 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60 leading-relaxed">
          <span className="font-bold text-amber-400">AI Site Summary:</span> {data.aiSummary}
        </p>
      </div>

      {/* Upload Image to Check - AI Bag Counter Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-white border-2 border-amber-400/50 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold flex-shrink-0 shadow-md">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg md:text-xl font-bold font-heading text-slate-900">
                Upload Image to Check
              </h3>
              <Badge variant="brand" size="sm">AI Bag Counter</Badge>
            </div>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Upload any delivery photo or cement bags picture to automatically detect, count, and audit bags with computer vision bounding boxes.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto flex-shrink-0">
          <input
            type="file"
            ref={homeFileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleHomeDirectUpload}
          />

          <Button
            variant="brand"
            size="md"
            icon={Upload}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border-none shadow-md cursor-pointer"
            onClick={() => homeFileInputRef.current?.click()}
          >
            Upload from PC
          </Button>

          <Button
            variant={showInlineScanner ? 'outline' : 'secondary'}
            size="md"
            className="cursor-pointer"
            onClick={() => setShowInlineScanner(!showInlineScanner)}
          >
            {showInlineScanner ? 'Hide Scanner' : 'Quick Preview'}
          </Button>

          <Button
            variant="primary"
            size="md"
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold border-none shadow-md cursor-pointer"
            onClick={() => onNavigate('check-image')}
          >
            <Camera className="w-5 h-5 text-amber-400" />
            Full Screen
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Inline AI Bag Counter Expandable */}
      {showInlineScanner && (
        <Card className="p-5 sm:p-7 bg-white border-2 border-amber-400/70 shadow-lg rounded-3xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 flex items-center gap-2 text-base md:text-lg">
              <Camera className="w-5 h-5 text-amber-500" />
              Direct AI Bag Counter & Visual Check
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInlineScanner(false)}
              className="cursor-pointer text-slate-500 hover:text-slate-800"
            >
              ✕ Close
            </Button>
          </div>
          <AiBagCounter initialImage={directUserImage || "/cement-5-bags.jpg"} />
        </Card>
      )}

      {/* Trust Gauge & Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <TrustGauge
            percentage={data.trustScore}
            totalDeliveries={data.totalDeliveries}
            aiVerified={data.verifiedDeliveries}
            discrepancies={data.discrepancies}
          />
        </div>

        <StatCard
          title="Material Requisitions"
          value={data.pendingRequests}
          subtitle={data.pendingRequests > 0 ? "1 request needs your approval" : "All requests approved"}
          icon={FileCheck}
          badge={data.pendingRequests > 0 ? <Badge variant="warning" size="sm">Action Needed</Badge> : null}
          onClick={() => onNavigate('alerts')}
        />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          title="Total Deliveries"
          value={data.totalDeliveries}
          subtitle="Materials on site"
          icon={PackageCheck}
          onClick={() => onNavigate('materials')}
        />
        <StatCard
          title="AI Verified"
          value={data.verifiedDeliveries}
          subtitle="Confirmed counts"
          icon={ShieldCheck}
          iconBg="bg-emerald-50 text-emerald-600 border border-emerald-200/80"
          onClick={() => onNavigate('materials')}
        />
        <StatCard
          title="Site Stage"
          value={`${data.completionPercentage}%`}
          subtitle={data.currentStage}
          icon={TrendingUp}
          iconBg="bg-blue-50 text-blue-600 border border-blue-200/80"
          onClick={() => onNavigate('progress')}
        />
        <StatCard
          title="Active Alerts"
          value={data.discrepancies}
          subtitle="Non-urgent notes"
          icon={AlertTriangle}
          iconBg="bg-amber-50 text-amber-700 border border-amber-200"
          onClick={() => onNavigate('alerts')}
        />
      </div>

      {/* WhatsApp-Style Large Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-lg md:text-xl font-bold text-slate-900 font-heading">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickActionTile
            title="Upload Image to Check"
            subtitle="AI cement bag counter & audit"
            icon={Camera}
            iconBg="bg-amber-500 text-slate-950 font-bold"
            onClick={() => onNavigate('check-image')}
          />
          <QuickActionTile
            title="Material Deliveries"
            subtitle="View invoices, photos & AI counts"
            icon={PackageCheck}
            onClick={() => onNavigate('materials')}
          />
          <QuickActionTile
            title="Site Photos Timeline"
            subtitle="Visual proof of structural progress"
            icon={TrendingUp}
            iconBg="bg-emerald-100 text-emerald-800"
            onClick={() => onNavigate('progress')}
          />
          <QuickActionTile
            title="AI Alerts & Approvals"
            subtitle="Review requisitions & quantities"
            icon={AlertTriangle}
            badge={data.pendingRequests > 0 ? <Badge variant="warning" size="sm">1 New</Badge> : null}
            iconBg="bg-amber-100 text-amber-900"
            onClick={() => onNavigate('alerts')}
          />
        </div>
      </div>

      {/* Recent Delivery Photos Reel */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg md:text-xl font-bold text-slate-900 font-heading">
            Recent Delivery Audits
          </h3>
          <button
            onClick={() => onNavigate('materials')}
            className="text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            See all ({data.totalDeliveries}) <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.recentDeliveries.map((delivery) => (
            <PhotoGalleryCard
              key={delivery.id}
              title={delivery.materialType}
              subtitle={delivery.notes}
              date={delivery.date}
              uploader={delivery.uploader}
              status={delivery.status}
              metricValue={delivery.quantity}
              imageUrl={delivery.imageUrl}
              statusNote={delivery.notes}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
