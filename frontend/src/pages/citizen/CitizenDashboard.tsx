import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Siren, PackageCheck, Tent, TrendingUp, Clock, Bell } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { citizenNav } from './citizenNav';
import { useAuth } from '../../context/AuthContext';
import { requestsApi, notificationsApi, reliefCampsApi } from '../../data/store';
import { RequestCardSkeleton, EmptyState } from '../../components/ui/Feedback';
import RequestCard from '../../components/ui/RequestCard';
import type { BaseRequest, Notification, ReliefCamp } from '../../types';
import { formatDistanceToNow } from 'date-fns';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BaseRequest[] | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [camps, setCamps] = useState<ReliefCamp[]>([]);

  useEffect(() => {
    if (!user) return;
    requestsApi.byCitizen(user._id).then(setRequests);
    notificationsApi.byUser(user._id).then(setNotifications);
    reliefCampsApi.list().then(setCamps);
  }, [user]);

  const activeRequests = requests?.filter((r) => r.status !== 'resolved' && r.status !== 'cancelled') || [];
  const resolvedCount = requests?.filter((r) => r.status === 'resolved').length || 0;

  const stats = [
    { label: 'Active Requests', value: activeRequests.length, icon: PackageCheck, color: 'text-accent-600 bg-accent-50 dark:bg-accent-900/30' },
    { label: 'Resolved', value: resolvedCount, icon: TrendingUp, color: 'text-success-600 bg-success-50 dark:bg-success-900/30' },
    { label: 'Relief Camps Nearby', value: camps.length, icon: Tent, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
    { label: 'Unread Notifications', value: notifications.filter((n) => !n.read).length, icon: Clock, color: 'text-brand-600 bg-brand-50 dark:bg-brand-900/30' },
  ];

  return (
    <DashboardLayout config={citizenNav}>
      {/* Quick action banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-6 bg-gradient-to-r from-brand-600 to-brand-700 border-0 text-white"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Need emergency help?</h2>
            <p className="text-brand-100 text-sm">Send an SOS alert with your live location to nearby volunteers instantly.</p>
          </div>
          <Link to="/app/citizen/sos" className="btn bg-white text-brand-700 hover:bg-brand-50 font-semibold shrink-0">
            <Siren className="h-4 w-4" /> Trigger SOS
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card p-5"
          >
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${stat.color} mb-3`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Active requests */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Active Requests</h2>
          <Link to="/app/citizen/requests" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">View all</Link>
        </div>
        {requests === null ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <RequestCardSkeleton /><RequestCardSkeleton />
          </div>
        ) : activeRequests.length === 0 ? (
          <EmptyState icon={PackageCheck} title="No active requests" description="When you submit a request, it will appear here for tracking." action={<Link to="/app/citizen/requests" className="btn-primary">Create a Request</Link>} />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {activeRequests.slice(0, 4).map((r) => (
              <RequestCard key={r._id} request={r} onView={() => window.location.assign(`/app/citizen/requests`)} />
            ))}
          </div>
        )}
      </div>

      {/* Recent notifications */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Notifications</h2>
        <div className="card divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.length === 0 ? (
            <EmptyState icon={Clock} title="No notifications yet" />
          ) : (
            notifications.slice(0, 5).map((n) => (
              <div key={n._id} className={`flex items-start gap-3 p-4 ${!n.read ? 'bg-brand-50/50 dark:bg-brand-900/10' : ''}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${n.read ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-brand-100 dark:bg-brand-900/40 text-brand-600'}`}>
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
