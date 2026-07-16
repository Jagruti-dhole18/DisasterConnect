import { useEffect, useState } from 'react';
import { AlertTriangle, Plus, Trash2, MapPin, Edit } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminNav } from './adminNav';
import { useToast } from '../../context/ToastContext';
import { disasterAlertsApi } from '../../data/store';
import Modal from '../../components/ui/Modal';
import { LoadingSpinner, EmptyState } from '../../components/ui/Feedback';
import type { DisasterAlert } from '../../types';
import { formatDistanceToNow } from 'date-fns';

const severityConfig: Record<string, string> = {
  advisory: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  watch: 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300',
  warning: 'bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-300',
  critical: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
};

const severityBorder: Record<string, string> = {
  advisory: 'border-l-blue-500',
  watch: 'border-l-accent-500',
  warning: 'border-l-warning-500',
  critical: 'border-l-brand-500',
};

const typeIcon: Record<string, string> = {
  flood: '🌊', earthquake: '🏚️', cyclone: '🌀', fire: '🔥', landslide: '⛰️', drought: '🏜️', other: '⚠️',
};

export default function AdminAlerts() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<DisasterAlert[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAlert, setEditAlert] = useState<DisasterAlert | null>(null);
  const [form, setForm] = useState({ title: '', type: 'flood' as DisasterAlert['type'], severity: 'advisory' as DisasterAlert['severity'], address: '', description: '', affectedAreas: '' });
  const [saving, setSaving] = useState(false);

  const load = () => disasterAlertsApi.list().then(setAlerts);
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    setSaving(true);
    const data = {
      title: form.title, type: form.type, severity: form.severity,
      location: { lat: 19.076, lng: 72.8777, address: form.address },
      description: form.description,
      affectedAreas: form.affectedAreas.split(',').map((a) => a.trim()).filter(Boolean),
    };
    if (editAlert) {
      await disasterAlertsApi.update(editAlert._id, data);
      toast('Alert updated.', 'success');
    } else {
      await disasterAlertsApi.create(data);
      toast('Disaster alert published.', 'success');
    }
    setSaving(false);
    setModalOpen(false);
    setEditAlert(null);
    setForm({ title: '', type: 'flood', severity: 'advisory', address: '', description: '', affectedAreas: '' });
    load();
  };

  const handleDelete = async (id: string) => {
    await disasterAlertsApi.remove(id);
    toast('Alert removed.', 'info');
    load();
  };

  const toggleActive = async (a: DisasterAlert) => {
    await disasterAlertsApi.update(a._id, { active: !a.active });
    load();
  };

  return (
    <DashboardLayout config={adminNav}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold">Disaster Alerts</h2>
          <p className="text-sm text-slate-500">Publish and manage disaster alerts visible to all users.</p>
        </div>
        <button onClick={() => { setEditAlert(null); setForm({ title: '', type: 'flood', severity: 'advisory', address: '', description: '', affectedAreas: '' }); setModalOpen(true); }} className="btn-primary">
          <Plus className="h-4 w-4" /> New Alert
        </button>
      </div>

      {alerts === null ? <LoadingSpinner /> : alerts.length === 0 ? (
        <EmptyState icon={AlertTriangle} title="No alerts published" description="Create a disaster alert to notify users of ongoing emergencies." />
      ) : (
        <div className="space-y-4">
          {alerts.map((a) => (
            <div key={a._id} className={`card p-5 border-l-4 ${severityBorder[a.severity] || 'border-l-slate-300'} ${!a.active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xl mr-1">{typeIcon[a.type] || '⚠️'}</span>
                    <h3 className="font-semibold">{a.title}</h3>
                    <span className={`badge capitalize ${severityConfig[a.severity]}`}>{a.severity}</span>
                    <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-500 capitalize">{a.type}</span>
                    <span className={`badge ${a.active ? 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300' : 'bg-slate-100 text-slate-500'}`}>{a.active ? 'Active' : 'Inactive'}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{a.description}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-1"><MapPin className="h-3 w-3" /> {a.location.address}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {a.affectedAreas.map((area) => <span key={area} className="badge bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px]">{area}</span>)}
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button onClick={() => toggleActive(a)} className="btn-ghost !p-1.5 text-xs">{a.active ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => { setEditAlert(a); setForm({ title: a.title, type: a.type, severity: a.severity, address: a.location.address, description: a.description, affectedAreas: a.affectedAreas.join(', ') }); setModalOpen(true); }} className="btn-ghost !p-1.5"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(a._id)} className="btn-ghost !p-1.5 text-brand-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editAlert ? 'Edit Alert' : 'Publish Disaster Alert'}>
        <div className="space-y-4">
          <div>
            <label className="label">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g., Mumbai Flood Warning" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as DisasterAlert['type'] }))}>
                {['flood', 'earthquake', 'cyclone', 'fire', 'landslide', 'drought', 'other'].map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Severity</label>
              <select className="input" value={form.severity} onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value as DisasterAlert['severity'] }))}>
                {['advisory', 'watch', 'warning', 'critical'].map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Location / Area</label>
            <input className="input" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Affected region" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input min-h-[80px] resize-none" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Alert details..." />
          </div>
          <div>
            <label className="label">Affected Areas (comma-separated)</label>
            <input className="input" value={form.affectedAreas} onChange={(e) => setForm((f) => ({ ...f, affectedAreas: e.target.value }))} placeholder="Andheri, Dadar, Worli" />
          </div>
          <button onClick={handleSubmit} disabled={saving || !form.title || !form.description} className="btn-primary w-full">
            {saving ? 'Saving...' : editAlert ? 'Update Alert' : 'Publish Alert'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
