import { LayoutDashboard, Tent, Users, HeartHandshake } from 'lucide-react';
import type { DashboardConfig } from '../../components/layout/DashboardLayout';

export const ngoNav: DashboardConfig = {
  role: 'ngo',
  title: 'NGO Dashboard',
  nav: [
    { label: 'Overview', to: '/app/ngo', icon: LayoutDashboard },
    { label: 'Relief Camps', to: '/app/ngo/relief-camps', icon: Tent },
    { label: 'Volunteers', to: '/app/ngo/volunteers', icon: Users },
    { label: 'Donations', to: '/app/ngo/donations', icon: HeartHandshake },
  ],
};
