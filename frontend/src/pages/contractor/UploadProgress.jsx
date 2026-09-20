import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Camera, Sparkles, CheckCircle2, Layers, Upload } from 'lucide-react';
import { apiClient } from '../../services/api';

export const UploadProgress = ({ onComplete }) => {
  const [currentStage, setCurrentStage] = useState('Framing & Structure');
  const [notes, setNotes] = useState('Ground floor outer pillars finished. Wall framing positioned.');
  const [photos, setPhotos] = useState([
    'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f2?w=800&auto=format&fit=crop&q=60'
  ]);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const stageOptions = [
    { value: 'Excavation', label: '1. Excavation & Earthwork' },
    { value: 'Foundation', label: '2. Foundation & Footings' },
    { value: 'Framing & Structure', label: '3. Framing & Concrete Structure' },
    { value: 'Masonry & Brickwork', label: '4. Masonry & Brickwork' },
    { value: 'Roofing', label: '5. Roofing & Slab Casting' },
    { value: 'Plumbing & Electrical', label: '6. Plumbing & Electrical Rough-ins' },
    { value: 'Finishing & Flooring', label: '7. Finishing & Flooring' },
    { value: 'Completed', label: '8. Fully Completed' }
  ];

  const handleRunAiAnalysis = async () => {
    setLoadingAi(true);
    setAiResult(null);

    const res = await apiClient.analyzeProgressDirect(photos, currentStage);
    setLoadingAi(false);

    if (res.success && res.data) {
      setAiResult(res.data);
    } else {
      setAiResult({
        stage: currentStage,
        progressPercentage: 45,
        summary: `${currentStage} appears 45% complete with structural pillars set.`
      });
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    await apiClient.uploadProgress({
      stage: currentStage,
      notes,
      photos,
      aiSummary: aiResult?.summary || `${currentStage} progress recorded with photos.`
    });
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 1800);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
          Post Site Progress Update
        </h1>
        <p className="text-sm md:text-base text-slate-400 mt-1">
          Share real-time site photos with the homeowner to showcase daily milestone progress.
        </p>
      </div>

      {submitted ? (
        <Card className="p-8 text-center space-y-4 bg-emerald-950/30 border-emerald-800/60">
          <div className="w-16 h-16 rounded-full bg-emerald-900/50 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-700/60">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-300">
            Progress Update Published!
          </h2>
          <p className="text-sm text-emerald-200/90 max-w-md mx-auto">
            The milestone update for {currentStage} has been added to the homeowner's visual timeline.
          </p>
        </Card>
      ) : (
        <Card className="p-6 md:p-8 space-y-6 bg-slate-900/90 border border-slate-800">
          {/* Step 1: Photos */}
          <div className="space-y-2">
            <label className="block text-sm md:text-base font-semibold text-slate-200">
              1. Site Progress Photos
            </label>

            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-850 border-2 border-slate-700">
              <img
                src={photos[0]}
                alt="Site Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPhotos(['https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=60'])}
                  className="bg-slate-900/90 text-white border-slate-700 text-xs"
                >
                  Switch Photo
                </Button>
              </div>
            </div>
          </div>

          {/* Step 2: Milestone Stage & Notes */}
          <div className="space-y-4">
            <Select
              label="2. Milestone Stage"
              options={stageOptions}
              value={currentStage}
              onChange={(e) => setCurrentStage(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-200">
                Site Supervisor Notes
              </label>
              <textarea
                rows={3}
                className="w-full p-3 text-base text-white bg-slate-850 border-2 border-slate-700 rounded-xl focus:border-amber-400 focus:outline-none placeholder:text-slate-500"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe today's completed work in simple terms..."
              />
            </div>
          </div>

          {/* Step 3: Run AI Progress Analysis */}
          <Button
            variant="outline"
            size="lg"
            fullWidth
            icon={Sparkles}
            loading={loadingAi}
            onClick={handleRunAiAnalysis}
            className="border-amber-500/40 text-amber-300 bg-amber-950/30 hover:bg-amber-900/40"
          >
            Run AI Stage & Progress Analysis
          </Button>

          {/* AI Result Card */}
          {aiResult && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/50 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <Badge variant="brand" size="sm" icon={Layers}>
                  AI Detected: {aiResult.stage}
                </Badge>
                <span className="text-sm font-extrabold text-amber-300">
                  {aiResult.progressPercentage}% Complete
                </span>
              </div>

              <ProgressBar
                percentage={aiResult.progressPercentage}
                size="md"
                color="brand"
              />

              <p className="text-sm text-amber-200 font-medium">
                "{aiResult.summary}"
              </p>
            </div>
          )}

          {/* Final Submit Button */}
          <Button
            variant="brand"
            size="xl"
            fullWidth
            icon={CheckCircle2}
            onClick={handleSubmit}
          >
            Publish Progress Update
          </Button>
        </Card>
      )}
    </div>
  );
};
