import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';import { LifeBuoy, Menu, X, Bell, Moon, Sun, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';

const roleDashboards: Record<string, string> = {
  citizen: '/app/citizen',
  volunteer: '/app/volunteer',
  ngo: '/app/ngo',
  admin: '/app/admin',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const isLanding = location.pathname === '/';
  const isTransparent = isLanding;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isTransparent ? 'bg-transparent' : 'glass border-b border-white/20 dark:border-white/10'}`}>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: -8, scale: 1.05 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md"
            >
              <LifeBuoy className="h-5 w-5" />
            </motion.div>
            <span className="font-display text-lg font-bold tracking-tight">
              Disaster<span className="text-brand-600 dark:text-brand-500">Connect</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" label="Home" />
            <NavLink to="/alerts" label="Alerts" />
            <NavLink to="/#features" label="Features" />
            <NavLink to="/#stories" label="Stories" />
            <NavLink to="/#contact" label="Contact" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="btn-ghost !p-2 rounded-lg"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-xl pl-2 pr-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-56 card p-2 shadow-lg"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-900/50 dark:text-brand-300 mt-1 capitalize">{user.role}</span>
                    </div>
                    <button onClick={() => navigate(roleDashboards[user.role] || '/app')} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <UserIcon className="h-4 w-4" /> Dashboard
                    </button>
                    <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/30 text-brand-600 dark:text-brand-400 transition-colors">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-ghost">Sign In</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </div>
            )}

            <button onClick={() => setMenuOpen((o) => !o)} className="md:hidden btn-ghost !p-2 rounded-lg">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 py-4 space-y-1"
          >
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium">Home</Link>
            <Link to="/alerts" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium">Alerts</Link>
            <Link to="/#features" onClick={(e) => { e.preventDefault(); setMenuOpen(false); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium">Features</Link>
            <Link to="/#stories" onClick={(e) => { e.preventDefault(); setMenuOpen(false); document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' }); }} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium">Stories</Link>
            <Link to="/#contact" onClick={(e) => { e.preventDefault(); setMenuOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium">Contact</Link>
            {user ? (
              <>
                <Link to={roleDashboards[user.role] || '/app'} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium">Dashboard</Link>
                <button onClick={() => { logout(); navigate('/'); }} className="w-full text-left px-3 py-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/30 text-brand-600 text-sm font-medium">Logout</button>
              </>
            ) : (
              <div className="flex gap-2 px-3 pt-2">
                <Link to="/login" className="btn-secondary flex-1">Sign In</Link>
                <Link to="/register" className="btn-primary flex-1">Get Started</Link>
              </div>
            )}
          </motion.div>
        )}
      </nav>
    </header>
  );
}

function NavLink({ to, label }: { to: string; label: string }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    if (to.includes('#')) {
      e.preventDefault();
      const hash = to.substring(to.indexOf('#'));
      const targetId = hash.substring(1);
      const scrollTo = () => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      };
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(scrollTo, 100);
      } else {
        scrollTo();
      }
    }
  };

  return (
    <Link to={to} onClick={handleClick} className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
      {label}
    </Link>
  );
}
