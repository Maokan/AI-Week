
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
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
import { useAppContext } from './context/AppContext';

const AppContent = () => {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="grades" element={<Grades />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="courses" element={<Courses />} />
          <Route path="documents" element={<Documents />} />
          <Route path="projects" element={<ProjectBoard />} />
          <Route path="messages" element={<Messages />} />
          <Route path="assignments" element={<Assignments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
