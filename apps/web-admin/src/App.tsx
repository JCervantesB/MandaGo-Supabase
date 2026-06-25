import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import LoginPage from '@/pages/login';
import RegisterPage from '@/pages/register';
import DashboardPage from '@/pages/dashboard';
import MessagePage from '@/pages/message';
import CompanySettingsPage from '@/pages/settings/company';
import ProfileSettingsPage from '@/pages/settings/profile';
import UsersSettingsPage from '@/pages/settings/users';

function MessagePageWrapper() {
  const [searchParams] = useSearchParams();
  const title = searchParams.get('title') || 'Message';
  const description = searchParams.get('description') || '';
  const variant = (searchParams.get('variant') as 'info' | 'success' | 'warning' | 'error') || 'info';

  return <MessagePage title={title} description={description} variant={variant} />;
}

function AppRoutes() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />
      <Route
        path="/message"
        element={<MessagePageWrapper />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout
              sidebarCollapsed={sidebarCollapsed}
              onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              mobileOpen={mobileOpen}
              onMobileClose={() => setMobileOpen(false)}
              onMobileOpen={() => setMobileOpen(true)}
            >
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/company"
        element={
          <ProtectedRoute>
            <Layout
              sidebarCollapsed={sidebarCollapsed}
              onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              mobileOpen={mobileOpen}
              onMobileClose={() => setMobileOpen(false)}
              onMobileOpen={() => setMobileOpen(true)}
            >
              <CompanySettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/profile"
        element={
          <ProtectedRoute>
            <Layout
              sidebarCollapsed={sidebarCollapsed}
              onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              mobileOpen={mobileOpen}
              onMobileClose={() => setMobileOpen(false)}
              onMobileOpen={() => setMobileOpen(true)}
            >
              <ProfileSettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings/users"
        element={
          <ProtectedRoute>
            <Layout
              sidebarCollapsed={sidebarCollapsed}
              onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              mobileOpen={mobileOpen}
              onMobileClose={() => setMobileOpen(false)}
              onMobileOpen={() => setMobileOpen(true)}
            >
              <UsersSettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
