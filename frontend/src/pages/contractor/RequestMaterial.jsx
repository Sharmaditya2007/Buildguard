import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { PackagePlus, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { apiClient } from '../../services/api';

export const RequestMaterial = ({ onComplete }) => {
  const [materialType, setMaterialType] = useState('Cement');
  const [quantity, setQuantity] = useState('150');
  const [unit, setUnit] = useState('bags');
  const [notes, setNotes] = useState('Needed for second-floor pillar casting on Thursday.');
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const materialOptions = [
    { value: 'Cement', label: 'Cement (OPC / PPC)' },
    { value: 'Steel', label: 'TMT Reinforcement Steel' },
    { value: 'Bricks', label: 'Red Clay / Fly Ash Bricks' },
    { value: 'Sand', label: 'Plaster / Concrete River Sand' },
    { value: 'Aggregate', label: 'Coarse Stone Aggregate' }
  ];

  const handleCheckNorms = async () => {
    setLoadingAi(true);
    setAiAnalysis(null);

    const res = await apiClient.analyzeMaterialRequestDirect({
      houseSize: 2400,
      currentStage: 'Framing & Structure',
      previousDeliveries: 300,
      requestedQuantity: Number(quantity),
      materialType
    });

    setLoadingAi(false);
    if (res.success && res.data) {
      setAiAnalysis(res.data);
    } else {
      // Fallback calculation
      const isHigh = Number(quantity) > 400;
      setAiAnalysis({
        status: isHigh ? 'REVIEW_REQUIRED' : 'NORMAL',
        explanation: isHigh
          ? `The requested ${quantity} ${materialType.toLowerCase()} is higher than typical for a 2,400 sqft house at the current framing stage. We recommend checking on-site storage first to avoid extra materials sitting outside in the weather.`
          : `The requested ${quantity} ${materialType.toLowerCase()} is standard for a 2,400 sqft home during this stage.`
      });
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    await apiClient.requestMaterial({
      materialType,
      quantity,
      unit,
      notes,
      aiAnalysis
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
          Request Building Materials
        </h1>
        <p className="text-sm md:text-base text-slate-400 mt-1">
          Submit a supply requisition to the homeowner with instant pre-validation against civil guidelines.
        </p>
      </div>

      {submitted ? (
        <Card className="p-8 text-center space-y-4 bg-emerald-950/30 border-emerald-800/60">
          <div className="w-16 h-16 rounded-full bg-emerald-900/50 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-700/60">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-300">
            Requisition Sent to Homeowner!
          </h2>
          <p className="text-sm text-emerald-200/90 max-w-md mx-auto">
            The request for {quantity} {unit} of {materialType} is now awaiting 1-tap homeowner approval.
          </p>
        </Card>
      ) : (
        <Card className="p-6 md:p-8 space-y-6 bg-slate-900/90 border border-slate-800">
          <div className="space-y-4">
            <Select
              label="1. Material Required"
              options={materialOptions}
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g. 150"
                min="1"
              />

              <Input
                label="Unit"
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="bags, tons, units"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-200">
                Purpose / Milestone Reason
              </label>
              <textarea
                rows={3}
                className="w-full p-3 text-base text-white bg-slate-850 border-2 border-slate-700 rounded-xl focus:border-amber-400 focus:outline-none placeholder:text-slate-500"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Briefly explain what this will be used for..."
              />
            </div>
          </div>

          {/* AI Pre-Check Button */}
          <Button
            variant="outline"
            size="lg"
            fullWidth
            icon={Sparkles}
            loading={loadingAi}
            onClick={handleCheckNorms}
            className="border-amber-500/40 text-amber-300 bg-amber-950/30 hover:bg-amber-900/40"
          >
            Check Against Standard Stage Guidelines
          </Button>

          {/* AI Guidance Box */}
          {aiAnalysis && (
            <div className={`p-4 rounded-2xl border space-y-2 animate-fadeIn ${
              aiAnalysis.status === 'NORMAL'
                ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                : 'bg-amber-950/30 border-amber-800/60 text-amber-200'
            }`}>
              <div className="flex items-center justify-between">
                <Badge
                  variant={aiAnalysis.status === 'NORMAL' ? 'verified' : 'warning'}
                  size="sm"
                  icon={aiAnalysis.status === 'NORMAL' ? CheckCircle2 : AlertTriangle}
                >
                  {aiAnalysis.status === 'NORMAL' ? 'Standard Stage Amount' : 'Higher Than Typical'}
                </Badge>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  AI Neutral Review
                </span>
              </div>

              <p className="text-sm leading-relaxed font-medium">
                {aiAnalysis.explanation}
              </p>
            </div>
          )}

          {/* Submit Request Button */}
          <Button
            variant="brand"
            size="xl"
            fullWidth
            icon={PackagePlus}
            onClick={handleSubmit}
          >
            Send Requisition to Homeowner
          </Button>
        </Card>
      )}
    </div>
  );
};
