import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, HeartHandshake, Package, TrendingUp, Users, Tent } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ngoNav } from './ngoNav';
import { useAuth } from '../../context/AuthContext';
import { reliefCampsApi, donationsApi, volunteersApi } from '../../data/store';
import { LoadingSpinner } from '../../components/ui/Feedback';
import type { ReliefCamp, Donation, Volunteer } from '../../types';

export default function NgoDashboard() {
  const { user, refreshUser } = useAuth();
  const [camps, setCamps] = useState<ReliefCamp[] | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (!user) return;
    reliefCampsApi.byNgo(user._id).then(setCamps);
    donationsApi.byNgo(user._id).then(setDonations);
    volunteersApi.list().then(setVolunteers);
  }, [user]);

  if (camps === null) return <DashboardLayout config={ngoNav}><LoadingSpinner /></DashboardLayout>;

  const totalDonations = donations.filter((d) => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0);
  const totalOccupants = camps.reduce((sum, c) => sum + c.occupants, 0);
  const availableVolunteers = volunteers.filter((v) => v.availability).length;

  const stats = [
    { label: 'Relief Camps', value: camps.length, icon: Tent, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
    { label: 'People Sheltered', value: totalOccupants, icon: Users, color: 'text-success-600 bg-success-50 dark:bg-success-900/30' },
    { label: 'Total Donations', value: `₹${totalDonations.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-accent-600 bg-accent-50 dark:bg-accent-900/30' },
    { label: 'Available Volunteers', value: availableVolunteers, icon: HeartHandshake, color: 'text-brand-600 bg-brand-50 dark:bg-brand-900/30' },
  ];

  return (
    <DashboardLayout config={ngoNav}>
      {/* Approval banner */}
      {user?.ngoProfile && !user.ngoProfile.approved && (
        <div className="card p-4 mb-6 bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800">
          <p className="text-sm text-warning-700 dark:text-warning-300 flex items-center gap-2">
            <Package className="h-4 w-4" /> Your NGO registration is pending admin approval. Some features may be limited.
          </p>
        </div>
      )}

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

      {/* Camps overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Camp Occupancy</h3>
          <div className="space-y-4">
            {camps.length === 0 ? (
              <p className="text-sm text-slate-500">No camps created yet.</p>
            ) : camps.map((camp) => {
              const pct = Math.round((camp.occupants / camp.capacity) * 100);
              return (
                <div key={camp._id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{camp.name}</span>
                    <span className="text-slate-500">{camp.occupants}/{camp.capacity}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full ${pct > 90 ? 'bg-brand-500' : pct > 70 ? 'bg-accent-500' : 'bg-success-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold mb-4">Recent Donations</h3>
          {donations.length === 0 ? (
            <p className="text-sm text-slate-500">No donations received yet.</p>
          ) : (
            <div className="space-y-3">
              {donations.slice(0, 5).map((d) => (
                <div key={d._id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{d.donorName}</p>
                    <p className="text-xs text-slate-500">{d.purpose}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success-600">₹{d.amount.toLocaleString('en-IN')}</p>
                    <span className={`badge text-[10px] ${d.status === 'completed' ? 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300' : 'bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-300'}`}>{d.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
