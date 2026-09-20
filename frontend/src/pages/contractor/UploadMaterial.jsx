import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Camera, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Upload, ArrowLeft } from 'lucide-react';
import { apiClient } from '../../services/api';
import { AiBagCounter } from '../../components/common/AiBagCounter';

export const UploadMaterial = ({ onComplete }) => {
  const [materialType, setMaterialType] = useState('Cement Bags');
  const [quantity, setQuantity] = useState('150');
  const [unit, setUnit] = useState('bags');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=60');
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiResult, setAiResult] = useState({
    estimatedQuantity: 150,
    confidenceScore: 0.96,
    summary: 'Palletized stack detected: ~150 bags calculated across 6 tiers with 96% confidence.'
  });
  const [submitted, setSubmitted] = useState(false);

  const materialOptions = [
    { value: 'Cement Bags', label: 'Cement Bags (e.g. UltraTech, ACC)' },
    { value: 'TMT Steel Rebar', label: 'TMT Steel Rebar (Fe-550D)' },
    { value: 'Red Clay Bricks', label: 'Red Clay Bricks' },
    { value: 'Coarse River Sand', label: 'Coarse River Sand' },
    { value: 'Crushed Stone Aggregate', label: 'Stone Aggregate / Gravel' },
  ];

  const handleCountConfirmed = (count, confidence, src) => {
    setQuantity(String(count));
    if (src) setImageUrl(src);
    setAiResult({
      estimatedQuantity: count,
      confidenceScore: confidence / 100,
      summary: `Approximately ${count} ${materialType.toLowerCase()} detected with ${confidence}% confidence.`
    });
  };

  const handleRunManualScan = async () => {
    setLoadingAi(true);
    const res = await apiClient.verifyMaterialDirect(imageUrl, materialType, Number(quantity));
    setLoadingAi(false);
    if (res.success && res.data) {
      setAiResult(res.data);
      setQuantity(String(res.data.estimatedQuantity));
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    await apiClient.uploadMaterialDelivery({
      materialType,
      quantity,
      unit,
      imageUrl,
      notes: aiResult?.summary || `Logged ${quantity} ${unit} of ${materialType}. AI verified.`
    });
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 1800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
          Log Material Delivery & AI Bag Counter
        </h1>
        <p className="text-sm md:text-base text-slate-400 mt-1">
          Upload any site delivery photo to automatically count bags, verify quantities, and record to the project ledger.
        </p>
      </div>

      {submitted ? (
        <Card className="p-8 text-center space-y-4 bg-emerald-950/30 border-emerald-800/60">
          <div className="w-16 h-16 rounded-full bg-emerald-900/50 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-700/60">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-300">
            Delivery Logged & Verified Successfully!
          </h2>
          <p className="text-sm text-emerald-200/90 max-w-md mx-auto">
            {quantity} {unit} of {materialType} has been added to the project material ledger with photographic AI proof.
          </p>
          <div className="pt-3">
            <Badge variant="verified" size="lg">
              Saved in LocalStorage Database
            </Badge>
          </div>
        </Card>
      ) : (
        <Card className="p-5 sm:p-8 space-y-6 bg-slate-900/90 border border-slate-800">
          {/* Step 1: Real AI Vision Bag Counter & Upload Zone */}
          <AiBagCounter
            initialImage={imageUrl}
            materialType={materialType}
            onCountConfirmed={handleCountConfirmed}
          />

          {/* Step 2: Delivery Details Form */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Delivery Details
              </span>
              <span className="text-xs text-slate-400">
                AI Auto-Populated from Scan
              </span>
            </div>

            <Select
              label="Material Classification"
              options={materialOptions}
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Verified Bag / Supply Count"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 150"
                min="1"
              />

              <Input
                label="Unit of Measure"
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="bags, tons, units"
              />
            </div>
          </div>

          {/* Step 3: Run / Re-verify Button */}
          <div className="pt-2">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              icon={Sparkles}
              loading={loadingAi}
              onClick={handleRunManualScan}
              className="border-amber-500/40 text-amber-300 bg-amber-950/30 hover:bg-amber-900/40"
            >
              Re-Scan Image with AI Computer Vision
            </Button>
          </div>

          {/* AI Result Card */}
          {aiResult && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <Badge variant="verified" size="sm" icon={ShieldCheck}>
                  AI Audit Status: Verified
                </Badge>
                <span className="text-xs font-bold text-emerald-300">
                  {Math.round(aiResult.confidenceScore * 100)}% Confidence
                </span>
              </div>

              <p className="text-sm font-bold text-emerald-100">
                {aiResult.summary}
              </p>

              <div className="text-xs text-emerald-300 bg-slate-850/80 border border-slate-700/60 p-2.5 rounded-xl flex items-center justify-between">
                <span>Visual Count: <strong className="text-emerald-200">{quantity} {unit}</strong></span>
                <span className="text-slate-400">Neutral civil audit verified</span>
              </div>
            </div>
          )}

          {/* Final Submit Button */}
          <Button
            variant="brand"
            size="xl"
            fullWidth
            icon={ArrowRight}
            onClick={handleSubmit}
            className="shadow-md"
          >
            Record Delivery to Material Ledger
          </Button>
        </Card>
      )}
    </div>
  );
};
