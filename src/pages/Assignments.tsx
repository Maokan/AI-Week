import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export const Assignments = () => {
  const { currentUser, users, assignPoToClass, updateUserRole } = useAppContext();
  const [selectedPo, setSelectedPo] = useState('');
  const [selectedClass, setSelectedClass] = useState('c1');

  if (currentUser?.role !== 'PO' && currentUser?.role !== 'DIRECTION') {
     return <div>Accès non autorisé</div>;
  }

  return (
    <div>
      <h1 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
        {currentUser?.role === 'DIRECTION' ? 'Administration Globale' : 'Affectations de classe'}
      </h1>

      <div className="grid-cards">
        {currentUser?.role === 'DIRECTION' && (
          <>
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <h2 className="card-title" style={{ fontSize: '1.125rem' }}>Gestion des rôles utilisateurs</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Modifier le rôle des personnes inscrites sur la plateforme.
              </p>
              
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Identifiant</th>
                      <th>Rôle Actuel</th>
                      <th>Modifier le Rôle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.login}</td>
                        <td>{u.role}</td>
                        <td>
                           <select 
                             value={u.role} 
                             onChange={(e) => {
                               updateUserRole(u.id, e.target.value);
                             }}
                             className="form-control"
                             style={{ padding: '6px', fontSize: '0.875rem', width: 'auto' }}
                             disabled={u.id === currentUser.id} // Cannot demote self
                           >
                             <option value="ELEVE">Élève</option>
                             <option value="PO">Responsable (PO)</option>
                             <option value="TUTEUR">Tuteur</option>
                             <option value="DIRECTION">Direction (Admin)</option>
                           </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <h2 className="card-title" style={{ fontSize: '1.125rem' }}>Assigner un PO à une classe</h2>
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
          </>
        )}

        {currentUser?.role === 'PO' && (
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
