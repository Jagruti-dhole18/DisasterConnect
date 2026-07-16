import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Siren, Star, Zap, Award, TrendingUp, MapPin } from 'lucide-react';import DashboardLayout from '../../components/layout/DashboardLayout';
import { volunteerNav } from './volunteerNav';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { requestsApi, volunteersApi, notificationsApi } from '../../data/store';
import RequestCard from '../../components/ui/RequestCard';
import { RequestCardSkeleton, EmptyState } from '../../components/ui/Feedback';
import type { BaseRequest } from '../../types';

export default function VolunteerDashboard() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [availableRequests, setAvailableRequests] = useState<BaseRequest[] | null>(null);
  const [myMissions, setMyMissions] = useState<BaseRequest[]>([]);
  const [available, setAvailable] = useState(user?.volunteerProfile?.availability ?? true);

  const load = () => {
    requestsApi.list().then((all) => {
      setAvailableRequests(all.filter((r) => r.status === 'pending'));
    });
    if (user) requestsApi.byVolunteer(user._id).then(setMyMissions);
  };

  useEffect(load, [user]);

  const toggleAvailability = async () => {
    const newAvail = !available;
    setAvailable(newAvail);
    updateUser({ volunteerProfile: { ...user!.volunteerProfile!, availability: newAvail } });
    const vol = await volunteersApi.byUserId(user!._id);
    if (vol) await volunteersApi.update(vol._id, { availability: newAvail });
    toast(newAvail ? 'You are now available for missions.' : 'You are now offline.', 'info');
  };

  const handleAccept = async (req: BaseRequest) => {
    await requestsApi.update(req._id, { status: 'accepted', assignedVolunteer: user!._id, assignedVolunteerName: user!.name });
    await notificationsApi.create({
      user: req.citizen, title: 'Request Accepted', message: `${user!.name} has accepted your ${req.type} request.`, type: 'mission',
    });
    toast('Mission accepted! Check your active missions for details.', 'success');
    load();
  };

  const activeMissions = myMissions.filter((m) => m.status === 'accepted' || m.status === 'in_progress');
  const completedMissions = myMissions.filter((m) => m.status === 'resolved');

  const stats = [
    { label: 'Reward Points', value: user?.volunteerProfile?.rewardPoints || 0, icon: Star, color: 'text-accent-600 bg-accent-50 dark:bg-accent-900/30' },
    { label: 'Missions Completed', value: user?.volunteerProfile?.missionsCompleted || 0, icon: Award, color: 'text-success-600 bg-success-50 dark:bg-success-900/30' },
    { label: 'Active Missions', value: activeMissions.length, icon: Zap, color: 'text-brand-600 bg-brand-50 dark:bg-brand-900/30' },
    { label: 'Available Requests', value: availableRequests?.length || 0, icon: TrendingUp, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
  ];

  return (
    <DashboardLayout config={volunteerNav}>
      {/* Availability toggle */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${available ? 'bg-success-100 dark:bg-success-900/40 text-success-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold">{available ? 'You are Available' : 'You are Offline'}</p>
            <p className="text-sm text-slate-500">{available ? 'New emergency requests will be sent to you.' : 'Toggle on to receive mission requests.'}</p>
          </div>
        </div>
        <button onClick={toggleAvailability} className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${available ? 'bg-success-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
          <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${available ? 'translate-x-7' : 'translate-x-1'}`} />
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${stat.color} mb-3`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Available requests */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Available Emergency Requests</h2>
        {availableRequests === null ? (
          <div className="grid sm:grid-cols-2 gap-4"><RequestCardSkeleton /><RequestCardSkeleton /></div>
        ) : availableRequests.length === 0 ? (
          <EmptyState icon={Siren} title="No pending requests" description="When citizens submit emergency requests, they will appear here for you to accept." />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {availableRequests.map((r) => (
              <RequestCard key={r._id} request={r} actionLabel="Accept Mission" onAction={handleAccept} />
            ))}
          </div>
        )}
      </div>

      {/* Active missions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Your Active Missions</h2>
        {activeMissions.length === 0 ? (
          <EmptyState icon={MapPin} title="No active missions" description="Accept a request above to start a mission." />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {activeMissions.map((r) => (
              <RequestCard key={r._id} request={r} actionLabel="Mark Resolved" onAction={async (req) => {
                await requestsApi.update(req._id, { status: 'resolved' });
                updateUser({ volunteerProfile: { ...user!.volunteerProfile!, missionsCompleted: (user!.volunteerProfile?.missionsCompleted || 0) + 1, rewardPoints: (user!.volunteerProfile?.rewardPoints || 0) + 40 } });
                toast('Mission resolved! +40 reward points earned.', 'success');
                load();
              }} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
