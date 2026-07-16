import { useEffect, useState } from 'react';
import { IndianRupee, TrendingUp, Heart, Plus } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ngoNav } from './ngoNav';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { donationsApi } from '../../data/store';
import Modal from '../../components/ui/Modal';
import { LoadingSpinner, EmptyState } from '../../components/ui/Feedback';
import type { Donation } from '../../types';
import { format } from 'date-fns';

export default function NgoDonations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ donorName: '', amount: '', purpose: 'General relief' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!user) return;
    donationsApi.byNgo(user._id).then(setDonations);
  };
  useEffect(load, [user]);

  const handleSubmit = async () => {
    setSaving(true);
    await donationsApi.create({
      donor: 'manual', donorName: form.donorName, ngo: user!._id,
      ngoName: user!.ngoProfile?.organizationName || user!.name,
      amount: Number(form.amount), purpose: form.purpose,
    });
    setSaving(false);
    setModalOpen(false);
    setForm({ donorName: '', amount: '', purpose: 'General relief' });
    toast('Donation recorded.', 'success');
    load();
  };

  const total = (donations || []).filter((d) => d.status === 'completed').reduce((s, d) => s + d.amount, 0);
  const pending = (donations || []).filter((d) => d.status === 'pending').reduce((s, d) => s + d.amount, 0);

  return (
    <DashboardLayout config={ngoNav}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold">Donation Tracking</h2>
          <p className="text-sm text-slate-500">Track contributions and manage donor records.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> Record Donation
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card p-5">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-success-50 dark:bg-success-900/30 text-success-600 mb-3">
            <IndianRupee className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold">₹{total.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-500">Total Received</p>
        </div>
        <div className="card p-5">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-warning-50 dark:bg-warning-900/30 text-warning-600 mb-3">
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold">₹{pending.toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-500">Pending</p>
        </div>
      </div>

      {donations === null ? <LoadingSpinner /> : donations.length === 0 ? (
        <EmptyState icon={Heart} title="No donations yet" description="Record donations as they come in to keep your records updated." />
      ) : (
        <div className="card divide-y divide-slate-100 dark:divide-slate-800">
          {donations.map((d) => (
            <div key={d._id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-sm">{d.donorName}</p>
                <p className="text-xs text-slate-500">{d.purpose} · {format(new Date(d.createdAt), 'dd MMM yyyy')}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-success-600">₹{d.amount.toLocaleString('en-IN')}</p>
                <span className={`badge text-[10px] ${d.status === 'completed' ? 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300' : 'bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-300'}`}>{d.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Record Donation">
        <div className="space-y-4">
          <div>
            <label className="label">Donor Name</label>
            <input className="input" value={form.donorName} onChange={(e) => setForm((f) => ({ ...f, donorName: e.target.value }))} placeholder="Donor name" />
          </div>
          <div>
            <label className="label">Amount (₹)</label>
            <input type="number" className="input" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} placeholder="Amount" />
          </div>
          <div>
            <label className="label">Purpose</label>
            <select className="input" value={form.purpose} onChange={(e) => setForm((f) => ({ ...f, purpose: e.target.value }))}>
              <option>General relief</option>
              <option>Food supplies</option>
              <option>Medical kits</option>
              <option>Shelter materials</option>
              <option>Water & sanitation</option>
            </select>
          </div>
          <button onClick={handleSubmit} disabled={saving || !form.donorName || !form.amount} className="btn-primary w-full">
            {saving ? 'Saving...' : 'Record Donation'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
