import { useEffect, useState } from 'react';
import { Users, Search, Trash2, Shield } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { adminNav } from './adminNav';
import { useToast } from '../../context/ToastContext';
import { usersApi } from '../../data/store';
import { LoadingSpinner, EmptyState } from '../../components/ui/Feedback';
import type { User, UserRole } from '../../types';
import { format } from 'date-fns';

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[] | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

  const load = () => { usersApi.list().then(setUsers); };
  useEffect(load, []);

  const filtered = (users || []).filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    await usersApi.remove(id);
    toast('User removed.', 'info');
    load();
  };

  return (
    <DashboardLayout config={adminNav}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">User Management</h2>
        <p className="text-sm text-slate-500">View, filter, and manage all platform users.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input className="input pl-10" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'citizen', 'volunteer', 'ngo', 'admin'] as const).map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)} className={`badge cursor-pointer capitalize ${roleFilter === r ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {users === null ? <LoadingSpinner /> : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="Try adjusting your search or filter." />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs text-slate-500 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">User</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Joined</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 text-sm font-semibold">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">{u.role}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{format(new Date(u.createdAt), 'dd MMM yyyy')}</td>
                    <td className="px-4 py-3">
                      {u.isVerified ? (
                        <span className="badge bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300"><Shield className="h-3 w-3" /> Verified</span>
                      ) : (
                        <span className="badge bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-300">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(u._id)} className="btn-ghost !p-1.5 text-brand-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
