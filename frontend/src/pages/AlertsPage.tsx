import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Search, Clock, ShieldAlert, Activity, X } from 'lucide-react';
import { disasterAlertsApi } from '../data/store';
import { LoadingSpinner, EmptyState } from '../components/ui/Feedback';
import type { DisasterAlert } from '../types';
import { formatDistanceToNow } from 'date-fns';

const severityConfig: Record<string, { label: string; className: string; border: string; dot: string; icon: string }> = {
  advisory: { label: 'Advisory', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', border: 'border-l-blue-500', dot: 'bg-blue-500', icon: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' },
  watch: { label: 'Watch', className: 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300', border: 'border-l-accent-500', dot: 'bg-accent-500', icon: 'bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400' },
  warning: { label: 'Warning', className: 'bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-300', border: 'border-l-warning-500', dot: 'bg-warning-500', icon: 'bg-warning-50 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400' },
  critical: { label: 'Critical', className: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300', border: 'border-l-brand-500', dot: 'bg-brand-500', icon: 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400' },
};

const typeConfig: Record<string, { icon: string; label: string }> = {
  flood: { icon: '🌊', label: 'Flood' },
  earthquake: { icon: '🏚️', label: 'Earthquake' },
  cyclone: { icon: '🌀', label: 'Cyclone' },
  fire: { icon: '🔥', label: 'Fire' },
  landslide: { icon: '⛰️', label: 'Landslide' },
  drought: { icon: '🏜️', label: 'Drought' },
  other: { icon: '⚠️', label: 'Other' },
};

const filterTypes = ['all', 'flood', 'cyclone', 'earthquake', 'fire', 'landslide', 'drought'];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<DisasterAlert[] | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    disasterAlertsApi.list().then(setAlerts);
  }, []);

  const filtered = (alerts || []).filter((a) => {
    const matchesSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.location.address.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || a.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const activeCount = (alerts || []).filter((a) => a.active).length;
  const criticalCount = (alerts || []).filter((a) => a.severity === 'critical' && a.active).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(220,38,38,0.4), transparent 50%), radial-gradient(circle at 80% 70%, rgba(249,115,22,0.3), transparent 50%)',
        }} />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/20 text-brand-400 backdrop-blur-sm">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-brand-300 uppercase tracking-wider">Live Monitoring</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">Disaster Alerts</h1>
            <p className="text-slate-300 max-w-2xl text-lg leading-relaxed">Stay informed about active disaster alerts and advisories in your region.</p>
            {alerts && (
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm px-4 py-2.5 border border-white/10">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-500" />
                  </div>
                  <span className="text-sm font-semibold text-white">{activeCount} Active</span>
                </div>
                {criticalCount > 0 && (
                  <div className="flex items-center gap-2 rounded-xl bg-brand-600/20 backdrop-blur-sm px-4 py-2.5 border border-brand-500/30">
                    <AlertTriangle className="h-4 w-4 text-brand-400" />
                    <span className="text-sm font-semibold text-brand-200">{criticalCount} Critical</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 -mt-4">
        {/* Search and filters */}
        <div className="card p-4 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input className="input pl-11" placeholder="Search by title or location..." value={search} onChange={(e) => setSearch(e.target.value)} />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {filterTypes.map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
                  typeFilter === type
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {type === 'all' ? 'All Types' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts list */}
        {alerts === null ? <LoadingSpinner /> : filtered.length === 0 ? (
          <EmptyState icon={AlertTriangle} title="No active alerts" description="There are currently no disaster alerts matching your search." />
        ) : (
          <div className="space-y-4">
            {filtered.map((a, i) => {
              const sev = severityConfig[a.severity] || severityConfig.advisory;
              const tc = typeConfig[a.type] || typeConfig.other;
              return (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`card overflow-hidden border-l-4 ${sev.border} ${!a.active ? 'opacity-60' : ''}`}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${sev.icon}`}>
                        {tc.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold text-base">{a.title}</h3>
                          <span className={`badge ${sev.className}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${sev.dot}`} />
                            {sev.label}
                          </span>
                          <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-500 capitalize">{tc.label}</span>
                          {!a.active && <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-400">Inactive</span>}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">{a.description}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />
                            {a.location.address}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        {a.affectedAreas.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-xs text-slate-400 font-medium mr-1">Affected:</span>
                            {a.affectedAreas.map((area) => (
                              <span key={area} className="badge bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px] font-medium">{area}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
