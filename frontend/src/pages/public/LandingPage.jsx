import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { AiBagCounter } from '../../components/common/AiBagCounter';
import {
  HardHat,
  ShieldCheck,
  Camera,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Eye,
  AlertTriangle,
  Layers,
  Sparkles,
  Smartphone,
  Check,
  XCircle,
  Clock,
  FileText,
  Building2,
  ChevronRight,
  ChevronDown,
  Calculator,
  Scale,
  HelpCircle,
  Zap,
  DollarSign,
  ShieldAlert,
  Percent,
  Cpu
} from 'lucide-react';

export const LandingPage = ({ onGoHomeowner, onGoContractor, onGoLogin }) => {
  const [activeDemoStep, setActiveDemoStep] = useState(0);
  const [roiSqFt, setRoiSqFt] = useState(2400);
  const [openFaq, setOpenFaq] = useState(0);
  const [howItWorksTab, setHowItWorksTab] = useState('homeowner');

  // Dynamic ROI Calculations based on house sq.ft
  const estimatedDaysSaved = Math.round((roiSqFt / 2400) * 18);
  const estimatedMaterialSaved = Math.round((roiSqFt * 75)).toLocaleString('en-IN');
  const estimatedCementBags = Math.round(roiSqFt * 0.42).toLocaleString('en-IN');
  const disputeReduction = 92;

  const faqs = [
    {
      q: 'What happens if a photo is blurry, dark, or taken from a bad angle?',
      a: 'BuildGuard AI assesses image clarity in real time. If confidence is below 70%, the AI neutrally flags the item as "Pending Clearer Angle" rather than rejecting it, prompting the site supervisor to retake a photo without any penalty.'
    },
    {
      q: 'Does BuildGuard AI accuse contractors of theft or malpractice?',
      a: 'Never. Our core philosophy is strict neutrality. If a material requisition is higher than standard norms, BuildGuard generates objective advisory notes (e.g., "Recommended: Verify current on-site storage to protect bags from rain before re-ordering") without accusatory language.'
    },
    {
      q: 'How does the AI calculate if material quantities are normal?',
      a: 'The AI correlates your registered built-up area (e.g., 2,400 sq.ft), current construction milestone (e.g., Foundation, Ground Floor Slab), and past delivery logs against civil engineering standard consumption coefficients.'
    },
    {
      q: 'Can site contractors and supervisors use this on simple mobile phones?',
      a: 'Yes! BuildGuard AI is built with responsive mobile-first web technology. There is no heavy app download required — supervisors simply open the mobile site, snap a photo using their camera, and submit in two taps.'
    },
    {
      q: 'Can I export verified records for bank loans, insurance, or property sale?',
      a: 'Yes! BuildGuard provides 1-click exportable PDF Audit Reports complete with timestamped photo logs, computer vision count summaries, and homeowner approval signatures for full financial compliance.'
    }
  ];

  const demoSteps = [
    {
      step: '01',
      title: 'Contractor Snaps Photo',
      role: 'On-Site Contractor',
      desc: 'When a cement shipment or steel truck arrives, the site supervisor snaps a quick photo on their mobile phone.',
      preview: {
        badge: 'Photo Snapped',
        badgeVariant: 'brand',
        title: 'UltraTech 53 Grade Cement Delivery',
        metric: '150 Bags Declared',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=60',
        note: 'Invoice #UT-8842 attached on pallet'
      }
    },
    {
      step: '02',
      title: 'AI Computer Vision Audit',
      role: 'BuildGuard AI Engine',
      desc: 'Our AI model counts visible bags, calculates a confidence score, and checks consumption norms for a 2,400 sqft home.',
      preview: {
        badge: 'AI Verified • 96% Confidence',
        badgeVariant: 'verified',
        title: 'Computer Vision Count: ~150 Bags',
        metric: '96% Accuracy',
        image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=60',
        note: 'Neutral summary: "Approximately 150 cement bags detected with 96% confidence."'
      }
    },
    {
      step: '03',
      title: 'Homeowner Dashboard Sync',
      role: 'Homeowner App',
      desc: 'The homeowner receives an instant visual notification. The project Trust Score updates to 95% with zero delay.',
      preview: {
        badge: 'Trust Score: 95%',
        badgeVariant: 'verified',
        title: 'Greenwood Villa B-4 Ledger Updated',
        metric: '10 of 10 Verified',
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb180c5f2?w=800&auto=format&fit=crop&q=60',
        note: 'Foundation & Framing milestone advancing cleanly'
      }
    },
    {
      step: '04',
      title: '1-Tap Requisition Approval',
      role: 'Collaborative Sign-Off',
      desc: 'When extra supplies are requested, AI reviews the volume neutrally and the homeowner approves with a single tap.',
      preview: {
        badge: '1-Tap Decision',
        badgeVariant: 'warning',
        title: 'Requisition Review: 250 Bags Cement',
        metric: 'Approved with 1 Tap',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=60',
        note: 'AI Note: "Standard amount for upcoming second floor pillars."'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold shadow-sm shadow-amber-500/20">
              <HardHat className="w-6 h-6" />
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-white">
              BuildGuard<span className="text-amber-500">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-slate-300">
            <a href="#problem" className="hover:text-amber-400 transition-colors">The Problem</a>
            <a href="#solution" className="hover:text-amber-400 transition-colors">Solution</a>
            <a href="#comparison" className="hover:text-amber-400 transition-colors">Comparison</a>
            <a href="#how-it-works" className="hover:text-amber-400 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-amber-400 transition-colors">Features</a>
            <a href="#calculator" className="hover:text-amber-400 transition-colors">ROI Calculator</a>
            <a href="#philosophy" className="hover:text-amber-400 transition-colors">Neutral AI</a>
            <a href="#faq" className="hover:text-amber-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onGoLogin}
              className="text-slate-200 border-slate-700 hover:bg-slate-800"
            >
              Sign In
            </Button>
            <Button
              variant="brand"
              size="sm"
              onClick={onGoHomeowner}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border-none"
            >
              Live Demo
            </Button>
          </div>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative px-4 pt-12 pb-16 md:pt-20 md:pb-24 max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs sm:text-sm font-bold shadow-xs mx-auto">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Independent Construction Transparency Assistant</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          AI-Powered Transparency for <br className="hidden sm:inline" />
          <span className="text-amber-400">
            Home Construction
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          When homeowners cannot be on-site, BuildGuard AI independently verifies material deliveries, tracks construction progress, and helps homeowners make informed decisions.
        </p>

        {/* Big Dual CTAs */}
        <div className="pt-3 max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="brand"
            size="xl"
            fullWidth
            onClick={onGoHomeowner}
            icon={ShieldCheck}
            className="shadow-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border-none"
          >
            Try as Homeowner
          </Button>
          <Button
            variant="primary"
            size="xl"
            fullWidth
            onClick={onGoContractor}
            icon={HardHat}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700"
          >
            Try as Contractor
          </Button>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 font-medium">
          Instant 1-tap demo • No credit card or installation needed • WhatsApp-level simplicity
        </p>

        {/* Hero Interactive Preview Card with Live AI Bag Counter */}
        <div className="pt-8 max-w-4xl mx-auto">
          <div className="bg-slate-900/90 rounded-3xl border-2 border-slate-800 shadow-2xl overflow-hidden p-4 sm:p-7 text-left space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-sm sm:text-base font-bold text-white font-heading">
                  Interactive AI Computer Vision Bag Counter
                </span>
              </div>
              <Badge variant="verified" size="sm" icon={CheckCircle2}>
                Live Scanner Active
              </Badge>
            </div>

            <AiBagCounter />

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800">
              <span>Try uploading any delivery photo from your phone or laptop.</span>
              <Button
                variant="brand"
                size="sm"
                onClick={onGoHomeowner}
                icon={ShieldCheck}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border-none"
              >
                Enter Full Homeowner Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM SECTION */}
      <section id="problem" className="bg-[#0b0f19] border-y border-slate-800 py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              The Reality of Remote Construction
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-heading">
              Why building a home from a distance is stressful
            </h2>
            <p className="text-sm md:text-base text-slate-400">
              When work, distance, or family keep you away from the jobsite, critical gaps in transparency emerge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3 border-rose-900/50 bg-slate-900/80 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/40 flex items-center justify-center font-bold">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">1. Uncounted Material Deliveries</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Trucks drop off cement or steel when nobody is looking. Homeowners pay invoices without knowing if full quantities actually reached the site.
              </p>
            </Card>

            <Card className="p-6 space-y-3 border-amber-900/50 bg-slate-900/80 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">2. The "Black Box" Progress Gap</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Weeks pass with vague phone updates like "work is ongoing." You have no verifiable visual proof of whether the foundation or framing is finished.
              </p>
            </Card>

            <Card className="p-6 space-y-3 border-slate-800 bg-slate-900/80 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center font-bold">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">3. Mistrust & Awkward Disputes</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                When quantities or bills don't match, conversations turn defensive. Good contractors feel questioned, and homeowners feel uneasy.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 3. THE SOLUTION SECTION */}
      <section id="solution" className="py-16 md:py-24 px-4 bg-[#090d16]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              The BuildGuard AI Solution
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-heading">
              An independent, neutral eye on your construction site
            </h2>
            <p className="text-sm md:text-base text-slate-400">
              We bridge the gap between contractors and homeowners with objective visual auditing, without pointing fingers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-4 hover:border-amber-400/80 transition-all bg-slate-900/80 border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/60 text-amber-400 border border-amber-800/40 flex items-center justify-center font-bold">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Automated Photo Counting</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Contractors snap a delivery photo. Computer vision calculates visible stack quantities and cross-checks with the invoice.
              </p>
              <div className="text-xs font-bold text-amber-300 bg-amber-950/40 border border-amber-800/40 p-2.5 rounded-xl">
                Example: "Approximately 100 cement bags detected."
              </div>
            </Card>

            <Card className="p-6 space-y-4 hover:border-emerald-400/80 transition-all bg-slate-900/80 border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Clear Milestone Journey</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Watch structural milestones unfold in plain English — from Excavation to Foundation to Roofing — with calibrated progress percentages.
              </p>
              <div className="text-xs font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-xl">
                Example: "Foundation appears 85% complete."
              </div>
            </Card>

            <Card className="p-6 space-y-4 hover:border-blue-400/80 transition-all bg-slate-900/80 border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-blue-950/60 text-blue-400 border border-blue-800/40 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Neutral Civil Advisory</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Requisitions are checked against standard house guidelines. If high, we suggest checking site storage first — with zero accusatory language.
              </p>
              <div className="text-xs font-bold text-blue-300 bg-blue-950/40 border border-blue-800/40 p-2.5 rounded-xl">
                Example: "Check on-site storage to protect bags from weather."
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURE 1: BEFORE VS AFTER COMPARISON SECTION */}
      <section id="comparison" className="bg-[#0b0f19] border-y border-slate-800 py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1.5">
              <Scale className="w-4 h-4" /> Direct Transformation
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-heading">
              Traditional Construction vs. BuildGuard AI
            </h2>
            <p className="text-sm md:text-base text-slate-400">
              See the direct difference between stressful blind trust and automated AI transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Traditional Construction */}
            <div className="bg-rose-950/20 border-2 border-rose-900/50 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-rose-900/40 pb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-900/50 text-rose-400 flex items-center justify-center font-bold">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-rose-300 font-heading">Traditional Construction</h3>
                  <p className="text-xs text-rose-400/80">Opaque, manual, and prone to friction</p>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Uncounted Material Drops:</strong>
                    <span>Deliveries happen unrecorded. Bills are paid based on invoices that nobody counted.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">"Black Box" Progress:</strong>
                    <span>Weeks go by without verifiable proof of milestone completion, leading to endless phone calls.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Awkward Disputes:</strong>
                    <span>Disagreements over supply usage create tension and damage contractor relationships.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Slow Payment Sign-Offs:</strong>
                    <span>Homeowners delay contractor payments because they lack confidence in the work done.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* With BuildGuard AI */}
            <div className="bg-emerald-950/20 border-2 border-emerald-700/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-xs font-black px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                Recommended
              </div>

              <div className="flex items-center gap-3 border-b border-emerald-800/40 pb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-300 font-heading">With BuildGuard AI</h3>
                  <p className="text-xs text-emerald-400/80">Automated, transparent, and collaborative</p>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-slate-200">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Instant Computer Vision Audits:</strong>
                    <span>AI detects and counts cement bags & materials from photos in seconds with confidence scores.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Verified Milestone Journey:</strong>
                    <span>Stage detection (Foundation ➔ Framing ➔ Roofing) with clear visual proof and % progress.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Neutral Advisory (Zero Blame):</strong>
                    <span>Objective analysis comparing requested volumes to house square footage neutrally.</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">1-Tap Fast-Track Approvals:</strong>
                    <span>Homeowners approve requisitions and release milestone payments with total confidence.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION (WITH DUAL ROLE TOGGLE) */}
      <section id="how-it-works" className="py-16 md:py-24 px-4 bg-[#090d16]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Interactive Workflow
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-heading">
              How BuildGuard AI works for your role
            </h2>
            <p className="text-sm md:text-base text-slate-400">
              Select your perspective to see how simple and intuitive the workflow is.
            </p>

            {/* Role Switcher Pill */}
            <div className="inline-flex p-1.5 bg-slate-900 border border-slate-800 rounded-2xl mx-auto gap-2">
              <button
                type="button"
                onClick={() => setHowItWorksTab('homeowner')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  howItWorksTab === 'homeowner'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> I am a Homeowner
              </button>
              <button
                type="button"
                onClick={() => setHowItWorksTab('contractor')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  howItWorksTab === 'contractor'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <HardHat className="w-4 h-4" /> I am a Contractor
              </button>
            </div>
          </div>

          {howItWorksTab === 'homeowner' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="space-y-4 text-center md:text-left bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xl flex items-center justify-center mx-auto md:mx-0 shadow-md shadow-amber-500/20">
                  1
                </div>
                <h3 className="text-xl font-bold text-white">Receive Real-Time Photo Stream</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Every material delivery and construction milestone appears automatically on your phone dashboard with high-resolution site photos.
                </p>
              </div>

              <div className="space-y-4 text-center md:text-left bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xl flex items-center justify-center mx-auto md:mx-0 shadow-md shadow-amber-500/20">
                  2
                </div>
                <h3 className="text-xl font-bold text-white">Review Independent AI Verification</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  See exact computer vision bag counts, confidence percentages, milestone stages, and the calculated project Trust Score.
                </p>
              </div>

              <div className="space-y-4 text-center md:text-left bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xl flex items-center justify-center mx-auto md:mx-0 shadow-md shadow-amber-500/20">
                  3
                </div>
                <h3 className="text-xl font-bold text-white">1-Tap Decision & Peace of Mind</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Approve requisitions in seconds, track budget utilization without stress, and maintain a positive relationship with your builder.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="space-y-4 text-center md:text-left bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xl flex items-center justify-center mx-auto md:mx-0 shadow-md shadow-amber-500/20">
                  1
                </div>
                <h3 className="text-xl font-bold text-white">Snap 2-Tap Site Photos</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  When cement, rebar, or bricks arrive on site, snap a quick photo on your mobile browser. No paperwork or long forms needed.
                </p>
              </div>

              <div className="space-y-4 text-center md:text-left bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xl flex items-center justify-center mx-auto md:mx-0 shadow-md shadow-amber-500/20">
                  2
                </div>
                <h3 className="text-xl font-bold text-white">AI Automatically Audits & Logs</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Computer vision logs the delivery proof immediately to the project ledger, eliminating claims that materials never arrived.
                </p>
              </div>

              <div className="space-y-4 text-center md:text-left bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xl flex items-center justify-center mx-auto md:mx-0 shadow-md shadow-amber-500/20">
                  3
                </div>
                <h3 className="text-xl font-bold text-white">Faster Approvals & Faster Payouts</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Homeowners approve upcoming material orders fast because AI pre-validates requirements against standard engineering norms.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. FEATURES SECTION */}
      <section id="features" className="bg-[#0b0f19] border-y border-slate-800 py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Platform Features
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-heading">
              Everything you need for transparent construction
            </h2>
            <p className="text-sm md:text-base text-slate-400">
              Powerful civil engineering intelligence packaged in an ultra-clean, simple interface.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3 bg-slate-900/80 border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/40 flex items-center justify-center font-bold">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Computer Vision Counting</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Automatically detects and counts cement bags, steel rebar, and brick stacks from standard phone photos.
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-slate-900/80 border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Milestone Stage Detection</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Identifies Foundation, Framing, Roofing, and Finishing phases automatically and tracks % completion.
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-slate-900/80 border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-950/60 text-blue-400 border border-blue-800/40 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Live Trust Score Gauge</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Gives homeowners an immediate percentage score based on verified material receipts vs total deliveries.
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-slate-900/80 border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 text-purple-400 border border-purple-800/40 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Neutral Advisory Engine</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Pre-validates material requisitions against house square footage without ever accusing contractors of theft.
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-slate-900/80 border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-800/40 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">1-Tap Decision Alerts</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Homeowners can review and approve contractor material orders in seconds directly from their phone.
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-slate-900/80 border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-teal-950/60 text-teal-400 border border-teal-800/40 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Certified Audit Reports</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                One-click exportable PDF transparency summary recording all verified receipts, dates, and milestone logs.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURE 2: INTERACTIVE ROI & SAVINGS CALCULATOR */}
      <section id="calculator" className="py-16 md:py-24 px-4 bg-[#090d16]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1.5">
              <Calculator className="w-4 h-4" /> Financial & Time Savings
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-heading">
              Estimate Your Project Savings
            </h2>
            <p className="text-sm md:text-base text-slate-400">
              Adjust the slider to your property's built-up area and see the tangible impact of BuildGuard AI.
            </p>
          </div>

          <div className="bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            {/* Slider Control */}
            <div className="space-y-4 max-w-2xl mx-auto text-center">
              <div className="flex justify-between items-center text-sm font-bold text-slate-300">
                <span>Built-Up Area</span>
                <span className="text-2xl font-extrabold text-amber-400 font-heading">
                  {roiSqFt.toLocaleString()} <span className="text-sm font-normal text-slate-400">sq. ft.</span>
                </span>
              </div>
              <input
                type="range"
                min="800"
                max="8000"
                step="100"
                value={roiSqFt}
                onChange={(e) => setRoiSqFt(Number(e.target.value))}
                className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Small Villa (800 sq ft)</span>
                <span>Standard (2,400 sq ft)</span>
                <span>Large Estate (8,000 sq ft)</span>
              </div>
            </div>

            {/* Calculated Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 text-center">
                <div className="text-xs font-bold uppercase text-slate-400">Time Saved</div>
                <div className="text-3xl font-extrabold text-amber-400 font-heading">
                  ~{estimatedDaysSaved} <span className="text-base font-medium text-slate-300">Days</span>
                </div>
                <div className="text-xs text-slate-400">Eliminating approval bottlenecks</div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 text-center">
                <div className="text-xs font-bold uppercase text-slate-400">Material Waste Prevented</div>
                <div className="text-3xl font-extrabold text-emerald-400 font-heading">
                  ₹{estimatedMaterialSaved}
                </div>
                <div className="text-xs text-slate-400">Avoided spoilage & excess orders</div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 text-center">
                <div className="text-xs font-bold uppercase text-slate-400">Cement Bags Tracked</div>
                <div className="text-3xl font-extrabold text-blue-400 font-heading">
                  ~{estimatedCementBags}
                </div>
                <div className="text-xs text-slate-400">Verified via Computer Vision</div>
              </div>

              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2 text-center">
                <div className="text-xs font-bold uppercase text-slate-400">Dispute Reduction</div>
                <div className="text-3xl font-extrabold text-purple-400 font-heading">
                  {disputeReduction}%
                </div>
                <div className="text-xs text-slate-400">Peaceful project collaboration</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTRACTOR & HOMEOWNER BENEFITS SECTION */}
      <section id="benefits" className="bg-[#0b0f19] border-y border-slate-800 py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Win-Win Transparency
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-heading">
              Designed to benefit both sides of the contract
            </h2>
            <p className="text-sm md:text-base text-slate-400">
              Transparency isn't about surveillance — it's about building trust and faster approvals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contractor Benefits Card */}
            <Card className="p-6 sm:p-8 space-y-6 border-2 border-slate-800 hover:border-amber-400/80 transition-all bg-slate-900/90">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
                  <HardHat className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">For Contractors & Supervisors</h3>
                  <p className="text-xs text-slate-400">Build trust and get paid faster</p>
                </div>
              </div>

              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Instant Proof of Delivery:</strong> Photographic records protect you against claims that materials never arrived.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Faster Requisition Approvals:</strong> Homeowners approve material requests in minutes because AI pre-checks the numbers.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Reputation Protection:</strong> Objective visual records prove your high standard of workmanship.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Zero Learning Curve:</strong> Designed for gloves and dust with 2-tap photo logging.</span>
                </li>
              </ul>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={onGoContractor}
                icon={HardHat}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold border border-slate-700"
              >
                Launch Contractor Portal
              </Button>
            </Card>

            {/* Homeowner Benefits Card */}
            <Card className="p-6 sm:p-8 space-y-6 border-2 border-slate-800 hover:border-amber-400/80 transition-all bg-slate-900/90">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">For Homeowners</h3>
                  <p className="text-xs text-slate-400">Total peace of mind from anywhere</p>
                </div>
              </div>

              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>No Need for Daily Site Visits:</strong> Track structural milestones and verified deliveries while at work.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Prevents Material Spoilage:</strong> Neutral advisory warns against over-ordering cement before weather harms it.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Harmonious Relationship:</strong> Our non-accusatory reports preserve a positive, friendly partnership with your builder.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Full Financial Clarity:</strong> Certified audit ledger provides transparent proof for construction loans and warranties.</span>
                </li>
              </ul>

              <Button
                variant="brand"
                size="lg"
                fullWidth
                onClick={onGoHomeowner}
                icon={ShieldCheck}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border-none"
              >
                Launch Homeowner Portal
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURE 3: NEUTRAL AI PHILOSOPHY & TRUST GUARANTEE */}
      <section id="philosophy" className="py-16 md:py-24 px-4 bg-[#090d16]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border-2 border-amber-600/50 rounded-3xl p-8 md:p-12 space-y-6 shadow-2xl relative">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Our Ethical Guarantee
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading leading-tight">
              The "Neutral AI" Guarantee: <br />
              <span className="text-amber-400">An Assistant, Never an Accuser</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              Traditional site inspections often breed defensiveness. BuildGuard AI is explicitly programmed with strict civil engineering neutrality:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Zero Accusations
                </span>
                <p className="text-xs text-slate-400">
                  BuildGuard AI never uses words like "theft," "fraud," or "dishonesty."
                </p>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-amber-400 font-bold text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Objective Sanity Checks
                </span>
                <p className="text-xs text-slate-400">
                  Advisory suggestions focus strictly on weather storage and phase alignment.
                </p>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-blue-400 font-bold text-sm flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Transparent Evidence
                </span>
                <p className="text-xs text-slate-400">
                  Both parties see identical data and confidence metrics simultaneously.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. DEMO FLOW WALKTHROUGH SECTION */}
      <section id="demo-flow" className="bg-[#0b0f19] border-y border-slate-800 py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Interactive Demo Flow
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-heading">
              See the transparency engine in action
            </h2>
            <p className="text-sm md:text-base text-slate-400">
              Click through the 4-step live flow to see how BuildGuard AI processes site events.
            </p>
          </div>

          {/* Interactive Flow Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-3xl mx-auto">
            {demoSteps.map((s, idx) => (
              <button
                key={s.step}
                type="button"
                onClick={() => setActiveDemoStep(idx)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                  activeDemoStep === idx
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-extrabold shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span className={`text-xs font-bold block ${activeDemoStep === idx ? 'text-slate-950' : 'text-slate-500'}`}>
                  Step {s.step}
                </span>
                <span className="text-xs sm:text-sm font-extrabold truncate block">
                  {s.title}
                </span>
              </button>
            ))}
          </div>

          {/* Active Demo Step Card */}
          <div className="max-w-3xl mx-auto">
            <Card className="p-6 md:p-8 space-y-6 bg-slate-900/90 border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-slate-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {demoSteps[activeDemoStep].role}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white">
                    {demoSteps[activeDemoStep].title}
                  </h3>
                </div>
                <Badge variant="brand" size="md">
                  Step {demoSteps[activeDemoStep].step} of 04
                </Badge>
              </div>

              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                {demoSteps[activeDemoStep].desc}
              </p>

              {/* Simulated Live UI Preview */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative">
                  <img
                    src={demoSteps[activeDemoStep].preview.image}
                    alt="Demo preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant={demoSteps[activeDemoStep].preview.badgeVariant} size="sm">
                      {demoSteps[activeDemoStep].preview.badge}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-white text-base">
                    {demoSteps[activeDemoStep].preview.title}
                  </h4>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs md:text-sm space-y-1">
                    <span className="font-bold text-slate-400 block">Status:</span>
                    <span className="font-extrabold text-amber-400">{demoSteps[activeDemoStep].preview.metric}</span>
                  </div>
                  <p className="text-xs text-slate-400 italic">
                    {demoSteps[activeDemoStep].preview.note}
                  </p>
                </div>
              </div>

              {/* Navigation Next Step */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  size="md"
                  disabled={activeDemoStep === 0}
                  onClick={() => setActiveDemoStep(s => Math.max(s - 1, 0))}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                >
                  Previous Step
                </Button>

                {activeDemoStep < 3 ? (
                  <Button
                    variant="brand"
                    size="md"
                    onClick={() => setActiveDemoStep(s => Math.min(s + 1, 3))}
                    className="flex-row-reverse bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border-none"
                  >
                    Next Step <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    variant="brand"
                    size="md"
                    onClick={onGoHomeowner}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border-none"
                  >
                    Launch Interactive App
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURE 4: INTERACTIVE FAQ ACCORDION */}
      <section id="faq" className="py-16 md:py-24 px-4 bg-[#090d16]">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> Got Questions?
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white font-heading">
              Frequently Asked Questions
            </h2>
            <p className="text-sm md:text-base text-slate-400">
              Clear answers to the most common questions about BuildGuard AI.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="border border-slate-800 bg-slate-900/80 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850 transition-colors"
                  >
                    <span className="text-base sm:text-lg font-bold text-white font-heading">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-amber-400 flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800/60 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION SECTION */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-[#090d16] text-white py-16 md:py-24 px-4 text-center border-t border-slate-800">
        <div className="max-w-4xl mx-auto space-y-6">
          <Badge variant="brand" size="lg" className="bg-amber-500/20 text-amber-300 border-amber-400/30 mx-auto inline-flex">
            Get Started in Seconds
          </Badge>

          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight">
            Ready for stress-free <br />
            <span className="text-amber-400">construction transparency</span>?
          </h2>

          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Experience how BuildGuard AI brings peace of mind to homeowners and clarity to contractors with independent, computer-vision verification.
          </p>

          <div className="pt-4 max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Button
              variant="brand"
              size="xl"
              fullWidth
              onClick={onGoHomeowner}
              icon={ShieldCheck}
              className="shadow-lg shadow-amber-500/20 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border-none"
            >
              Homeowner Demo
            </Button>
            <Button
              variant="outline"
              size="xl"
              fullWidth
              onClick={onGoContractor}
              icon={HardHat}
              className="bg-slate-800/80 text-white border-slate-700 hover:bg-slate-750"
            >
              Contractor Demo
            </Button>
          </div>

          <p className="text-xs text-slate-400 pt-2">
            No installation required • Fully functional interactive walkthrough
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#070a12] py-10 px-4 text-center text-xs md:text-sm text-slate-400 space-y-2">
        <div className="flex items-center justify-center gap-2 font-bold text-white">
          <HardHat className="w-5 h-5 text-amber-500" />
          <span>BuildGuard AI</span>
        </div>
        <p>© 2026 BuildGuard AI. Independent construction transparency for homeowners and contractors.</p>
      </footer>
    </div>
  );
};
