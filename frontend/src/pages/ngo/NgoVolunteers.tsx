import { useEffect, useState } from 'react';
import { Users, Star, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ngoNav } from './ngoNav';
import { volunteersApi } from '../../data/store';
import { LoadingSpinner, EmptyState } from '../../components/ui/Feedback';
import type { Volunteer } from '../../types';

export default function NgoVolunteers() {
  const [volunteers, setVolunteers] = useState<Volunteer[] | null>(null);

  useEffect(() => {
    volunteersApi.list().then(setVolunteers);
  }, []);

  return (
    <DashboardLayout config={ngoNav}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Volunteer Network</h2>
        <p className="text-sm text-slate-500">View and coordinate volunteers available for relief operations.</p>
      </div>

      {volunteers === null ? <LoadingSpinner /> : volunteers.length === 0 ? (
        <EmptyState icon={Users} title="No volunteers registered" description="Volunteers will appear here once they register on the platform." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {volunteers.map((v) => (
            <div key={v._id} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white font-semibold">
                  {v.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold truncate">{v.name}</h3>
                    {v.verified && <CheckCircle2 className="h-4 w-4 text-success-500 shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${v.availability ? 'bg-success-500' : 'bg-slate-400'}`} />
                    <span className="text-xs text-slate-500">{v.availability ? 'Available' : 'Offline'}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {v.skills.map((s) => (
                  <span key={s} className="badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px]">{s}</span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <p className="flex items-center justify-center gap-1 font-semibold text-accent-600"><Star className="h-3 w-3" /> {v.rewardPoints}</p>
                  <p className="text-slate-500">Points</p>
                </div>
                <div>
                  <p className="font-semibold">{v.missionsCompleted}</p>
                  <p className="text-slate-500">Missions</p>
                </div>
                <div>
                  <p className="font-semibold">{v.rating}★</p>
                  <p className="text-slate-500">Rating</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
