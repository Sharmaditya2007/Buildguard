import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { HardHat, ShieldCheck, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SignupPage = ({ onBack, onGoLogin }) => {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('homeowner');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill out all fields');
      return;
    }
    setLoading(true);
    setError('');
    const res = await signup({ name, email, password, role });
    setLoading(false);
    if (!res.success) {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold shadow-sm shadow-amber-500/20">
            <HardHat className="w-7 h-7" />
          </div>
        </div>
        <h2 className="mt-3 text-center text-2xl sm:text-3xl font-heading font-extrabold text-white">
          Create your account
        </h2>
        <p className="mt-1 text-center text-sm text-slate-400">
          Join BuildGuard AI to bring total transparency to your site
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="p-6 md:p-8 space-y-5 bg-slate-900/90 border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-950/60 border border-rose-850 text-rose-300 text-sm rounded-xl font-medium">
                {error}
              </div>
            )}

            {/* Role Selection Tabs */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-200">
                I am registering as a:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRole('homeowner')}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 font-bold text-sm transition-all cursor-pointer ${
                    role === 'homeowner'
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-sm shadow-amber-500/10'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Homeowner</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('contractor')}
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 font-bold text-sm transition-all cursor-pointer ${
                    role === 'contractor'
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-sm shadow-amber-500/10'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <HardHat className="w-5 h-5 text-amber-400" />
                  <span>Contractor</span>
                </button>
              </div>
            </div>

            <Input
              label="Full Name"
              type="text"
              placeholder="e.g. Alice Mitchell"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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
              label="Password (min 6 characters)"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="brand"
              size="lg"
              fullWidth
              loading={loading}
              className="mt-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border-none"
            >
              Create Account
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onGoLogin}
                className="font-bold text-amber-400 hover:text-amber-300 underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
