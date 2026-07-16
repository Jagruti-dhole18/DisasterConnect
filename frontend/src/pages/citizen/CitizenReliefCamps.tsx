import { useEffect, useState } from 'react';
import { Tent, MapPin, Package, Droplets, Pill, Stethoscope } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { citizenNav } from './citizenNav';
import { reliefCampsApi } from '../../data/store';
import MapView from '../../components/ui/MapView';
import { LoadingSpinner, EmptyState } from '../../components/ui/Feedback';
import type { ReliefCamp } from '../../types';
import type { MapPoint } from '../../components/ui/MapView';

export default function CitizenReliefCamps() {
  const [camps, setCamps] = useState<ReliefCamp[] | null>(null);

  useEffect(() => {
    reliefCampsApi.list().then(setCamps);
  }, []);

  const points: MapPoint[] = (camps || []).map((c) => ({
    id: c._id, lat: c.location.lat, lng: c.location.lng, label: c.name, description: c.location.address, color: c.status === 'full' ? '#f59e0b' : '#22c55e',
  }));

  return (
    <DashboardLayout config={citizenNav}>
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Relief Camps Near You</h2>
        <p className="text-sm text-slate-500">Find nearby shelters with available capacity and resources.</p>
      </div>

      {camps === null ? <LoadingSpinner /> : camps.length === 0 ? (
        <EmptyState icon={Tent} title="No relief camps available" description="Relief camps will appear here when NGOs set them up in your area." />
      ) : (
        <>
          <MapView points={points} height="320px" className="mb-6" />
          <div className="grid sm:grid-cols-2 gap-4">
            {camps.map((camp) => {
              const occupancy = Math.round((camp.occupants / camp.capacity) * 100);
              return (
                <div key={camp._id} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{camp.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {camp.location.address}</p>
                    </div>
                    <span className={`badge ${camp.status === 'active' ? 'bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300' : camp.status === 'full' ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-300' : 'bg-slate-100 text-slate-500'}`}>
                      {camp.status}
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">Occupancy</span>
                      <span className="font-medium">{camp.occupants}/{camp.capacity}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className={`h-full rounded-full ${occupancy > 90 ? 'bg-brand-500' : occupancy > 70 ? 'bg-accent-500' : 'bg-success-500'}`} style={{ width: `${occupancy}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-accent-50 dark:bg-accent-900/20 p-2">
                      <Package className="h-4 w-4 mx-auto text-accent-600 mb-1" />
                      <p className="text-xs font-medium">{camp.foodStock}</p>
                      <p className="text-[10px] text-slate-500">Food</p>
                    </div>
                    <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-2">
                      <Droplets className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                      <p className="text-xs font-medium">{camp.waterStock}</p>
                      <p className="text-[10px] text-slate-500">Water</p>
                    </div>
                    <div className="rounded-lg bg-success-50 dark:bg-success-900/20 p-2">
                      <Pill className="h-4 w-4 mx-auto text-success-600 mb-1" />
                      <p className="text-xs font-medium">{camp.medicineStock}</p>
                      <p className="text-[10px] text-slate-500">Med.</p>
                    </div>
                  </div>
                  {camp.medicalSupport && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-success-600 dark:text-success-400">
                      <Stethoscope className="h-3.5 w-3.5" /> Medical support available
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
