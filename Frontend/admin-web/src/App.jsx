import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/adminLayout.jsx';

// Import all your converted screens
import AdminLoginScreen from "./screens/adminLoginScreen.jsx";
import AdminDashboardScreen from "./screens/adminDashboardScreen.jsx";
import AdminIncidentManagementScreen from "./screens/adminIncidentManagementScreen.jsx";
import AdminVerificationCenterScreen from "./screens/adminVerificationCenterScreen.jsx";
import AdminResponderManagementScreen from "./screens/adminResponderManagementScreen.jsx";
import AdminDangerZoneScreen from "./screens/adminDangerZoneScreen.jsx";
import AdminAnalyticsScreen from "./screens/adminAnalyticsScreen.jsx";
import AdminUserManagementScreen from "./screens/adminUserManagementScreen.jsx";
import AdminSettingsScreen from "./screens/adminSettingsScreen.jsx";
import AdminProfileScreen from "./screens/adminProfileScreen.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page (No Sidebar/Header) */}
        <Route path="/login" element={<AdminLoginScreen />} />

        {/* Protected Routes (Wrapped in AdminLayout) */}
        <Route path="/dashboard" element={<AdminLayout title="Dashboard"><AdminDashboardScreen /></AdminLayout>} />
        <Route path="/incident" element={<AdminLayout title="Incident Management"><AdminIncidentManagementScreen /></AdminLayout>} />
        <Route path="/verification" element={<AdminLayout title="Verification Center"><AdminVerificationCenterScreen /></AdminLayout>} />
        <Route path="/responder" element={<AdminLayout title="Responder Management"><AdminResponderManagementScreen /></AdminLayout>} />
        <Route path="/dangerzone" element={<AdminLayout title="Danger Zone Management"><AdminDangerZoneScreen /></AdminLayout>} />
        <Route path="/analytics" element={<AdminLayout title="Analytics & Reports"><AdminAnalyticsScreen /></AdminLayout>} />
        <Route path="/users" element={<AdminLayout title="User Management"><AdminUserManagementScreen /></AdminLayout>} />
        <Route path="/settings" element={<AdminLayout title="System Settings"><AdminSettingsScreen /></AdminLayout>} />
        <Route path="/profile" element={<AdminLayout title="Profile"><AdminProfileScreen /></AdminLayout>} />

        {/* Redirect base URL to login or dashboard */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;