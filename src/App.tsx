import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { Layout } from './components/Layout';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Grades } from './pages/Grades';
import { Schedule } from './pages/Schedule';
import { Courses } from './pages/Courses';
import { Documents } from './pages/Documents';
import { ProjectBoard } from './pages/ProjectBoard';
import { Messages } from './pages/Messages';
import { Assignments } from './pages/Assignments';
import { Auth } from './pages/Auth';
import { Landing } from './pages/landing';

// Component to protect authenticated routes
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { currentUser } = useAppContext();
  return currentUser ? element : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { currentUser } = useAppContext();

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={currentUser ? <Navigate to="/dashboard" replace /> : <Landing />} />
      <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <Auth />} />

      {/* Protected Routes directly connected to Layout */}
      <Route element={<ProtectedRoute element={<Layout />} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/projects" element={<ProjectBoard />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/assignments" element={<Assignments />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
