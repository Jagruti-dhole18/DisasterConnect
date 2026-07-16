import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Siren, MapPin, Users, AlertTriangle, CheckCircle2, Phone } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { citizenNav } from './citizenNav';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { requestsApi, notificationsApi, volunteersApi } from '../../data/store';
import MapView from '../../components/ui/MapView';
import type { MapPoint } from '../../components/ui/MapView';

type Step = 'form' | 'confirm' | 'sent';

export default function CitizenSOS() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('form');
  const [location, setLocation] = useState({ lat: 19.076, lng: 72.8777, address: 'Andheri, Mumbai' });
  const [peopleCount, setPeopleCount] = useState(1);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'high' | 'critical'>('critical');
  const [sending, setSending] = useState(false);
  const [nearbyVolunteers, setNearbyVolunteers] = useState<MapPoint[]>([]);

  useEffect(() => {
    // Try to get user's actual location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, address: 'Your current location' });
        },
        () => { /* keep default */ }
      );
    }
    volunteersApi.list().then((vs) => {
      setNearbyVolunteers(vs.filter((v) => v.availability).map((v) => ({
        id: v._id, lat: v.location.lat, lng: v.location.lng, label: v.name, description: v.skills.join(', '), color: '#22c55e',
      })));
    });
  }, []);

  const handleSubmit = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    const req = await requestsApi.create({
      type: 'sos',
      citizen: user!._id,
      citizenName: user!.name,
      priority,
      description: description || 'Emergency assistance needed',
      location,
      peopleCount,
    });
    // Notify nearby volunteers
    const volunteers = await volunteersApi.list();
    for (const v of volunteers.filter((v) => v.availability)) {
      await notificationsApi.create({
        user: v.user,
        title: 'New SOS Alert',
        message: `Critical SOS from ${user!.name} near ${location.address}. ${peopleCount} people affected.`,
        type: 'sos',
        link: '/app/volunteer/missions',
      });
    }
    await notificationsApi.create({
      user: user!._id,
      title: 'SOS Request Sent',
      message: 'Your emergency SOS has been broadcast to nearby volunteers. Stay safe — help is on the way.',
      type: 'sos',
    });
    setSending(false);
    setStep('sent');
    toast('SOS alert sent to nearby volunteers!', 'success');
  };

  const mapPoints: MapPoint[] = [
    { id: 'you', lat: location.lat, lng: location.lng, label: 'Your Location', description: location.address, color: '#dc2626' },
    ...nearbyVolunteers,
  ];

  return (
    <DashboardLayout config={citizenNav}>
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className="card p-6 mb-6 bg-gradient-to-r from-brand-600 to-brand-700 border-0 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                    <Siren className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Emergency SOS</h2>
                    <p className="text-brand-100 text-sm">Your live location will be shared with nearby volunteers.</p>
                  </div>
                </div>
              </div>

              <div className="card p-6 space-y-5">
                <div>
                  <label className="label">Your Location</label>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mb-2">
                    <MapPin className="h-4 w-4 text-brand-500" /> {location.address}
                  </div>
                  <MapView points={mapPoints} height="220px" center={[location.lat, location.lng]} zoom={13} />
                </div>

                <div>
                  <label className="label">Number of People Affected</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))} className="btn-secondary !px-3">-</button>
                    <span className="text-2xl font-bold w-12 text-center">{peopleCount}</span>
                    <button onClick={() => setPeopleCount(peopleCount + 1)} className="btn-secondary !px-3">+</button>
                  </div>
                </div>

                <div>
                  <label className="label">Emergency Details</label>
                  <textarea className="input min-h-[80px] resize-none" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the emergency (e.g., flooding, medical emergency, trapped...)" />
                </div>

                <div>
                  <label className="label">Priority Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['high', 'critical'] as const).map((p) => (
                      <button key={p} onClick={() => setPriority(p)} className={`rounded-xl border p-3 text-sm font-medium capitalize transition-all ${priority === p ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 ring-2 ring-brand-500/20' : 'border-slate-200 dark:border-slate-700'}`}>
                        <AlertTriangle className={`h-4 w-4 inline mr-1.5 ${p === 'critical' ? 'text-brand-600' : 'text-accent-500'}`} />
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => setStep('confirm')} className="btn-danger w-full text-base py-3.5">
                  <Siren className="h-5 w-5" /> Send SOS Alert
                </button>
              </div>
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div key="confirm" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className="card p-8 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 mb-4">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Confirm Emergency SOS</h2>
                <p className="text-sm text-slate-500 mb-6">This will broadcast your location and details to all available volunteers nearby. Only use this for genuine emergencies.</p>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-left text-sm space-y-2 mb-6">
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" /> {location.address}</p>
                  <p className="flex items-center gap-2"><Users className="h-4 w-4 text-slate-400" /> {peopleCount} people affected</p>
                  <p className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-slate-400" /> Priority: <span className="capitalize font-medium">{priority}</span></p>
                  {description && <p className="flex items-start gap-2"><Siren className="h-4 w-4 text-slate-400 mt-0.5" /> {description}</p>}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep('form')} className="btn-secondary flex-1">Edit</button>
                  <button onClick={handleSubmit} disabled={sending} className="btn-danger flex-1">
                    {sending ? 'Sending...' : <>Confirm & Send <Siren className="h-4 w-4" /></>}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'sent' && (
            <motion.div key="sent" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="card p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success-100 dark:bg-success-900/40 text-success-600 mb-4"
                >
                  <CheckCircle2 className="h-8 w-8" />
                </motion.div>
                <h2 className="text-xl font-semibold mb-2">SOS Alert Sent!</h2>
                <p className="text-sm text-slate-500 mb-6">Your emergency alert has been broadcast to {nearbyVolunteers.length} available volunteers nearby. Stay in a safe location and keep your phone accessible.</p>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-left text-sm space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Status</span>
                    <span className="badge bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-300">Awaiting volunteer</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Volunteers notified</span>
                    <span className="font-medium">{nearbyVolunteers.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Your location</span>
                    <span className="font-medium text-xs">{location.address}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="tel:100" className="btn-secondary flex-1"><Phone className="h-4 w-4" /> Call Emergency Services</a>
                  <button onClick={() => setStep('form')} className="btn-primary flex-1">Send Another Alert</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
