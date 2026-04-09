
import { useAppContext } from '../context/AppContext';
import { GraduationCap, Library, Users, FolderOpen } from 'lucide-react';

export const Dashboard = () => {
  const { activeRole, currentUser, grades, courses, users } = useAppContext();

  return (
    <div>
      <h1 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
        Bienvenue, {currentUser?.name}
      </h1>
      
      <div className="grid-cards">
        {/* ELEVE Stats */}
        {activeRole === 'ELEVE' && (
          <>
            <div className="card">
              <div className="card-title"><GraduationCap size={20} /> Moyenne Générale</div>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                {(grades.filter(g => g.studentId === currentUser?.id).reduce((acc, curr) => acc + curr.value, 0) / 
                 (grades.filter(g => g.studentId === currentUser?.id).length || 1)).toFixed(2)} / 20
              </p>
            </div>
            <div className="card">
              <div className="card-title"><Library size={20} /> Cours Disponibles</div>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{courses.length}</p>
            </div>
          </>
        )}

        {/* PO Stats */}
        {activeRole === 'PO' && (
          <>
            <div className="card">
               <div className="card-title"><Users size={20} /> Élèves de ma classe</div>
               <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                 {users.filter(u => u.role === 'ELEVE' && u.classId === currentUser?.classId).length}
               </p>
            </div>
            <div className="card">
               <div className="card-title"><Library size={20} /> Mes Cours</div>
               <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                 {courses.filter(c => c.poId === currentUser?.id).length}
               </p>
            </div>
          </>
        )}
        
        {/* Others */}
        {(activeRole === 'TUTEUR' || activeRole === 'DIRECTION') && (
           <div className="card">
             <div className="card-title"><FolderOpen size={20} /> Espace de travail</div>
             <p>Consultez les menus sur la gauche pour gérer vos projets et affectations.</p>
           </div>
        )}
      </div>
    </div>
  );
};
