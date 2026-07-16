import type { RequestStatus, RequestPriority } from '../../types';

const statusConfig: Record<RequestStatus, { label: string; className: string; dot: string }> = {
  pending: { label: 'Pending', className: 'bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-300', dot: 'bg-warning-500' },
  accepted: { label: 'Accepted', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', dot: 'bg-blue-500' },
  in_progress: { label: 'In Progress', className: 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300', dot: 'bg-accent-500' },
  resolved: { label: 'Resolved', className: 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300', dot: 'bg-success-500' },
  cancelled: { label: 'Cancelled', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', dot: 'bg-slate-400' },
};

const priorityConfig: Record<RequestPriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  medium: { label: 'Medium', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  high: { label: 'High', className: 'bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300' },
  critical: { label: 'Critical', className: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300' },
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`badge ${cfg.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: RequestPriority }) {
  const cfg = priorityConfig[priority];
  return <span className={`badge ${cfg.className}`}>{cfg.label}</span>;
}
