
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  GraduationCap, LayoutDashboard, Calendar, 
  Library, FolderOpen, KanbanSquare, MessageSquare, 
  Settings, Users 
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { Role } from '../context/AppContext';

export const Layout = () => {
  const { activeRole, setActiveRole, currentUser } = useAppContext();
  const location = useLocation();

  const getNavItems = (role: Role) => {
    const items = [
      { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      { path: '/messages', label: 'Messages', icon: <MessageSquare size={20} /> },
    ];

    if (role === 'ELEVE') {
      items.push(
        { path: '/grades', label: 'Mes Notes', icon: <GraduationCap size={20} /> },
        { path: '/schedule', label: 'Emploi du temps', icon: <Calendar size={20} /> },
        { path: '/courses', label: 'Cours', icon: <Library size={20} /> },
        { path: '/documents', label: 'Dépôts', icon: <FolderOpen size={20} /> },
        { path: '/projects', label: 'Projets', icon: <KanbanSquare size={20} /> }
      );
    } else if (role === 'PO') {
       items.push(
        { path: '/grades', label: 'Gestion Notes', icon: <GraduationCap size={20} /> },
        { path: '/schedule', label: 'Emploi du temps', icon: <Calendar size={20} /> },
        { path: '/courses', label: 'Gestion Cours', icon: <Library size={20} /> },
        { path: '/assignments', label: 'Affectations (PO)', icon: <Users size={20} /> }
      );
    } else if (role === 'TUTEUR') {
      items.push(
        { path: '/documents', label: 'Dépôts Élèves', icon: <FolderOpen size={20} /> },
        { path: '/projects', label: 'Suivi Projets', icon: <KanbanSquare size={20} /> }
      );
    } else if (role === 'DIRECTION') {
      items.push(
        { path: '/assignments', label: 'Administration', icon: <Settings size={20} /> }
      );
    }

    return items;
  };

  const navItems = getNavItems(activeRole);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <GraduationCap size={28} />
          <span>EduPlatform</span>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
              {currentUser?.name.charAt(0)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{currentUser?.name}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser?.role}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="main-wrapper">
        <header className="topbar">
          <div className="topbar-title">
            {navItems.find(n => n.path === location.pathname)?.label || 'Plateforme'}
          </div>
          
          <div className="topbar-actions">
             <div className="role-switcher">
               <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vue Demo:</span>
               <select 
                 value={activeRole} 
                 onChange={(e) => setActiveRole(e.target.value as Role)}
               >
                 <option value="ELEVE">Élève</option>
                 <option value="PO">Pedagogic Officer (PO)</option>
                 <option value="TUTEUR">Tuteur</option>
                 <option value="DIRECTION">Direction</option>
               </select>
             </div>
          </div>
        </header>

        <section className="content-area">
          <Outlet />
        </section>
      </main>
    </div>
  );
};
