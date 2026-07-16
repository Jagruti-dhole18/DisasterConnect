import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, HeartHandshake, Tent, Siren, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminNav } from './adminNav';
import { usersApi, reliefCampsApi, requestsApi, disasterAlertsApi, volunteersApi } from '../../data/store';
import { LoadingSpinner } from '../../components/ui/Feedback';
import type { User, ReliefCamp, BaseRequest, DisasterAlert } from '../../types';
import { formatDistanceToNow } from 'date-fns';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({ users: 0, volunteers: 0, camps: 0, sos: 0, alerts: 0, pendingNGOs: 0, pendingVolunteers: 0, activeRequests: 0 });
  const [recentAlerts, setRecentAlerts] = useState<DisasterAlert[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);

  useEffect(() => {
    Promise.all([
      usersApi.list(), reliefCampsApi.list(), requestsApi.list(),
      disasterAlertsApi.list(), volunteersApi.list(),
    ]).then(([users, camps, requests, alerts, volunteers]) => {
      setData({
        users: users.length,
        volunteers: volunteers.length,
        camps: camps.length,
        sos: requests.filter((r) => r.type === 'sos').length,
        alerts: alerts.filter((a) => a.active).length,
        pendingNGOs: users.filter((u) => u.role === 'ngo' && u.ngoProfile && !u.ngoProfile.approved).length,
        pendingVolunteers: volunteers.filter((v) => !v.verified).length,
        activeRequests: requests.filter((r) => r.status !== 'resolved' && r.status !== 'cancelled').length,
      });
      setRecentAlerts(alerts.slice(0, 3));
      setRecentUsers(users.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5));
      setLoading(false);
    });
  }, []);

  if (loading) return <DashboardLayout config={adminNav}><LoadingSpinner /></DashboardLayout>;

  const stats = [
    { label: 'Total Users', value: data.users, icon: Users, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
    { label: 'Active Volunteers', value: data.volunteers, icon: HeartHandshake, color: 'text-success-600 bg-success-50 dark:bg-success-900/30' },
    { label: 'Relief Camps', value: data.camps, icon: Tent, color: 'text-accent-600 bg-accent-50 dark:bg-accent-900/30' },
    { label: 'SOS Requests', value: data.sos, icon: Siren, color: 'text-brand-600 bg-brand-50 dark:bg-brand-900/30' },
    { label: 'Active Alerts', value: data.alerts, icon: AlertTriangle, color: 'text-warning-600 bg-warning-50 dark:bg-warning-900/30' },
    { label: 'Pending Approvals', value: data.pendingNGOs + data.pendingVolunteers, icon: CheckCircle2, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30' },
  ];

  return (
    <DashboardLayout config={adminNav}>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5">
            <div className="flex items-center gap-3">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent alerts */}
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Active Disaster Alerts</h3>
          {recentAlerts.length === 0 ? (
            <p className="text-sm text-slate-500">No active alerts.</p>
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((a) => (
                <div key={a._id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${a.severity === 'critical' ? 'bg-brand-100 dark:bg-brand-900/40 text-brand-600' : 'bg-warning-100 dark:bg-warning-900/40 text-warning-600'}`}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{a.title}</p>
                    <p className="text-xs text-slate-500">{a.location.address} · {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent registrations */}
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Recent Registrations</h3>
          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div key={u._id} className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 text-sm font-semibold">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{u.name}</p>
                  <p className="text-xs text-slate-500 truncate">{u.email}</p>
                </div>
                <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-500 capitalize">{u.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
