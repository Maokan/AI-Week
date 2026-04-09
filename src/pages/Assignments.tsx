import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export const Assignments = () => {
  const { activeRole, users, assignPoToClass } = useAppContext();
  const [selectedPo, setSelectedPo] = useState('');
  const [selectedClass, setSelectedClass] = useState('c1');

  if (activeRole !== 'PO' && activeRole !== 'DIRECTION') {
     return <div>Accès non autorisé</div>;
  }

  return (
    <div>
      <h1 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
        {activeRole === 'DIRECTION' ? 'Administration & Affectations' : 'Affectations de classe'}
      </h1>

      <div className="grid-cards">
        {activeRole === 'DIRECTION' && (
          <div className="card">
            <h2 className="card-title" style={{ fontSize: '1.125rem' }}>Assigner un PO à une classe</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Interface pour la direction pour gérer les classes.
            </p>

            <div className="form-group">
              <label className="form-label">Pedagogic Officer (PO)</label>
              <select className="form-control" value={selectedPo} onChange={e => setSelectedPo(e.target.value)}>
                <option value="">Sélectionner un PO</option>
                {users.filter(u => u.role === 'PO').map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Classe/Groupe</label>
              <select className="form-control" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                <option value="c1">Groupe 1 (Info)</option>
                <option value="c2">Groupe 2 (Design)</option>
              </select>
            </div>

            <button 
              className="btn btn-primary" 
              onClick={() => {
                if(selectedPo) {
                  assignPoToClass(selectedPo, selectedClass);
                  alert('Affectation réussie!');
                }
              }}
            >
              Sauvegarder
            </button>
          </div>
        )}

        {/* Both Roles can have multiple cards depending on explicit spec */}
        {activeRole === 'PO' && (
          <div className="card">
            <h2 className="card-title" style={{ fontSize: '1.125rem' }}>Assignation d'un élève à un groupe de travail</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Vous pouvez répartir vos élèves dans des sous-groupes de travail.
              (Fonctionnalité en cours de développement - Maquette).
            </p>
            <div style={{ marginTop: '20px' }}>
              <button className="btn btn-outline" onClick={() => alert("Ouvre le panneau de création de groupe")}>
                Créer un groupe de travail
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
