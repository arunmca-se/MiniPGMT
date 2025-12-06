import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import Board from './pages/Board';
import Projects from './pages/Projects';
import IssueDetail from './pages/IssueDetail';
import Team from './pages/Team';
import Reports from './pages/Reports';
import ComponentShowcase from './pages/ComponentShowcase';
import { Login } from './pages/Login/Login';
import { useIsAuthenticated } from './hooks/useAuth';
import './App.css';

/**
 * Main Application Component
 *
 * Handles routing for the entire application.
 * Routes:
 * - /login - Login page (public)
 * - /showcase - Component showcase page for design system demo (no layout)
 * - All other routes wrapped in AppShell layout (protected)
 */

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/showcase" element={<ComponentShowcase />} />

      {/* Protected routes with AppShell layout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppShell>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/board" element={<Board />} />
                <Route path="/issue/:issueKey" element={<IssueDetail />} />
                <Route path="/team" element={<Team />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<div className="p-8">Settings Page - Coming Soon</div>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
