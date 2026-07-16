import { useEffect, useState } from 'react';
import { BadgeCheck, CheckCircle2, XCircle, Building2, UserCheck } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminNav } from './adminNav';
import { useToast } from '../../context/ToastContext';
import { usersApi, volunteersApi } from '../../data/store';
import { LoadingSpinner, EmptyState } from '../../components/ui/Feedback';
import type { User, Volunteer } from '../../types';

export default function AdminVerifications() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[] | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  const load = () => {
    usersApi.list().then(setUsers);
    volunteersApi.list().then(setVolunteers);
  };
  useEffect(load, []);

  const pendingNGOs = (users || []).filter((u) => u.role === 'ngo' && u.ngoProfile && !u.ngoProfile.approved);
  const pendingVolunteers = volunteers.filter((v) => !v.verified);

  const approveNGO = async (u: User) => {
    await usersApi.approveNgo(u._id);
    toast(`${u.ngoProfile?.organizationName} approved.`, 'success');
    load();
  };
  const rejectNGO = async (u: User) => {
    await usersApi.update(u._id, { ngoProfile: { ...u.ngoProfile!, approved: false } });
    toast('NGO registration rejected.', 'info');
    load();
  };
  const verifyVolunteer = async (v: Volunteer) => {
    await volunteersApi.verify(v._id);
    const u = await usersApi.byId(v.user);
    if (u) await usersApi.update(u._id, { volunteerProfile: { ...u.volunteerProfile!, verified: true }, isVerified: true });
    toast(`${v.name} verified as volunteer.`, 'success');
    load();
  };

  return (
    <DashboardLayout config={adminNav}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Verifications</h2>
        <p className="text-sm text-slate-500">Approve NGO registrations and verify volunteer profiles.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending NGOs */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Building2 className="h-5 w-5 text-brand-600" /> NGO Approvals ({pendingNGOs.length})</h3>
          {users === null ? <LoadingSpinner /> : pendingNGOs.length === 0 ? (
            <EmptyState icon={CheckCircle2} title="No pending NGOs" description="All NGO registrations have been reviewed." />
          ) : (
            <div className="space-y-3">
              {pendingNGOs.map((u) => (
                <div key={u._id} className="card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{u.ngoProfile?.organizationName}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                      <p className="text-xs text-slate-500 mt-1">Reg ID: {u.ngoProfile?.registrationId}</p>
                    </div>
                  </div>
                  {u.ngoProfile?.description && <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{u.ngoProfile.description}</p>}
                  <div className="flex gap-2">
                    <button onClick={() => approveNGO(u)} className="btn-primary flex-1 text-xs"><CheckCircle2 className="h-4 w-4" /> Approve</button>
                    <button onClick={() => rejectNGO(u)} className="btn-secondary flex-1 text-xs"><XCircle className="h-4 w-4" /> Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Volunteers */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2"><UserCheck className="h-5 w-5 text-success-600" /> Volunteer Verifications ({pendingVolunteers.length})</h3>
          {pendingVolunteers.length === 0 ? (
            <EmptyState icon={BadgeCheck} title="No pending volunteers" description="All volunteer profiles are verified." />
          ) : (
            <div className="space-y-3">
              {pendingVolunteers.map((v) => (
                <div key={v._id} className="card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 font-semibold">
                        {v.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{v.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {v.skills.map((s) => <span key={s} className="badge bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px]">{s}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => verifyVolunteer(v)} className="btn-primary w-full text-xs">
                    <CheckCircle2 className="h-4 w-4" /> Verify Volunteer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
