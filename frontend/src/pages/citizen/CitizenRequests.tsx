import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, Package, Droplets, Pill, Filter, Search } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { citizenNav } from './citizenNav';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { requestsApi, notificationsApi } from '../../data/store';
import RequestCard from '../../components/ui/RequestCard';
import Modal from '../../components/ui/Modal';
import { RequestCardSkeleton, EmptyState } from '../../components/ui/Feedback';
import type { BaseRequest, RequestPriority } from '../../types';

const requestTypes: { type: 'food' | 'water' | 'medicine'; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { type: 'food', label: 'Food', icon: Package, color: 'text-accent-600 bg-accent-50 dark:bg-accent-900/30' },
  { type: 'water', label: 'Water', icon: Droplets, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
  { type: 'medicine', label: 'Medicine', icon: Pill, color: 'text-success-600 bg-success-50 dark:bg-success-900/30' },
];

export default function CitizenRequests() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<BaseRequest[] | null>(null);
  const [filter, setFilter] = useState<'all' | 'food' | 'water' | 'medicine'>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [newType, setNewType] = useState<'food' | 'water' | 'medicine'>('food');
  const [newDesc, setNewDesc] = useState('');
  const [newPeople, setNewPeople] = useState(1);
  const [newPriority, setNewPriority] = useState<RequestPriority>('medium');
  const [creating, setCreating] = useState(false);

  const load = () => {
    if (!user) return;
    requestsApi.byCitizen(user._id).then(setRequests);
  };

  useEffect(load, [user]);

  const filtered = (requests || []).filter((r) => {
    if (filter !== 'all' && r.type !== filter) return false;
    if (search && !r.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCreate = async () => {
    setCreating(true);
    await requestsApi.create({
      type: newType,
      citizen: user!._id,
      citizenName: user!.name,
      description: newDesc,
      priority: newPriority,
      location: user?.location?.lat != null && user.location.lng != null
        ? user.location
        : { lat: 19.076, lng: 72.8777, address: 'Mumbai' },
      peopleCount: newPeople,
    });
    await notificationsApi.create({
      user: user!._id,
      title: `${newType.charAt(0).toUpperCase() + newType.slice(1)} Request Submitted`,
      message: `Your ${newType} request for ${newPeople} people has been created and is pending assignment.`,
      type: 'request',
      link: '/app/citizen/requests',
    });
    setCreating(false);
    setModalOpen(false);
    setNewDesc('');
    setNewPeople(1);
    setNewPriority('medium');
    toast(`${newType.charAt(0).toUpperCase() + newType.slice(1)} request created successfully!`, 'success');
    load();
  };

  return (
    <DashboardLayout config={citizenNav}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold">My Requests</h2>
          <p className="text-sm text-slate-500">Track and manage your food, water, and medicine requests.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> New Request
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input className="input pl-10" placeholder="Search requests..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <button onClick={() => setFilter('all')} className={`badge cursor-pointer ${filter === 'all' ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>All</button>
          {requestTypes.map((t) => (
            <button key={t.type} onClick={() => setFilter(t.type)} className={`badge cursor-pointer capitalize ${filter === t.type ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Request list */}
      {requests === null ? (
        <div className="grid sm:grid-cols-2 gap-4">
          <RequestCardSkeleton /><RequestCardSkeleton /><RequestCardSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Package} title="No requests found" description="Create a new request to get help from volunteers and NGOs." action={<button onClick={() => setModalOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> New Request</button>} />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((r) => (
              <RequestCard key={r._id} request={r} onView={() => { toast(`Request: ${r.description.slice(0, 50)}...`, 'info'); }} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create New Request">
        <div className="space-y-5">
          <div>
            <label className="label">Request Type</label>
            <div className="grid grid-cols-3 gap-2">
              {requestTypes.map((t) => (
                <button key={t.type} onClick={() => setNewType(t.type)} className={`rounded-xl border p-3 text-center transition-all ${newType === t.type ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 ring-2 ring-brand-500/20' : 'border-slate-200 dark:border-slate-700'}`}>
                  <t.icon className={`h-6 w-6 mx-auto mb-1 ${t.color.split(' ')[0]}`} />
                  <span className="text-sm font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input min-h-[80px] resize-none" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Describe what you need..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">People Count</label>
              <input type="number" min={1} className="input" value={newPeople} onChange={(e) => setNewPeople(Number(e.target.value))} />
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" value={newPriority} onChange={(e) => setNewPriority(e.target.value as RequestPriority)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <button onClick={handleCreate} disabled={creating || !newDesc} className="btn-primary w-full">
            {creating ? 'Creating...' : 'Submit Request'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
