import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Badge } from '../../components/ui/Badge';
import { PhotoGalleryCard } from '../../components/common/PhotoGalleryCard';
import { CheckCircle2, TrendingUp, Calendar, Layers } from 'lucide-react';
import { apiClient } from '../../services/api';

export const ProgressHistory = () => {
  const [activeStage, setActiveStage] = useState('Framing & Structure');
  const [updates, setUpdates] = useState([
    {
      id: 'prog-1',
      stage: 'Framing & Structure',
      progressPercentage: 45,
      date: new Date().toISOString(),
      uploader: 'Apex Builders',
      notes: 'Pillar reinforcement and perimeter frame completed. Ready for brickwork layout.',
      aiSummary: 'Framing appears 45% complete with structural reinforcement aligned.',
      images: [
        'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f2?w=800&auto=format&fit=crop&q=60'
      ]
    },
    {
      id: 'prog-2',
      stage: 'Foundation',
      progressPercentage: 100,
      date: new Date(Date.now() - 86400000 * 14).toISOString(),
      uploader: 'Apex Builders',
      notes: 'Foundation trench excavation, grade beam casting, and damp-proof membrane finished.',
      aiSummary: 'Foundation appears 100% complete with concrete cured successfully.',
      images: [
        'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=60'
      ]
    },
    {
      id: 'prog-3',
      stage: 'Excavation',
      progressPercentage: 100,
      date: new Date(Date.now() - 86400000 * 28).toISOString(),
      uploader: 'Apex Builders',
      notes: 'Site leveling and baseline pit excavation executed according to architectural plot specs.',
      aiSummary: 'Site excavation completed according to foundation coordinates.',
      images: [
        'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=60'
      ]
    }
  ]);

  useEffect(() => {
    async function loadProgress() {
      const res = await apiClient.getProgressHistory();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const formatted = res.data.map(p => ({
          id: p._id || p.id,
          stage: p.detectedStage || p.stage || 'Framing & Structure',
          progressPercentage: p.progressPercentage || p.completionPercentage || 45,
          date: p.uploadDate || p.date || new Date().toISOString(),
          uploader: p.uploadedBy?.name || p.uploader || 'Apex Builders',
          notes: p.notes || p.summary || 'Site photo logged.',
          aiSummary: p.aiSummary || p.summary || 'AI visual inspection evaluated.',
          images: (p.images && p.images.length > 0) ? p.images : (p.photos && p.photos.length > 0 ? p.photos : [])
        }));
        setUpdates(formatted);
      }
    }
    loadProgress();
  }, []);

  const stages = [
    { name: 'Excavation', done: true },
    { name: 'Foundation', done: true },
    { name: 'Framing & Structure', active: true, progress: 45 },
    { name: 'Roofing', done: false },
    { name: 'Plumbing & Electrical', done: false },
    { name: 'Finishing & Flooring', done: false }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 dark:text-white">
          Construction Progress Timeline
        </h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">
          Visual record of your home's structural evolution from ground-breaking to completion.
        </p>
      </div>

      {/* Stage Journey Tracker */}
      <Card className="p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Milestone Journey</h3>
          </div>
          <Badge variant="brand" size="md">Overall ~45% Complete</Badge>
        </div>

        {/* Milestone Steps Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
          {stages.map((st, i) => (
            <div
              key={st.name}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                st.done
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-300'
                  : st.active
                  ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 dark:border-amber-500 text-amber-950 dark:text-amber-300 ring-2 ring-amber-200 dark:ring-amber-800/40 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold">Step {i + 1}</span>
                {st.done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                {st.active && <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />}
              </div>
              <span className="text-xs md:text-sm font-extrabold truncate">{st.name}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Chronological Progress Log Entries */}
      <div className="space-y-4">
        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white font-heading">
          Site Photo Updates ({updates.length})
        </h3>

        <div className="space-y-4">
          {updates.map((update) => (
            <Card key={update.id} className="p-5 md:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Badge variant="neutral" size="md" className="font-bold">
                    {update.stage}
                  </Badge>
                  <span className="text-sm font-extrabold text-amber-700 dark:text-amber-400">
                    {update.progressPercentage}% Complete
                  </span>
                </div>
                <span className="text-xs md:text-sm text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                  <Calendar className="w-4 h-4" />
                  {new Date(update.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              {/* Contractor notes & AI Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs uppercase tracking-wider mb-1">
                    Contractor Site Note:
                  </span>
                  <p className="text-slate-600 dark:text-slate-300">{update.notes}</p>
                </div>

                <div className="bg-amber-50/70 dark:bg-amber-950/30 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/40">
                  <span className="font-bold text-amber-900 dark:text-amber-300 block text-xs uppercase tracking-wider mb-1">
                    AI Vision Analysis:
                  </span>
                  <p className="text-amber-800 dark:text-amber-200">{update.aiSummary}</p>
                </div>
              </div>

              {/* Photo Reel */}
              {update.images && update.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {update.images.map((img, idx) => (
                    <PhotoGalleryCard
                      key={idx}
                      title={`${update.stage} — Photo ${idx + 1}`}
                      subtitle={update.aiSummary}
                      date={update.date}
                      uploader={update.uploader}
                      status="Verified"
                      imageUrl={img}
                      statusNote={update.aiSummary}
                    />
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
