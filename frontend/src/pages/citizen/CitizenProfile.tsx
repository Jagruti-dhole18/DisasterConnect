import { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Shield, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { citizenNav } from './citizenNav';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function CitizenProfile() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.location?.address || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    updateUser({
      name: form.name,
      phone: form.phone,
      location: { ...user!.location, lat: user!.location?.lat || 19.076, lng: user!.location?.lng || 72.8777, address: form.address },
    });
    setSaving(false);
    toast('Profile updated successfully.', 'success');
  };

  return (
    <DashboardLayout config={citizenNav}>
      <h2 className="text-lg font-semibold mb-6">My Profile</h2>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white text-2xl font-bold mb-4">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <h3 className="font-semibold text-lg">{user?.name}</h3>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 mt-3 capitalize">{user?.role}</span>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-sm">
            <div className="flex items-center justify-center gap-2 text-success-600 dark:text-success-400">
              <CheckCircle2 className="h-4 w-4" /> Email Verified
            </div>
            <div className="flex items-center justify-center gap-2 text-success-600 dark:text-success-400">
              <Shield className="h-4 w-4" /> Account Active
            </div>
          </div>
        </div>

        <div className="card p-6 lg:col-span-2 space-y-4">
          <h3 className="font-semibold">Personal Information</h3>
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input className="input pl-10" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input className="input pl-10" value={user?.email} disabled />
            </div>
          </div>
          <div>
            <label className="label">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input className="input pl-10" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input className="input pl-10" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
            </div>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : <><Save className="h-4 w-4" /> Save Changes</>}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
