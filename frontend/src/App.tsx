import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import NotFoundPage from './pages/NotFoundPage';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import CitizenSOS from './pages/citizen/CitizenSOS';
import CitizenRequests from './pages/citizen/CitizenRequests';
import CitizenReliefCamps from './pages/citizen/CitizenReliefCamps';
import CitizenMissingPersons from './pages/citizen/CitizenMissingPersons';
import CitizenProfile from './pages/citizen/CitizenProfile';
// import CitizenNotifications from './pages/citizen/CitizenNotifications';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import VolunteerMissions from './pages/volunteer/VolunteerMissions';
import VolunteerHistory from './pages/volunteer/VolunteerHistory';
import VolunteerProfile from './pages/volunteer/VolunteerProfile';
import NgoDashboard from './pages/ngo/NgoDashboard';
import NgoReliefCamps from './pages/ngo/NgoReliefCamps';
import NgoVolunteers from './pages/ngo/NgoVolunteers';
import NgoDonations from './pages/ngo/NgoDonations';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVerifications from './pages/admin/AdminVerifications';
import AdminMessages from './pages/admin/AdminMessages';
import AdminAlerts from './pages/admin/AdminAlerts';
import AdminReports from './pages/admin/AdminReports';
import NotificationsPage from './pages/NotificationsPage';
import ReliefCampsPage from './pages/ReliefCampsPage';
import MissingPersonsPage from './pages/MissingPersonsPage';
import AlertsPage from './pages/AlertsPage';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

const roleDashboards: Record<string, string> = {
  citizen: '/app/citizen',
  volunteer: '/app/volunteer',
  ngo: '/app/ngo',
  admin: '/app/admin',
};

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={roleDashboards[user.role] || '/'} replace />;
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public landing */}
              <Route path="/" element={<><Navbar /><LandingPage /><Footer /></>} />

              {/* Public resources */}
              <Route path="/relief-camps" element={<><Navbar /><ReliefCampsPage /><Footer /></>} />
              <Route path="/missing-persons" element={<><Navbar /><MissingPersonsPage /><Footer /></>} />
              <Route path="/alerts" element={<><Navbar /><AlertsPage /><Footer /></>} />

              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />

              {/* Role-based redirect from /app */}
              <Route path="/app" element={<RoleRedirect />} />

              {/* Citizen */}
              <Route path="/app/citizen" element={<ProtectedRoute roles={['citizen']}><CitizenDashboard /></ProtectedRoute>} />
              <Route path="/app/citizen/sos" element={<ProtectedRoute roles={['citizen']}><CitizenSOS /></ProtectedRoute>} />
              <Route path="/app/citizen/requests" element={<ProtectedRoute roles={['citizen']}><CitizenRequests /></ProtectedRoute>} />
              <Route path="/app/citizen/relief-camps" element={<ProtectedRoute roles={['citizen']}><CitizenReliefCamps /></ProtectedRoute>} />
              <Route path="/app/citizen/missing-persons" element={<ProtectedRoute roles={['citizen']}><CitizenMissingPersons /></ProtectedRoute>} />
              <Route path="/app/citizen/profile" element={<ProtectedRoute roles={['citizen']}><CitizenProfile /></ProtectedRoute>} />

              {/* Volunteer */}
              <Route path="/app/volunteer" element={<ProtectedRoute roles={['volunteer']}><VolunteerDashboard /></ProtectedRoute>} />
              <Route path="/app/volunteer/missions" element={<ProtectedRoute roles={['volunteer']}><VolunteerMissions /></ProtectedRoute>} />
              <Route path="/app/volunteer/history" element={<ProtectedRoute roles={['volunteer']}><VolunteerHistory /></ProtectedRoute>} />
              <Route path="/app/volunteer/profile" element={<ProtectedRoute roles={['volunteer']}><VolunteerProfile /></ProtectedRoute>} />

              {/* NGO */}
              <Route path="/app/ngo" element={<ProtectedRoute roles={['ngo']}><NgoDashboard /></ProtectedRoute>} />
              <Route path="/app/ngo/relief-camps" element={<ProtectedRoute roles={['ngo']}><NgoReliefCamps /></ProtectedRoute>} />
              <Route path="/app/ngo/volunteers" element={<ProtectedRoute roles={['ngo']}><NgoVolunteers /></ProtectedRoute>} />
              <Route path="/app/ngo/donations" element={<ProtectedRoute roles={['ngo']}><NgoDonations /></ProtectedRoute>} />

              {/* Admin */}
              <Route path="/app/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/app/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
              <Route path="/app/admin/verifications" element={<ProtectedRoute roles={['admin']}><AdminVerifications /></ProtectedRoute>} />
              <Route path="/app/admin/messages" element={<ProtectedRoute roles={['admin']}><AdminMessages /></ProtectedRoute>} />
              <Route path="/app/admin/alerts" element={<ProtectedRoute roles={['admin']}><AdminAlerts /></ProtectedRoute>} />
              <Route path="/app/admin/reports" element={<ProtectedRoute roles={['admin']}><AdminReports /></ProtectedRoute>} />

              {/* Shared */}
              <Route path="/app/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={<><Navbar /><NotFoundPage /><Footer /></>} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
