import { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Shield, CheckCircle2, Star, Award, Plus, X } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { volunteerNav } from './volunteerNav';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { volunteersApi } from '../../data/store';

export default function VolunteerProfile() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    skills: user?.volunteerProfile?.skills || [],
  });
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAddSkill = () => {
    if (newSkill && !form.skills.includes(newSkill)) {
      setForm((f) => ({ ...f, skills: [...f.skills, newSkill] }));
      setNewSkill('');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    updateUser({ name: form.name, phone: form.phone, volunteerProfile: { ...user!.volunteerProfile!, skills: form.skills } });
    const vol = await volunteersApi.byUserId(user!._id);
    if (vol) await volunteersApi.update(vol._id, { skills: form.skills, name: form.name });
    setSaving(false);
    toast('Profile updated successfully.', 'success');
  };

  return (
    <DashboardLayout config={volunteerNav}>
      <h2 className="text-lg font-semibold mb-6">Volunteer Profile</h2>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="card p-6 text-center">
          <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white text-2xl font-bold mb-4">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <h3 className="font-semibold text-lg">{user?.name}</h3>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 capitalize">{user?.role}</span>
            {user?.volunteerProfile?.verified && (
              <span className="badge bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300">
                <CheckCircle2 className="h-3 w-3" /> Verified
              </span>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="flex items-center justify-center gap-1 text-accent-600 font-bold"><Star className="h-4 w-4" /> {user?.volunteerProfile?.rewardPoints}</p>
              <p className="text-xs text-slate-500">Points</p>
            </div>
            <div>
              <p className="flex items-center justify-center gap-1 text-success-600 font-bold"><Award className="h-4 w-4" /> {user?.volunteerProfile?.missionsCompleted}</p>
              <p className="text-xs text-slate-500">Missions</p>
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="card p-6 lg:col-span-2 space-y-4">
          <h3 className="font-semibold">Edit Information</h3>
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
            <label className="label">Skills & Expertise</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.skills.map((skill) => (
                <span key={skill} className="badge bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                  {skill}
                  <button onClick={() => setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }))}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="input flex-1" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a skill (e.g., First Aid)" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())} />
              <button onClick={handleAddSkill} className="btn-secondary"><Plus className="h-4 w-4" /></button>
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
