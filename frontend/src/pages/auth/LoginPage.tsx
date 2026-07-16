import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dashboards: Record<string, string> = {
    citizen: '/app/citizen',
    volunteer: '/app/volunteer',
    ngo: '/app/ngo',
    admin: '/app/admin',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      toast(`Welcome back, ${user.name.split(' ')[0]}!`, 'success');
      const from = (location.state as { from?: string })?.from;
      navigate(from || dashboards[user.role] || '/app');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email: string) => {
    setEmail(email);
    setPassword('demo123');
  };

  return (
    <AuthLayout title="Sign in to your account" subtitle="Welcome back. Enter your credentials to continue.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 px-4 py-3 text-sm text-brand-700 dark:text-brand-300">
            {error}
          </div>
        )}
        <div>
          <label className="label">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input className="input pl-10" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input className="input pl-10 pr-10" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <input type="checkbox" className="rounded border-slate-300" /> Remember me
          </label>
          <Link to="/forgot-password" className="text-brand-600 dark:text-brand-400 hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Signing in...' : <>Sign In <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>

      {/* <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-white dark:bg-slate-950 px-3 text-slate-400">Demo accounts (click to fill)</span></div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
            {[
            { role: 'Citizen', email: 'citizen@demo.com' },
            { role: 'Volunteer', email: 'volunteer@demo.com' },
            { role: 'NGO', email: 'ngo@demo.com' },
            { role: 'Admin', email: 'admin@disasterconnect.org' },
          ].map((d) => (
            <button key={d.role} onClick={() => fillDemo(d.email)} className="btn-secondary text-xs">
              {d.role}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 text-center mt-2">Password for all demo accounts: demo123</p>
      </div> */}

      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account? <Link to="/register" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Create one</Link>
      </p>
    </AuthLayout>
  );
}
