import { LayoutDashboard, Users, BadgeCheck, AlertTriangle, FileBarChart, MessageSquare } from 'lucide-react';
import type { DashboardConfig } from '../../components/layout/DashboardLayout';

export const adminNav: DashboardConfig = {
  role: 'admin',
  title: 'Admin Dashboard',
  nav: [
    { label: 'Overview', to: '/app/admin', icon: LayoutDashboard },
    { label: 'User Management', to: '/app/admin/users', icon: Users },
    { label: 'Verifications', to: '/app/admin/verifications', icon: BadgeCheck },
    { label: 'Messages', to: '/app/admin/messages', icon: MessageSquare },
    { label: 'Disaster Alerts', to: '/app/admin/alerts', icon: AlertTriangle },
    { label: 'Reports', to: '/app/admin/reports', icon: FileBarChart },
  ],
};
