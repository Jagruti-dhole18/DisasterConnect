import { useEffect, useState } from 'react';
import { History, Star, Award } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { volunteerNav } from './volunteerNav';
import { useAuth } from '../../context/AuthContext';
import { requestsApi } from '../../data/store';
import RequestCard from '../../components/ui/RequestCard';
import { EmptyState, LoadingSpinner } from '../../components/ui/Feedback';
import type { BaseRequest } from '../../types';

export default function VolunteerHistory() {
  const { user } = useAuth();
  const [missions, setMissions] = useState<BaseRequest[] | null>(null);

  useEffect(() => {
    if (!user) return;
    requestsApi.byVolunteer(user._id).then((all) => {
      setMissions(all.filter((m) => m.status === 'resolved').sort((a, b) => +new Date(b.resolvedAt || b.updatedAt) - +new Date(a.resolvedAt || a.updatedAt)));
    });
  }, [user]);

  const totalPoints = user?.volunteerProfile?.rewardPoints || 0;
  const totalMissions = missions?.length || 0;
  const rank = totalPoints > 400 ? 'Gold' : totalPoints > 200 ? 'Silver' : totalPoints > 50 ? 'Bronze' : 'Newcomer';

  return (
    <DashboardLayout config={volunteerNav}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Mission History</h2>
        <p className="text-sm text-slate-500">Review your completed missions and earned rewards.</p>
      </div>

      {/* Reward summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-5 text-center">
          <Star className="h-6 w-6 mx-auto text-accent-500 mb-2" />
          <p className="text-2xl font-bold">{totalPoints}</p>
          <p className="text-xs text-slate-500">Reward Points</p>
        </div>
        <div className="card p-5 text-center">
          <Award className="h-6 w-6 mx-auto text-success-500 mb-2" />
          <p className="text-2xl font-bold">{totalMissions}</p>
          <p className="text-xs text-slate-500">Missions Done</p>
        </div>
        <div className="card p-5 text-center">
          <div className="text-2xl mb-2">{rank === 'Gold' ? '🥇' : rank === 'Silver' ? '🥈' : rank === 'Bronze' ? '🥉' : '⭐'}</div>
          <p className="text-lg font-bold">{rank}</p>
          <p className="text-xs text-slate-500">Rank</p>
        </div>
      </div>

      {missions === null ? <LoadingSpinner /> : missions.length === 0 ? (
        <EmptyState icon={History} title="No completed missions yet" description="Your resolved missions will appear here with reward details." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {missions.map((m) => (
            <RequestCard key={m._id} request={m} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
