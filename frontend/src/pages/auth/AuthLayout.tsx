import { motion } from 'framer-motion';
import { LifeBuoy } from 'lucide-react';
import type { ReactNode } from 'react';

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left visual panel */}
      <div className="hidden lg:flex relative items-center justify-center p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(220,38,38,0.4), transparent 50%), radial-gradient(circle at 70% 60%, rgba(249,115,22,0.3), transparent 50%)',
        }} />
        <div className="relative max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600">
              <LifeBuoy className="h-7 w-7" />
            </div>
            <span className="font-display text-2xl font-bold">DisasterConnect</span>
          </div>
          <h2 className="font-display text-3xl font-bold mb-4 leading-tight">
            Join a network built for moments that matter most.
          </h2>
          <p className="text-slate-300 leading-relaxed">
            When every second counts, DisasterConnect connects those who need help with those who can give it — instantly.
          </p>
          <div className="mt-10 space-y-4">
            {[
              'One-tap emergency SOS with live location',
              'Real-time volunteer coordination',
              'Verified relief camps and resource tracking',
              'Community-driven missing person portal',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-slate-300">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600/30 text-brand-300 text-xs">✓</div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-white dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
              <LifeBuoy className="h-6 w-6" />
            </div>
            <span className="font-display text-xl font-bold">DisasterConnect</span>
          </div>
          <h1 className="font-display text-2xl font-bold mb-1">{title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">{subtitle}</p>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
