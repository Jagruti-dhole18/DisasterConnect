import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Building2, BadgeCheck, ArrowRight, Check } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import type { UserRole } from '../../types';

const roles: { value: UserRole; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'citizen', label: 'Citizen', desc: 'Request help during emergencies', icon: User },
  { value: 'volunteer', label: 'Volunteer', desc: 'Respond to emergency requests', icon: BadgeCheck },
  { value: 'ngo', label: 'NGO', desc: 'Manage relief camps & resources', icon: Building2 },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('citizen');
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    organizationName: '', registrationId: '', skills: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role,
        phone: form.phone,
        organizationName: form.organizationName,
        registrationId: form.registrationId,
        skills: form.skills ? form.skills.split(',').map((s) => s.trim()) : [],
      });
      toast(result.verificationCodeSent ? 'Verification code sent to your email.' : 'Account created. Please resend the verification code.', result.verificationCodeSent ? 'success' : 'error');
      navigate(`/verify-email?email=${encodeURIComponent(result.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join the DisasterConnect community and make a difference.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 px-4 py-3 text-sm text-brand-700 dark:text-brand-300">
            {error}
          </div>
        )}

        {/* Role selector */}
        <div>
          <label className="label">I want to join as</label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`relative rounded-xl border p-3 text-left transition-all ${
                  role === r.value
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 ring-2 ring-brand-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {role === r.value && <Check className="absolute top-2 right-2 h-4 w-4 text-brand-600" />}
                <r.icon className="h-5 w-5 mb-1.5 text-brand-600 dark:text-brand-400" />
                <p className="text-sm font-semibold">{r.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{r.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">{role === 'ngo' ? 'Organization Name' : 'Full Name'}</label>
          <div className="relative">
            {role === 'ngo' ? <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /> : <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />}
            <input className="input pl-10" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder={role === 'ngo' ? 'Hope Foundation' : 'Priya Sharma'} required />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input className="input pl-10" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" required />
            </div>
          </div>
          <div>
            <label className="label">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input className="input pl-10" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" />
            </div>
          </div>
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input className="input pl-10" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Min 8 characters" minLength={6} required />
          </div>
        </div>

        {role === 'ngo' && (
          <div>
            <label className="label">Registration ID</label>
            <input className="input" value={form.registrationId} onChange={(e) => update('registrationId', e.target.value)} placeholder="NGO-MH-2024-XXXXX" required />
          </div>
        )}

        {role === 'volunteer' && (
          <div>
            <label className="label">Skills (comma-separated)</label>
            <input className="input" value={form.skills} onChange={(e) => update('skills', e.target.value)} placeholder="First Aid, Rescue, Logistics, Driving" />
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating account...' : <>Create Account <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account? <Link to="/login" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
