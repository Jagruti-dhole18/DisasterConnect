import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserSearch, MapPin, Calendar, User as UserIcon, Search } from 'lucide-react';
import { missingPersonsApi } from '../data/store';
import { LoadingSpinner, EmptyState } from '../components/ui/Feedback';
import type { MissingPerson } from '../types';
import { formatDistanceToNow } from 'date-fns';

export default function MissingPersonsPage() {
  const [persons, setPersons] = useState<MissingPerson[] | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'missing' | 'found'>('all');

  useEffect(() => {
    missingPersonsApi.list().then(setPersons);
  }, []);

  const filtered = (persons || []).filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.lastSeenLocation.address.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">Missing Person Board</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Help reunite families. View and search for missing persons reported by the community.</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input className="input pl-10" placeholder="Search by name or location..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {(['all', 'missing', 'found'] as const).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`badge cursor-pointer capitalize ${statusFilter === s ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {persons === null ? <LoadingSpinner /> : filtered.length === 0 ? (
          <EmptyState icon={UserSearch} title="No missing persons found" description="Try adjusting your search filters." />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, i) => (
              <motion.div key={p._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 text-lg font-semibold shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold truncate">{p.name}</h3>
                    <p className="text-xs text-slate-500">{p.age} yrs · {p.gender}</p>
                  </div>
                  <span className={`badge capitalize shrink-0 ${p.status === 'missing' ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300' : 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300'}`}>{p.status}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">{p.description}</p>
                <div className="space-y-1 text-xs text-slate-500">
                  <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {p.lastSeenLocation.address}</p>
                  <p className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {formatDistanceToNow(new Date(p.lastSeenDate), { addSuffix: true })}</p>
                  <p className="flex items-center gap-1.5"><UserIcon className="h-3 w-3" /> Reported by {p.reportedByName}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
