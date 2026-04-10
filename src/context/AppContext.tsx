import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { io } from 'socket.io-client';

// Types
export type Role = 'ELEVE' | 'PO' | 'TUTEUR' | 'DIRECTION';

export interface User {
  id: string;
  name: string;
  login: string;
  role: Role;
  classId?: string;
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  value: number;
  comment?: string;
}

export interface Course {
  id: string;
  title: string;
  poId: string;
  pdfUrl: string;
}

export interface ScheduleSession {
  id: string;
  courseId: string;
  startTime: string;
  endTime: string;
  poId: string;
  classId: string;
}

export interface Attendance {
  id?: string;
  sessionId: string;
  studentId: string;
  present: boolean;
}

export interface Document {
  id: string;
  title: string;
  uploaderId: string;
  url: string;
  type: 'UPLOAD' | 'RESOURCE';
}

export interface ProjectTask {
  id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assigneeId?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  courses: Course[];
  grades: Grade[];
  schedule: ScheduleSession[];
  attendance: Attendance[];
  documents: Document[];
  tasks: ProjectTask[];
  messages: Message[];
  
  handleLogin: (login: string, pass: string) => Promise<void>;
  handleRegister: (name: string, login: string, pass: string) => Promise<void>;
  handleLogout: () => void;
  updateUserRole: (userId: string, role: string) => Promise<void>;

  addGrade: (grade: Omit<Grade, 'id'>) => Promise<void>;
  addCourse: (course: Omit<Course, 'id' | 'pdfUrl'>) => Promise<Course>;
  addScheduleSession: (session: Omit<ScheduleSession, 'id'>) => Promise<void>;
  deleteScheduleSession: (sessionId: string) => Promise<void>;
  toggleAttendance: (sessionId: string, studentId: string) => Promise<void>;
  addTask: (task: Omit<ProjectTask, 'id'>) => Promise<void>;
  updateTaskStatus: (taskId: string, status: ProjectTask['status']) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  sendMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
  assignUserClass: (userId: string, classId: string) => Promise<void>;
  seedDb: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [schedule, setSchedule] = useState<ScheduleSession[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [documents] = useState<Document[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchData = async () => {
    try {
      const [uRes, cRes, gRes, sRes, aRes, tRes, mRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/courses'),
        fetch('/api/grades'),
        fetch('/api/schedule'),
        fetch('/api/attendance'),
        fetch('/api/tasks'),
        fetch('/api/messages')
      ]);
      setUsers(await uRes.json());
      setCourses(await cRes.json());
      setGrades(await gRes.json());
      setSchedule(await sRes.json());
      setAttendance(await aRes.json());
      setTasks(await tRes.json());
      setMessages(await mRes.json());
    } catch (e) {
      console.error('Failed to fetch data', e);
    }
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      fetchData();
      
      // Connect to WebSocket using the backend's explicit port since Vite runs on 5173
      const socket = io('http://localhost:3001');
      socket.on('dataUpdated', (data) => {
        console.log('Real-time update triggered by:', data);
        fetchData();
      });

      return () => {
        socket.disconnect();
      };
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Auth
  const handleLogin = async (loginStr: string, pass: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login: loginStr, password: pass })
    });
    if (!res.ok) throw new Error("Identifiants incorrects");
    setCurrentUser(await res.json());
  };

  const handleRegister = async (name: string, loginStr: string, pass: string) => {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, login: loginStr, password: pass })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur d'inscription");
    setCurrentUser(data);
  };

  const handleLogout = () => setCurrentUser(null);

  const updateUserRole = async (userId: string, role: string) => {
    const res = await fetch(`/api/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role })
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: updated.role } : u));
    }
  };

  const addGrade = async (grade: Omit<Grade, 'id'>) => {
    const res = await fetch('/api/grades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(grade)
    });
    if (res.ok) {
      const newGrade = await res.json();
      setGrades(prev => [...prev, newGrade]);
    }
  };

  const addCourse = async (course: Omit<Course, 'id' | 'pdfUrl'>) => {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    if (res.ok) {
      const newCourse = await res.json();
      setCourses(prev => [...prev, newCourse]);
      return newCourse;
    }
    throw new Error('Failed to create course');
  };

  const addScheduleSession = async (session: Omit<ScheduleSession, 'id'>) => {
    const res = await fetch('/api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    });
    if (res.ok) {
      const newSession = await res.json();
      setSchedule(prev => [...prev, newSession]);
    }
  };

  const deleteScheduleSession = async (sessionId: string) => {
    const res = await fetch(`/api/schedule/${sessionId}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      setSchedule(prev => prev.filter(s => s.id !== sessionId));
    }
  };

  const toggleAttendance = async (sessionId: string, studentId: string) => {
    const res = await fetch('/api/attendance/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, studentId })
    });
    if (res.ok) await fetchData();
  };

  const addTask = async (task: Omit<ProjectTask, 'id'>) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    if (res.ok) {
      const newTask = await res.json();
      setTasks(prev => [...prev, newTask]);
    }
  };

  const updateTaskStatus = async (taskId: string, status: ProjectTask['status']) => {
    const res = await fetch(`/api/tasks/${taskId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      const updated = await res.json();
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    }
  };

  const deleteTask = async (taskId: string) => {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  const sendMessage = async (msg: Omit<Message, 'id' | 'timestamp'>) => {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg)
    });
    if (res.ok) {
      const newMsg = await res.json();
      setMessages(prev => [...prev, newMsg]);
    }
  };

  const assignUserClass = async (userId: string, classId: string) => {
    const res = await fetch(`/api/users/${userId}/assign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ classId })
    });
    if (res.ok) {
      const updated = await res.json();
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, classId: updated.classId } : u));
    }
  };

  const seedDb = async () => {
    const res = await fetch('/api/seed', { method: 'POST' });
    if (res.ok) {
      await fetchData();
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      courses,
      grades,
      schedule,
      attendance,
      documents,
      tasks,
      messages,
      handleLogin,
      handleRegister,
      handleLogout,
      updateUserRole,
      addCourse,
      addScheduleSession,
      deleteScheduleSession,
      addGrade,
      toggleAttendance,
      addTask,
      updateTaskStatus,
      deleteTask,
      sendMessage,
      assignUserClass,
      seedDb
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
