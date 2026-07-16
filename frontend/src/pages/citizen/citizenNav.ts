import {
  LayoutDashboard, Siren, PackageCheck, Tent, UserSearch, User, Bell,
} from 'lucide-react';
import type { DashboardConfig } from '../../components/layout/DashboardLayout';

export const citizenNav: DashboardConfig = {
  role: 'citizen',
  title: 'Citizen Dashboard',
  nav: [
    { label: 'Overview', to: '/app/citizen', icon: LayoutDashboard },
    { label: 'Emergency SOS', to: '/app/citizen/sos', icon: Siren },
    { label: 'My Requests', to: '/app/citizen/requests', icon: PackageCheck },
    { label: 'Relief Camps', to: '/app/citizen/relief-camps', icon: Tent },
    { label: 'Missing Persons', to: '/app/citizen/missing-persons', icon: UserSearch },
    { label: 'Notifications', to: '/app/notifications', icon: Bell },
    { label: 'Profile', to: '/app/citizen/profile', icon: User },
  ],
};
