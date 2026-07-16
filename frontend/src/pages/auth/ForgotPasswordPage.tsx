import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { useToast } from '../../context/ToastContext';
import api from '../../lib/api';

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast('Password reset link sent to your email.', 'success');
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Unable to send reset link right now.'
        : 'Unable to send reset link right now.';
      toast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email address and we'll send you a secure password reset link."
    >
      {sent ? (
        <div className="text-center py-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-success-100 dark:bg-success-900/40 text-success-600 dark:text-success-400 mb-4">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <h3 className="text-lg font-semibold mb-2">
            Check your inbox
          </h3>

          <p className="text-sm text-slate-500 mb-2">
            We've sent a password reset link to
          </p>

          <p className="font-medium text-slate-700 dark:text-slate-300 break-all mb-6">
            {email}
          </p>

          <p className="text-sm text-slate-500 mb-6">
            Open the email and click the <strong>Reset Password</strong> link.
            The link will expire in <strong>10 minutes</strong>.
          </p>

          <Link to="/login" className="btn-primary w-full">
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email Address</label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

              <input
                className="input pl-10"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        Remember your password?{' '}
        <Link
          to="/login"
          className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}