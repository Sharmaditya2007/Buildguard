import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { HardHat, ShieldCheck, Mail, Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = ({ onBack, onGoSignup }) => {
  const { login, loginAsHomeowner, loginAsContractor } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleManualLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setLoading(true);
    setError('');
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setError(res.message || 'Login failed. Try using 1-click Demo below.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold shadow-sm">
            <HardHat className="w-7 h-7" />
          </div>
        </div>
        <h2 className="mt-3 text-center text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
          Sign in to BuildGuard AI
        </h2>
        <p className="mt-1 text-center text-sm text-slate-500">
          Select your portal or enter your account credentials
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        {/* 1-Click Demo Accounts Card */}
        <Card className="p-5 bg-amber-50/60 border-amber-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              ⚡ Instant 1-Click Demo Portals
            </span>
            <Badge variant="brand" size="sm">No Password Needed</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              variant="brand"
              size="md"
              icon={ShieldCheck}
              onClick={loginAsHomeowner}
              className="text-sm font-bold"
            >
              Homeowner
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={HardHat}
              onClick={loginAsContractor}
              className="text-sm font-bold"
            >
              Contractor
            </Button>
          </div>
        </Card>

        {/* Regular Login Form */}
        <Card className="p-6 md:p-8 space-y-5">
          <form onSubmit={handleManualLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl font-medium">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. alice@homeowner.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="mt-2"
            >
              Sign In
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-slate-500">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={onGoSignup}
                className="font-bold text-amber-700 hover:text-amber-800 underline cursor-pointer"
              >
                Sign up free
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
