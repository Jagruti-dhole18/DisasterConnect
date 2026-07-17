import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { useToast } from "../../context/ToastContext";
import api from "../../lib/api";

export default function ResetPasswordPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const userEmail = searchParams.get("email");

    if (!userEmail) {
      setError("Email is missing. Please request password reset again.");

      return;
    }

    setEmail(userEmail);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");

      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");

      return;
    }

    if (!email) {
      setError("Email is missing.");

      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        email,

        password,
      });

      toast("Password reset successfully. Please sign in.", "success");

      navigate("/login");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Unable to reset password right now."
        : "Unable to reset password right now.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Create a new password for your account."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-xl bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 px-4 py-3 text-sm text-brand-700 dark:text-brand-300">
            {error}
          </div>
        )}

        <div>
          <label className="label">Email Address</label>

          <input className="input" type="email" value={email} readOnly />
        </div>

        <div>
          <label className="label">New Password</label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

            <input
              className="input pl-10"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              required
            />
          </div>
        </div>

        <div>
          <label className="label">Confirm Password</label>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

            <input
              className="input pl-10"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter password"
              required
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? (
            "Resetting..."
          ) : (
            <>
              Reset Password
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link
          to="/login"
          className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
