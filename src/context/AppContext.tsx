import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Types
export type Role = 'ELEVE' | 'PO' | 'TUTEUR' | 'DIRECTION';

export interface User {
  id: string;
  name: string;
  role: Role;
  classId?: string; // For ELEVE / PO
}

export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  value: number; // out of 20
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
  startTime: string; // ISO String
  endTime: string;
  poId: string;
  classId: string;
}

export interface Attendance {
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
  receiverId: string; // Can be a 'GROUP_ID' or user 'ID'
  content: string;
  timestamp: string;
}

// Initial Mock Data
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice (Élève)', role: 'ELEVE', classId: 'c1' },
  { id: 'u2', name: 'Bob (Élève)', role: 'ELEVE', classId: 'c1' },
  { id: 'u3', name: 'M. Martin (PO)', role: 'PO', classId: 'c1' },
  { id: 'u4', name: 'Mme. Dupont (Direction)', role: 'DIRECTION' },
  { id: 'u5', name: 'Hugo (Tuteur)', role: 'TUTEUR' },
];

const MOCK_COURSES: Course[] = [
  { id: 'crs1', title: 'Développement React', poId: 'u3', pdfUrl: '#react-pdf' },
  { id: 'crs2', title: 'Design System & CSS', poId: 'u3', pdfUrl: '#css-pdf' },
];

const MOCK_GRADES: Grade[] = [
  { id: 'g1', studentId: 'u1', courseId: 'crs1', value: 16 },
  { id: 'g2', studentId: 'u1', courseId: 'crs2', value: 14.5 },
  { id: 'g3', studentId: 'u2', courseId: 'crs1', value: 11 },
];

const MOCK_SCHEDULE: ScheduleSession[] = [
  { id: 's1', courseId: 'crs1', startTime: '2026-04-10T09:00:00Z', endTime: '2026-04-10T11:00:00Z', poId: 'u3', classId: 'c1' },
  { id: 's2', courseId: 'crs2', startTime: '2026-04-10T14:00:00Z', endTime: '2026-04-10T17:00:00Z', poId: 'u3', classId: 'c1' },
];

// Context Interface
interface AppContextType {
  activeRole: Role;
  currentUser: User | null;
  setActiveRole: (role: Role) => void;
  // Data
  users: User[];
  courses: Course[];
  grades: Grade[];
  schedule: ScheduleSession[];
  attendance: Attendance[];
  documents: Document[];
  tasks: ProjectTask[];
  messages: Message[];
  // Actions
  addGrade: (grade: Omit<Grade, 'id'>) => void;
  toggleAttendance: (sessionId: string, studentId: string) => void;
  addTask: (task: Omit<ProjectTask, 'id'>) => void;
  updateTaskStatus: (taskId: string, status: ProjectTask['status']) => void;
  sendMessage: (msg: Omit<Message, 'id' | 'timestamp'>) => void;
  assignPoToClass: (poId: string, classId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [activeRole, setActiveRole] = useState<Role>('ELEVE');
  
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [courses] = useState<Course[]>(MOCK_COURSES);
  const [grades, setGrades] = useState<Grade[]>(MOCK_GRADES);
  const [schedule] = useState<ScheduleSession[]>(MOCK_SCHEDULE);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [documents] = useState<Document[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([
    { id: 't1', title: 'Setup GitHub Repo', status: 'DONE' },
    { id: 't2', title: 'Create Frontend Components', status: 'IN_PROGRESS' }
  ]);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', senderId: 'u3', receiverId: 'u1', content: 'N\'oubliez pas le rendu de vendredi.', timestamp: new Date().toISOString() }
  ]);

  const currentUser = users.find(u => u.role === activeRole) || users[0];

  const addGrade = (grade: Omit<Grade, 'id'>) => {
    setGrades(prev => [...prev, { ...grade, id: Date.now().toString() }]);
  };

  const toggleAttendance = (sessionId: string, studentId: string) => {
    setAttendance(prev => {
      const exists = prev.find(a => a.sessionId === sessionId && a.studentId === studentId);
      if (exists) {
        return prev.filter(a => !(a.sessionId === sessionId && a.studentId === studentId));
      } else {
        return [...prev, { sessionId, studentId, present: true }];
      }
    });
  };

  const addTask = (task: Omit<ProjectTask, 'id'>) => {
    setTasks(prev => [...prev, { ...task, id: Date.now().toString() }]);
  };

  const updateTaskStatus = (taskId: string, status: ProjectTask['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const sendMessage = (msg: Omit<Message, 'id' | 'timestamp'>) => {
    setMessages(prev => [...prev, { ...msg, id: Date.now().toString(), timestamp: new Date().toISOString() }]);
  };

  const assignPoToClass = (poId: string, classId: string) => {
    setUsers(prev => prev.map(u => u.id === poId ? { ...u, classId } : u));
  };

  return (
    <AppContext.Provider value={{
      activeRole,
      currentUser,
      setActiveRole,
      users,
      courses,
      grades,
      schedule,
      attendance,
      documents,
      tasks,
      messages,
      addGrade,
      toggleAttendance,
      addTask,
      updateTaskStatus,
      sendMessage,
      assignPoToClass
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
