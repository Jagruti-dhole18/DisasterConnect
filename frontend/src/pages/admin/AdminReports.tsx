import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileBarChart, Users, Siren, Tent, HeartHandshake, IndianRupee, TrendingUp, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminNav } from './adminNav';
import { usersApi, requestsApi, reliefCampsApi, donationsApi, volunteersApi } from '../../data/store';
import { LoadingSpinner } from '../../components/ui/Feedback';

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      usersApi.list(), requestsApi.list(), reliefCampsApi.list(),
      donationsApi.list(), volunteersApi.list(),
    ]).then(([users, requests, camps, donations, volunteers]) => {
      const totalDonations = donations.reduce((s, d) => s + d.amount, 0);
      const resolved = requests.filter((r) => r.status === 'resolved').length;
      const pending = requests.filter((r) => r.status === 'pending').length;
      const inProgress = requests.filter((r) => r.status === 'accepted' || r.status === 'in_progress').length;
      setReport({
        usersByRole: {
          citizen: users.filter((u) => u.role === 'citizen').length,
          volunteer: users.filter((u) => u.role === 'volunteer').length,
          ngo: users.filter((u) => u.role === 'ngo').length,
          admin: users.filter((u) => u.role === 'admin').length,
        } as Record<string, number>,
        requestsByType: {
          sos: requests.filter((r) => r.type === 'sos').length,
          food: requests.filter((r) => r.type === 'food').length,
          water: requests.filter((r) => r.type === 'water').length,
          medicine: requests.filter((r) => r.type === 'medicine').length,
        } as Record<string, number>,
        requestStatus: { resolved, pending, inProgress, total: requests.length },
        totalCamps: camps.length,
        totalOccupants: camps.reduce((s, c) => s + c.occupants, 0),
        totalDonations,
        verifiedVolunteers: volunteers.filter((v) => v.verified).length,
        totalVolunteers: volunteers.length,
      });
      setLoading(false);
    });
  }, []);

  if (loading) return <DashboardLayout config={adminNav}><LoadingSpinner /></DashboardLayout>;

  const cards = [
    { label: 'Total Users', value: Object.values(report.usersByRole).reduce((a: number, b: number) => a + b, 0), icon: Users, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
    { label: 'Total Requests', value: report.requestStatus.total, icon: Siren, color: 'text-brand-600 bg-brand-50 dark:bg-brand-900/30' },
    { label: 'People Sheltered', value: report.totalOccupants, icon: Tent, color: 'text-accent-600 bg-accent-50 dark:bg-accent-900/30' },
    { label: 'Donations', value: `₹${report.totalDonations.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-success-600 bg-success-50 dark:bg-success-900/30' },
  ];

  return (
    <DashboardLayout config={adminNav}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Analytics & Reports</h2>
        <p className="text-sm text-slate-500">Platform-wide statistics and operational insights.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${c.color} mb-3`}>
              <c.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-xs text-slate-500">{c.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Users by role */}
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Users by Role</h3>
          <div className="space-y-3">
            {Object.entries(report.usersByRole).map(([role, count]) => {
              const max = Math.max(...Object.values(report.usersByRole) as number[]);
              return (
                <div key={role}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="capitalize">{role}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full bg-brand-500" style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Requests by type */}
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Requests by Type</h3>
          <div className="space-y-3">
            {Object.entries(report.requestsByType).map(([type, count]) => {
              const max = Math.max(...Object.values(report.requestsByType) as number[]);
              const colors: Record<string, string> = { sos: 'bg-brand-500', food: 'bg-accent-500', water: 'bg-blue-500', medicine: 'bg-success-500' };
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="capitalize">{type}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full ${colors[type]}`} style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Request status breakdown */}
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Request Status Breakdown</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-warning-50 dark:bg-warning-900/20 p-4">
              <TrendingUp className="h-5 w-5 mx-auto text-warning-600 mb-1" />
              <p className="text-xl font-bold">{report.requestStatus.pending}</p>
              <p className="text-xs text-slate-500">Pending</p>
            </div>
            <div className="rounded-xl bg-accent-50 dark:bg-accent-900/20 p-4">
              <Siren className="h-5 w-5 mx-auto text-accent-600 mb-1" />
              <p className="text-xl font-bold">{report.requestStatus.inProgress}</p>
              <p className="text-xs text-slate-500">In Progress</p>
            </div>
            <div className="rounded-xl bg-success-50 dark:bg-success-900/20 p-4">
              <CheckCircle2 className="h-5 w-5 mx-auto text-success-600 mb-1" />
              <p className="text-xl font-bold">{report.requestStatus.resolved}</p>
              <p className="text-xs text-slate-500">Resolved</p>
            </div>
          </div>
        </div>

        {/* Volunteer verification */}
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Volunteer Verification</h3>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-50 dark:bg-success-900/30 text-success-600">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{report.verifiedVolunteers}/{report.totalVolunteers}</p>
                <p className="text-xs text-slate-500">Verified Volunteers</p>
              </div>
            </div>
          </div>
          <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full bg-success-500" style={{ width: `${report.totalVolunteers ? (report.verifiedVolunteers / report.totalVolunteers) * 100 : 0}%` }} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
