import { useEffect, useState } from 'react';
import { Plus, Tent, MapPin, Users, Package, Droplets, Pill, Trash2, Edit } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ngoNav } from './ngoNav';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { reliefCampsApi } from '../../data/store';
import Modal from '../../components/ui/Modal';
import { LoadingSpinner, EmptyState } from '../../components/ui/Feedback';
import type { ReliefCamp } from '../../types';

export default function NgoReliefCamps() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [camps, setCamps] = useState<ReliefCamp[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCamp, setEditCamp] = useState<ReliefCamp | null>(null);
  const [form, setForm] = useState({ name: '', address: '', capacity: 100, foodStock: 0, waterStock: 0, medicineStock: 0, medicalSupport: false });
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!user) return;
    reliefCampsApi.byNgo(user._id).then(setCamps);
  };
  useEffect(load, [user]);

  const handleSubmit = async () => {
    setSaving(true);
    if (editCamp) {
      await reliefCampsApi.update(editCamp._id, {
        name: form.name, location: { ...editCamp.location, address: form.address },
        capacity: form.capacity, foodStock: form.foodStock, waterStock: form.waterStock,
        medicineStock: form.medicineStock, medicalSupport: form.medicalSupport,
      });
      toast('Relief camp updated.', 'success');
    } else {
      await reliefCampsApi.create({
        name: form.name, ngo: user!._id, ngoName: user!.ngoProfile?.organizationName || user!.name,
        location: { lat: 19.076, lng: 72.8777, address: form.address },
        capacity: form.capacity, foodStock: form.foodStock, waterStock: form.waterStock,
        medicineStock: form.medicineStock, medicalSupport: form.medicalSupport,
      });
      toast('Relief camp created.', 'success');
    }
    setSaving(false);
    setModalOpen(false);
    setEditCamp(null);
    setForm({ name: '', address: '', capacity: 100, foodStock: 0, waterStock: 0, medicineStock: 0, medicalSupport: false });
    load();
  };

  const openEdit = (camp: ReliefCamp) => {
    setEditCamp(camp);
    setForm({ name: camp.name, address: camp.location.address, capacity: camp.capacity, foodStock: camp.foodStock, waterStock: camp.waterStock, medicineStock: camp.medicineStock, medicalSupport: camp.medicalSupport });
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await reliefCampsApi.remove(id);
    toast('Relief camp removed.', 'info');
    load();
  };

  return (
    <DashboardLayout config={ngoNav}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold">Manage Relief Camps</h2>
          <p className="text-sm text-slate-500">Create and manage shelters, track resources and occupancy.</p>
        </div>
        <button onClick={() => { setEditCamp(null); setForm({ name: '', address: '', capacity: 100, foodStock: 0, waterStock: 0, medicineStock: 0, medicalSupport: false }); setModalOpen(true); }} className="btn-primary">
          <Plus className="h-4 w-4" /> New Camp
        </button>
      </div>

      {camps === null ? <LoadingSpinner /> : camps.length === 0 ? (
        <EmptyState icon={Tent} title="No relief camps yet" description="Create a relief camp to start managing shelter resources." action={<button onClick={() => setModalOpen(true)} className="btn-primary"><Plus className="h-4 w-4" /> Create Camp</button>} />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {camps.map((camp) => {
            const pct = Math.round((camp.occupants / camp.capacity) * 100);
            return (
              <div key={camp._id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{camp.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {camp.location.address}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(camp)} className="btn-ghost !p-1.5"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(camp._id)} className="btn-ghost !p-1.5 text-brand-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 flex items-center gap-1"><Users className="h-3 w-3" /> Occupancy</span>
                    <span className="font-medium">{camp.occupants}/{camp.capacity}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full ${pct > 90 ? 'bg-brand-500' : pct > 70 ? 'bg-accent-500' : 'bg-success-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-accent-50 dark:bg-accent-900/20 p-2">
                    <Package className="h-4 w-4 mx-auto text-accent-600 mb-1" />
                    <p className="text-xs font-medium">{camp.foodStock}</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-2">
                    <Droplets className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                    <p className="text-xs font-medium">{camp.waterStock}</p>
                  </div>
                  <div className="rounded-lg bg-success-50 dark:bg-success-900/20 p-2">
                    <Pill className="h-4 w-4 mx-auto text-success-600 mb-1" />
                    <p className="text-xs font-medium">{camp.medicineStock}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editCamp ? 'Edit Camp' : 'Create Relief Camp'}>
        <div className="space-y-4">
          <div>
            <label className="label">Camp Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g., Andheri Community Shelter" />
          </div>
          <div>
            <label className="label">Address</label>
            <input className="input" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Full address" />
          </div>
          <div>
            <label className="label">Capacity</label>
            <input type="number" className="input" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: Number(e.target.value) }))} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Food</label>
              <input type="number" className="input" value={form.foodStock} onChange={(e) => setForm((f) => ({ ...f, foodStock: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="label">Water</label>
              <input type="number" className="input" value={form.waterStock} onChange={(e) => setForm((f) => ({ ...f, waterStock: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="label">Medicine</label>
              <input type="number" className="input" value={form.medicineStock} onChange={(e) => setForm((f) => ({ ...f, medicineStock: Number(e.target.value) }))} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.medicalSupport} onChange={(e) => setForm((f) => ({ ...f, medicalSupport: e.target.checked }))} className="rounded border-slate-300" />
            Medical support available
          </label>
          <button onClick={handleSubmit} disabled={saving || !form.name || !form.address} className="btn-primary w-full">
            {saving ? 'Saving...' : editCamp ? 'Update Camp' : 'Create Camp'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
