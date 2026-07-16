import { useEffect, useState } from 'react';
import { Bell, CheckCheck, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { notificationsApi } from '../data/store';
import { LoadingSpinner, EmptyState } from '../components/ui/Feedback';
import type { Notification } from '../types';
import { formatDistanceToNow } from 'date-fns';

const typeColors: Record<string, string> = {
  sos: 'bg-brand-100 dark:bg-brand-900/40 text-brand-600',
  request: 'bg-accent-100 dark:bg-accent-900/40 text-accent-600',
  system: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600',
  mission: 'bg-success-100 dark:bg-success-900/40 text-success-600',
  donation: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600',
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[] | null>(null);

  const load = () => {
    if (!user) return;
    notificationsApi.byUser(user._id).then(setNotifications);
  };
  useEffect(load, [user]);

  const handleMarkAll = async () => {
    if (!user) return;
    await notificationsApi.markAllRead(user._id);
    toast('All notifications marked as read.', 'success');
    load();
  };

  const handleMarkOne = async (id: string) => {
    await notificationsApi.markRead(id);
    load();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2"><Bell className="h-5 w-5 text-brand-600" /> Notifications</h1>
            <p className="text-sm text-slate-500">Stay updated on your requests and missions.</p>
          </div>
          {notifications && notifications.some((n) => !n.read) && (
            <button onClick={handleMarkAll} className="btn-secondary text-sm">
              <CheckCheck className="h-4 w-4" /> Mark all read
            </button>
          )}
        </div>

        {notifications === null ? <LoadingSpinner /> : notifications.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="You'll receive notifications when your requests are updated or when new missions are available." />
        ) : (
          <div className="card divide-y divide-slate-100 dark:divide-slate-800">
            {notifications.map((n) => (
              <button
                key={n._id}
                onClick={() => handleMarkOne(n._id)}
                className={`w-full flex items-start gap-3 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${!n.read ? 'bg-brand-50/50 dark:bg-brand-900/10' : ''}`}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${typeColors[n.type] || typeColors.system}`}>
                  <Bell className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-brand-500 shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
