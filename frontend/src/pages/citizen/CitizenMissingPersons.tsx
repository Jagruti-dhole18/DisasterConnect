import { useEffect, useState } from 'react';
import { UserSearch, Plus, MapPin, Calendar, User as UserIcon } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { citizenNav } from './citizenNav';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { missingPersonsApi } from '../../data/store';
import Modal from '../../components/ui/Modal';
import { LoadingSpinner, EmptyState } from '../../components/ui/Feedback';
import type { MissingPerson } from '../../types';
import { formatDistanceToNow } from 'date-fns';

export default function CitizenMissingPersons() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [persons, setPersons] = useState<MissingPerson[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', age: '', gender: 'male' as 'male' | 'female' | 'other', description: '', address: '' });
  const [creating, setCreating] = useState(false);

  const load = () => missingPersonsApi.list().then(setPersons);
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    setCreating(true);
    await missingPersonsApi.create({
      name: form.name,
      age: Number(form.age),
      gender: form.gender,
      description: form.description,
      lastSeenLocation: { lat: 19.076, lng: 72.8777, address: form.address },
      lastSeenDate: new Date().toISOString(),
      reportedBy: user!._id,
      reportedByName: user!.name,
    });
    setCreating(false);
    setModalOpen(false);
    setForm({ name: '', age: '', gender: 'male', description: '', address: '' });
    toast('Missing person report filed successfully.', 'success');
    load();
  };

  return (
    <DashboardLayout config={citizenNav}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold">Missing Person Board</h2>
          <p className="text-sm text-slate-500">Report and track missing persons in your community.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4" /> Report Missing Person
        </button>
      </div>

      {persons === null ? <LoadingSpinner /> : persons.length === 0 ? (
        <EmptyState icon={UserSearch} title="No missing persons reported" description="File a report if someone you know is missing." action={<button onClick={() => setModalOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Report Now</button>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {persons.map((p) => (
            <div key={p._id} className="card p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 text-lg font-semibold shrink-0">
                  {p.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{p.name}</h3>
                  <p className="text-xs text-slate-500">{p.age} yrs · {p.gender}</p>
                </div>
                <span className={`badge ml-auto ${p.status === 'missing' ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300' : 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300'} capitalize`}>
                  {p.status}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">{p.description}</p>
              <div className="space-y-1 text-xs text-slate-500">
                <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {p.lastSeenLocation.address}</p>
                <p className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {formatDistanceToNow(new Date(p.lastSeenDate), { addSuffix: true })}</p>
                <p className="flex items-center gap-1.5"><UserIcon className="h-3 w-3" /> Reported by {p.reportedByName}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Report Missing Person">
        <div className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Name of the person" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Age</label>
              <input type="number" className="input" value={form.age} onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))} placeholder="Age" />
            </div>
            <div>
              <label className="label">Gender</label>
              <select className="input" value={form.gender} onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as 'male' | 'female' | 'other' }))}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Last Seen Location</label>
            <input className="input" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Address or area" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input min-h-[80px] resize-none" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Physical description, clothing, identifying marks..." />
          </div>
          <button onClick={handleSubmit} disabled={creating || !form.name || !form.description} className="btn-primary w-full">
            {creating ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
