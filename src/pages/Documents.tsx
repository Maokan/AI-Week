import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { UploadCloud, File, Trash2 } from 'lucide-react';

export const Documents = () => {
  const { activeRole, currentUser, users } = useAppContext();
  
  // Mocking isolated state for simplicity
  const [docs] = useState([
    { id: 'd1', title: 'Rapport_Final.pdf', uploaderId: 'u1', timestamp: new Date().toISOString() }
  ]);

  if (activeRole === 'ELEVE' || activeRole === 'TUTEUR') {
    const visibleDocs = activeRole === 'ELEVE' 
      ? docs.filter(d => d.uploaderId === currentUser?.id)
      : docs; // Tuteur voit tout dans ce mock basique

    return (
      <div>
        <h1 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
          {activeRole === 'ELEVE' ? 'Mes documents déposés' : 'Dépôts des élèves'}
        </h1>

        <div className="grid-cards">
          {activeRole === 'ELEVE' && (
            <div className="card" style={{ borderStyle: 'dashed', borderWidth: '2px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', cursor: 'pointer' }}>
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
                <UploadCloud size={32} />
              </div>
              <h3 style={{ fontWeight: 600, marginBottom: '8px' }}>Cliquez pour déposer un document</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>PDF, DOCX, ZIP supportés</p>
            </div>
          )}

          {visibleDocs.map(doc => {
            const uploader = users.find(u => u.id === doc.uploaderId);
            return (
              <div className="card" key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'var(--bg-hover)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                  <File size={24} color="var(--text-muted)" />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: 600, fontSize: '1rem' }}>{doc.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Déposé par: {uploader?.name} le {new Date(doc.timestamp).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                {activeRole === 'ELEVE' && (
                  <button className="btn btn-outline" style={{ color: 'var(--accent)', borderColor: 'var(--accent-light)' }}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return <div>Cette section est réservée aux élèves et tuteurs.</div>;
};
