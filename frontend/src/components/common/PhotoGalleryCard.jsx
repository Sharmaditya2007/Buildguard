import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Calendar, User, Eye, CheckCircle2, AlertTriangle } from 'lucide-react';

export const PhotoGalleryCard = ({
  imageUrl,
  title,
  subtitle,
  date,
  uploader,
  status = 'Verified',
  statusNote,
  metricLabel,
  metricValue,
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const isVerified = status === 'Verified' || status === 'Approved';
  const isDiscrepancy = status === 'Discrepancy Detected' || status === 'Flagged';

  return (
    <>
      <Card
        hover
        padding="p-3 md:p-4"
        className="flex flex-col h-full"
        onClick={() => setIsZoomOpen(true)}
      >
        {/* Photo Container */}
        <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 group">
          <img
            src={imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f2?w=800&auto=format&fit=crop&q=60'}
            alt={title || 'Construction Photo'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Top Badge */}
          <div className="absolute top-2 left-2">
            <Badge
              variant={isVerified ? 'verified' : isDiscrepancy ? 'warning' : 'neutral'}
              size="sm"
              icon={isVerified ? CheckCircle2 : isDiscrepancy ? AlertTriangle : null}
            >
              {status}
            </Badge>
          </div>

          {/* Tap to view overlay */}
          <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white/95 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <Eye className="w-3.5 h-3.5" /> Tap to zoom
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="pt-3 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-bold text-base md:text-lg text-slate-900 dark:text-white line-clamp-1">
                {title}
              </h4>
              {metricValue && (
                <span className="text-xs md:text-sm font-extrabold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md flex-shrink-0">
                  {metricValue}
                </span>
              )}
            </div>

            {subtitle && (
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Footer Metadata */}
          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {date ? new Date(date).toLocaleDateString() : 'Today'}
            </span>
            {uploader && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {uploader}
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Lightbox Zoom Modal */}
      <Modal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        title={title}
        subtitle={`Logged on ${date ? new Date(date).toLocaleDateString() : 'Today'} by ${uploader || 'Site Contractor'}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black">
            <img
              src={imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f2?w=1200&auto=format&fit=crop&q=80'}
              alt={title}
              className="w-full max-h-[60vh] object-contain mx-auto"
            />
          </div>

          {statusNote && (
            <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 p-4 rounded-xl text-sm md:text-base text-slate-700 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">AI Inspection Summary:</span>
              <p>{statusNote}</p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
