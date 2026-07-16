import { LayoutDashboard, Siren, History, User, Star, Zap } from 'lucide-react';
import type { DashboardConfig } from '../../components/layout/DashboardLayout';

export const volunteerNav: DashboardConfig = {
  role: 'volunteer',
  title: 'Volunteer Dashboard',
  nav: [
    { label: 'Overview', to: '/app/volunteer', icon: LayoutDashboard },
    { label: 'Active Missions', to: '/app/volunteer/missions', icon: Siren },
    { label: 'Mission History', to: '/app/volunteer/history', icon: History },
    { label: 'Profile', to: '/app/volunteer/profile', icon: User },
  ],
};
