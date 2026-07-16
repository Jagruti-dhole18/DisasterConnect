import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Tent, MapPin, Users, Package, Droplets, Pill, Stethoscope, Search } from 'lucide-react';
import { reliefCampsApi } from '../data/store';
import MapView from '../components/ui/MapView';
import { LoadingSpinner, EmptyState } from '../components/ui/Feedback';
import type { ReliefCamp, MapPoint } from '../types';

export default function ReliefCampsPage() {
  const [camps, setCamps] = useState<ReliefCamp[] | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    reliefCampsApi.list().then(setCamps);
  }, []);

  const filtered = (camps || []).filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.location.address.toLowerCase().includes(search.toLowerCase())
  );

  const points: MapPoint[] = filtered.map((c) => ({
    id: c._id, lat: c.location.lat, lng: c.location.lng, label: c.name, description: c.location.address, color: c.status === 'full' ? '#f59e0b' : '#22c55e',
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">Relief Camps</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Find active relief shelters with available capacity, food, water, and medical support.</p>
        </motion.div>

        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input className="input pl-10" placeholder="Search camps by name or location..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {camps === null ? <LoadingSpinner /> : filtered.length === 0 ? (
          <EmptyState icon={Tent} title="No relief camps found" description="Try adjusting your search or check back later." />
        ) : (
          <>
            <MapView points={points} height="360px" className="mb-8" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((camp, i) => {
                const pct = Math.round((camp.occupants / camp.capacity) * 100);
                return (
                  <motion.div key={camp._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold">{camp.name}</h3>
                      <span className={`badge ${camp.status === 'active' ? 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300' : 'bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-300'}`}>{camp.status}</span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-3"><MapPin className="h-3 w-3" /> {camp.location.address}</p>
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 flex items-center gap-1"><Users className="h-3 w-3" /> Occupancy</span>
                        <span className="font-medium">{camp.occupants}/{camp.capacity}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className={`h-full rounded-full ${pct > 90 ? 'bg-brand-500' : pct > 70 ? 'bg-accent-500' : 'bg-success-500'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg bg-accent-50 dark:bg-accent-900/20 p-2"><Package className="h-4 w-4 mx-auto text-accent-600 mb-1" /><p className="text-xs font-medium">{camp.foodStock}</p></div>
                      <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-2"><Droplets className="h-4 w-4 mx-auto text-blue-600 mb-1" /><p className="text-xs font-medium">{camp.waterStock}</p></div>
                      <div className="rounded-lg bg-success-50 dark:bg-success-900/20 p-2"><Pill className="h-4 w-4 mx-auto text-success-600 mb-1" /><p className="text-xs font-medium">{camp.medicineStock}</p></div>
                    </div>
                    {camp.medicalSupport && <div className="mt-3 flex items-center gap-1.5 text-xs text-success-600"><Stethoscope className="h-3.5 w-3.5" /> Medical support available</div>}
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
