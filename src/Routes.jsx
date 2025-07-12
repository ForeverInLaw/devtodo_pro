import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';
import TaskDashboard from './pages/task-dashboard';
import LoginForm from './pages/login';
import NotFound from './pages/NotFound';
import SignUpForm from './pages/signup';
import TaskDetailView from './pages/task-detail-view';
import ProjectManagementPage from './pages/project-management';
import HeaderNavigation, { ThemeProvider } from './components/ui/HeaderNavigation';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const ProjectRoutes = () => {
  const location = useLocation();
  const noHeaderPaths = ['/login', '/signup'];
  const showHeader = !noHeaderPaths.includes(location.pathname);

  return (
    <ThemeProvider>
      {showHeader && <HeaderNavigation />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
          path="/task-dashboard"
          element={
            <ProtectedRoute>
              <TaskDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/task-detail-view"
          element={
            <ProtectedRoute>
              <TaskDetailView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectManagementPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/task-dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </ThemeProvider>
  );
};

const AppRouter = () => (
  <Router>
    <ProjectRoutes />
  </Router>
);

export default AppRouter;