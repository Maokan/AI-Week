
import { useAppContext } from '../context/AppContext';
import { FileText, Download, ExternalLink } from 'lucide-react';

export const Courses = () => {
  const { courses, users, currentUser } = useAppContext();

  const getVisibleCourses = () => {
    if (currentUser?.role === 'PO') {
       return courses.filter(c => c.poId === currentUser?.id);
    }
    // Eleves read all available courses in this mock
    return courses;
  };

  const visibleCourses = getVisibleCourses();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="card-title" style={{ fontSize: '1.5rem', margin: 0 }}>Centralisation des Cours</h1>
        {currentUser?.role === 'PO' && (
          <button className="btn btn-primary">
            + Ajouter un cours
          </button>
        )}
      </div>

      <div className="grid-cards">
        {visibleCourses.map(course => {
          const po = users.find(u => u.id === course.poId);
          return (
            <div className="card" key={course.id} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ padding: '12px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-md)' }}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{course.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Proposé par {po?.name}</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', marginBottom: '20px' }}>
                  Document PDF complet contenant les supports de formation.
                </p>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => alert("Simulation de lecture PDF en ligne...")}>
                  <ExternalLink size={16} /> Lire
                </button>
                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => alert("Simulation de téléchargement PDF...")}>
                  <Download size={16} /> Télécharger
                </button>
              </div>
            </div>
          );
        })}
        
        {visibleCourses.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
            <p style={{ color: 'var(--text-muted)' }}>Aucun cours disponible.</p>
          </div>
        )}
      </div>
    </div>
  );
};
