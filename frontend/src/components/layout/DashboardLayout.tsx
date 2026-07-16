import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LifeBuoy, Menu, X, Bell, Moon, Sun, LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { notificationsApi } from '../../data/store';
import type { UserRole } from '../../types';

export interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface DashboardConfig {
  role: UserRole;
  title: string;
  nav: NavItem[];
}

export default function DashboardLayout({
  config,
  children,
}: {
  config: DashboardConfig;
  children: ReactNode;
}) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (to: string) => location.pathname === to;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <SidebarContent config={config} isActive={isActive} />
      </aside>

      {/* Sidebar - mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white dark:bg-slate-900 lg:hidden"
            >
              <SidebarContent config={config} isActive={isActive} onNavigate={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass border-b border-white/20 dark:border-white/10">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden btn-ghost !p-2 rounded-lg">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold capitalize">{config.title}</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Welcome back, {user?.name.split(' ')[0]}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggle} className="btn-ghost !p-2 rounded-lg">
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Link to="/app/notifications" className="relative btn-ghost !p-2 rounded-lg">
                <Bell className="h-5 w-5" />
              </Link>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 text-sm font-semibold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="btn-ghost !p-2 rounded-lg text-brand-600 dark:text-brand-400"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  config,
  isActive,
  onNavigate,
}: {
  config: DashboardConfig;
  isActive: (to: string) => boolean;
  onNavigate?: () => void;
}) {
  const { user } = useAuth();
  return (
    <>
      <Link to="/" className="flex items-center gap-2 px-6 h-16 border-b border-slate-200 dark:border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
          <LifeBuoy className="h-5 w-5" />
        </div>
        <span className="font-display font-bold text-base">DisasterConnect</span>
      </Link>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Menu</p>
        {config.nav.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <item.icon className={`h-5 w-5 shrink-0 transition-colors ${active ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'}`} />
              <span className="flex-1">{item.label}</span>
              {active && <motion.div layoutId="activeIndicator" className="h-1.5 w-1.5 rounded-full bg-brand-500" />}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 rounded-xl p-3 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 text-sm font-semibold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </>
  );
}
