import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { MapPin, Users, Clock } from 'lucide-react';
import type { BaseRequest } from '../../types';
import { StatusBadge, PriorityBadge } from './Badges';
import { formatDistanceToNow } from 'date-fns';

const typeLabels: Record<string, string> = {
  sos: 'SOS Emergency',
  food: 'Food Request',
  water: 'Water Request',
  medicine: 'Medicine Request',
};

const typeColors: Record<string, string> = {
  sos: 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
  food: 'bg-accent-50 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300',
  water: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  medicine: 'bg-success-50 text-success-700 dark:bg-success-900/40 dark:text-success-300',
};

const RequestCard = forwardRef<
  HTMLDivElement,
  {
    request: BaseRequest;
    onAction?: (r: BaseRequest) => void;
    actionLabel?: string;
    onView?: (r: BaseRequest) => void;
  }
>(function RequestCard(
  {
    request,
    onAction,
    actionLabel,
    onView,
  },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card p-5 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className={`badge ${typeColors[request.type]}`}>{typeLabels[request.type]}</span>
          <PriorityBadge priority={request.priority} />
        </div>
        <StatusBadge status={request.status} />
      </div>

      <p className="text-sm text-slate-700 dark:text-slate-300 mb-3 line-clamp-2">{request.description}</p>

      <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
        <p className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" /> {request.location.address || `${request.location.lat.toFixed(3)}, ${request.location.lng.toFixed(3)}`}
        </p>
        <p className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5" /> {request.peopleCount} people affected
        </p>
        <p className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
        </p>
      </div>

      <div className="flex gap-2">
        {onView && (
          <button onClick={() => onView(request)} className="btn-secondary flex-1 text-xs">
            View Details
          </button>
        )}
        {onAction && actionLabel && (
          <button onClick={() => onAction(request)} className="btn-primary flex-1 text-xs">
            {actionLabel}
          </button>
        )}
      </div>
    </motion.div>
  );
});

export default RequestCard;
