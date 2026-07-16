import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Siren } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const roleDashboards: Record<string, string> = {
  citizen: '/app/citizen',
  volunteer: '/app/volunteer',
  ngo: '/app/ngo',
  admin: '/app/admin',
};

export default function SOSButton({ variant = 'fixed' }: { variant?: 'fixed' | 'inline' }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = () => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'citizen') {
      navigate('/app/citizen/sos');
    } else {
      navigate(roleDashboards[user.role] || '/app');
    }
  };

  if (variant === 'inline') {
    return (
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleClick}
        className="relative inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-brand-700 transition-colors"
      >
        <Siren className="h-5 w-5" />
        Emergency SOS
      </motion.button>
    );
  }

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: 'spring' }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-white shadow-glow md:hidden"
      aria-label="Emergency SOS"
    >
      <span className="absolute inset-0 rounded-full bg-brand-500 animate-pulse-ring" />
      <Siren className="h-7 w-7 relative z-10" />
    </motion.button>
  );
}
