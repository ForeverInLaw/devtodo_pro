import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import TaskDashboard from './pages/task-dashboard';
import LoginForm from './pages/login';
import NotFound from './pages/NotFound';
import SignUpForm from './pages/signup';
import TaskDetailView from './pages/task-detail-view';

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
  return (
    <Router>
      <Routes>
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
        <Route path="/" element={<Navigate to="/task-dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default ProjectRoutes;