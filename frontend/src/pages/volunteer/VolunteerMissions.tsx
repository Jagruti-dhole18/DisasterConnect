import { useEffect, useState } from 'react';
import { Siren, Navigation, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { volunteerNav } from './volunteerNav';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { requestsApi, notificationsApi } from '../../data/store';
import RequestCard from '../../components/ui/RequestCard';
import MapView from '../../components/ui/MapView';
import { EmptyState, RequestCardSkeleton } from '../../components/ui/Feedback';
import type { BaseRequest, MapPoint } from '../../types';

export default function VolunteerMissions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [missions, setMissions] = useState<BaseRequest[] | null>(null);

  const load = () => {
    if (!user) return;
    requestsApi.byVolunteer(user._id).then((all) => {
      setMissions(all.filter((m) => m.status === 'accepted' || m.status === 'in_progress'));
    });
  };

  useEffect(load, [user]);

  const handleResolve = async (req: BaseRequest) => {
    await requestsApi.update(req._id, { status: 'resolved' });
    await notificationsApi.create({
      user: req.citizen, title: 'Request Resolved', message: `${user!.name} has marked your request as resolved.`, type: 'mission',
    });
    toast('Mission resolved! Great work.', 'success');
    load();
  };

  const points: MapPoint[] = (missions || []).map((m) => ({
    id: m._id, lat: m.location.lat, lng: m.location.lng, label: m.citizenName, description: m.description, color: '#dc2626',
  }));

  return (
    <DashboardLayout config={volunteerNav}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Active Missions</h2>
        <p className="text-sm text-slate-500">Navigate to citizens in need and resolve their requests.</p>
      </div>

      {missions === null ? (
        <div className="grid sm:grid-cols-2 gap-4"><RequestCardSkeleton /><RequestCardSkeleton /></div>
      ) : missions.length === 0 ? (
        <EmptyState icon={Siren} title="No active missions" description="Accept a request from your dashboard to start a mission." />
      ) : (
        <>
          {points.length > 0 && <MapView points={points} height="280px" className="mb-6" />}
          <div className="grid sm:grid-cols-2 gap-4">
            {missions.map((m) => (
              <RequestCard key={m._id} request={m} actionLabel="Mark Resolved" onAction={handleResolve} onView={() => {
                if (navigator.geolocation) {
                  toast('Opening navigation to request location...', 'info');
                  window.open(`https://www.openstreetmap.org/directions?from=&to=${m.location.lat}%2C${m.location.lng}`, '_blank');
                }
              }} />
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
