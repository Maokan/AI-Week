
import { useAppContext } from '../context/AppContext';
import { GraduationCap, Library, Users, FolderOpen } from 'lucide-react';

export const Dashboard = () => {
  const { currentUser, grades, courses, users, seedDb } = useAppContext();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="card-title" style={{ fontSize: '1.5rem', margin: 0 }}>
          Bienvenue, {currentUser?.name || "Utilisateur"}
        </h1>
        <button className="btn btn-outline" onClick={async () => { await seedDb(); alert("Base de données initialisée !"); }}>
          Initialiser les données (DB Seed)
        </button>
      </div>
      
      <div className="grid-cards">
        {/* ELEVE Stats */}
        {currentUser?.role === 'ELEVE' && (
          <>
            <div className="card">
              <div className="card-title"><GraduationCap size={20} /> Moyenne Générale</div>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                {(() => {
                  const myGrades = grades.filter(g => g.studentId === currentUser?.id);
                  if (myGrades.length === 0) return "-- / 20";
                  return (myGrades.reduce((acc, curr) => acc + curr.value, 0) / myGrades.length).toFixed(2) + " / 20";
                })()}
              </p>
            </div>
            <div className="card">
              <div className="card-title"><Library size={20} /> Cours Disponibles</div>
              <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{courses.length}</p>
            </div>
          </>
        )}

        {/* PO Stats */}
        {currentUser?.role === 'PO' && (
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
        {(currentUser?.role === 'TUTEUR' || currentUser?.role === 'DIRECTION') && (
           <div className="card">
             <div className="card-title"><FolderOpen size={20} /> Espace de travail</div>
             <p>Consultez les menus sur la gauche pour gérer vos projets et affectations.</p>
           </div>
        )}
      </div>
    </div>
  );
};
