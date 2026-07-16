import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Mail } from 'lucide-react';
import AuthLayout from './AuthLayout';
import api from '../../lib/api';
import { useToast } from '../../context/ToastContext';

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState(params.get('email') || '');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');

  const verify = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/verify-email', { email, code });
      toast('Email verified. You can now sign in.', 'success');
      navigate('/login');
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.response?.data?.message || 'Unable to verify code.' : 'Unable to verify code.');
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setResending(true);
    try {
      await api.post('/auth/resend-verification-email', { email });
      toast('A new verification code has been sent.', 'success');
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.response?.data?.message || 'Unable to resend code.' : 'Unable to resend code.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout title="Verify your email" subtitle="Enter the 6-digit code we sent to your inbox.">
      <form onSubmit={verify} className="space-y-4">
        {error && <div className="rounded-xl bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 px-4 py-3 text-sm text-brand-700 dark:text-brand-300">{error}</div>}
        <div>
          <label className="label">Email Address</label>
          <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input className="input pl-10" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
        </div>
        <div><label className="label">Verification Code</label><input className="input text-center tracking-[0.5em]" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} placeholder="123456" required /></div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Verifying...' : <><CheckCircle2 className="h-4 w-4" /> Verify Email</>}</button>
      </form>
      <button type="button" className="mt-4 w-full text-sm text-brand-600 dark:text-brand-400 hover:underline disabled:opacity-50" onClick={resend} disabled={resending || !email}>{resending ? 'Sending...' : 'Resend verification code'}</button>
      <p className="mt-6 text-center text-sm text-slate-500"><Link to="/login" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Back to sign in</Link></p>
    </AuthLayout>
  );
}
