import { type ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import AuthScreen from './components/AuthScreen';
import DashboardScreen from './components/DashboardScreen';
import AgentMonitorScreen from './components/AgentMonitorScreen';
import AnalyticsScreen from './components/AnalyticsScreen';
import IncidentScreen from './components/IncidentScreen';
import WorkflowBuilderScreen from './components/WorkflowBuilderScreen';
import CommunicationScreen from './components/CommunicationScreen';
import SettingsScreen from './components/SettingsScreen';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <AuthScreen />
          </PublicRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardScreen />} />
        <Route path="agents" element={<AgentMonitorScreen />} />
        <Route path="analytics" element={<AnalyticsScreen />} />
        <Route path="incidents" element={<IncidentScreen />} />
        <Route path="workflows" element={<WorkflowBuilderScreen />} />
        <Route path="inbox" element={<CommunicationScreen />} />
        <Route path="settings" element={<SettingsScreen />} />
      </Route>
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
