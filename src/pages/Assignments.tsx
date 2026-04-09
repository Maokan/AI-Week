import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export const Assignments = () => {
  const { currentUser, users, assignUserClass, updateUserRole } = useAppContext();
  
  // State for PO assigning a student to a group
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [targetGroupId, setTargetGroupId] = useState('');

  if (currentUser?.role !== 'PO' && currentUser?.role !== 'DIRECTION') {
     return <div>Accès non autorisé</div>;
  }

  // Get distinct classes/groups for datalist auto-complete
  const classIds = Array.from(new Set(users.filter(u => u.classId).map(u => u.classId as string)));
  const students = users.filter(u => u.role === 'ELEVE');

  return (
    <div>
      <h1 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
        {currentUser?.role === 'DIRECTION' ? 'Administration & Rôles' : 'Groupes de Travail & Affectations'}
      </h1>

      <div className="grid-cards">
        
        {/* ADMINISTRATION PANEL (DIRECTION ONLY) */}
        {currentUser?.role === 'DIRECTION' && (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <h2 className="card-title" style={{ fontSize: '1.125rem' }}>Gestion des Utilisateurs</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Modifiez le rôle des utilisateurs et assignez la classe initiale des étudiants.
            </p>
            
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Identifiant</th>
                    <th>Rôle Actuel</th>
                    <th>Modifier le Rôle</th>
                    <th>Classe (Étudiants)</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.login}</td>
                      <td>
                         <span className={`badge ${u.role === 'DIRECTION' ? 'badge-primary' : 'badge-secondary'}`}>
                           {u.role}
                         </span>
                      </td>
                      <td>
                         <select 
                           value={u.role} 
                           onChange={(e) => updateUserRole(u.id, e.target.value)}
                           className="form-control"
                           style={{ padding: '6px', fontSize: '0.875rem', width: 'auto' }}
                           disabled={u.id === currentUser.id}
                         >
                           <option value="ELEVE">Élève</option>
                           <option value="PO">Responsable (PO)</option>
                           <option value="TUTEUR">Tuteur</option>
                           <option value="DIRECTION">Direction</option>
                         </select>
                      </td>
                      <td>
                        {u.role === 'ELEVE' ? (
                          <input 
                            type="text" 
                            className="form-control"
                            style={{ padding: '6px', fontSize: '0.875rem' }}
                            value={u.classId || ''} 
                            placeholder="Ex: Classe A"
                            onChange={(e) => assignUserClass(u.id, e.target.value)}
                          />
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Non applicable</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PO WORKING GROUPS PANEL */}
        {currentUser?.role === 'PO' && (
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <h2 className="card-title" style={{ fontSize: '1.125rem' }}>Gestion des Groupes de Travail</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Assignez vos élèves à des groupes de travail (Classes expertes, Groupes Projet, etc.).
            </p>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', marginBottom: '32px', background: 'var(--bg-hover)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                <label className="form-label">Sélectionner un élève</label>
                <select className="form-control" value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)}>
                  <option value="">-- Choisir --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} {s.classId ? `(Actuel: ${s.classId})` : ''}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                <label className="form-label">Nom du groupe cible</label>
                <select 
                  className="form-control" 
                  value={targetGroupId} 
                  onChange={e => setTargetGroupId(e.target.value)}
                >
                  <option value="">-- Sélectionner --</option>
                  {classIds.map(id => <option key={id} value={id}>{id}</option>)}
                </select>
                {classIds.length === 0 && (
                  <div style={{ marginTop: '4px', fontSize: '0.75rem', color: 'var(--danger, #dc3545)' }}>Aucune classe affectée.</div>
                )}
              </div>

              <button 
                className="btn btn-primary" 
                disabled={!selectedStudentId || !targetGroupId}
                onClick={async () => {
                  try {
                    await assignUserClass(selectedStudentId, targetGroupId);
                    alert('Affectation réussie!');
                    setSelectedStudentId('');
                    setTargetGroupId('');
                  } catch (e) {
                    alert('Erreur lors de l\'affectation.');
                  }
                }}
              >
                Affecter au groupe
              </button>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>Répartition actuelle des élèves</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Élève</th>
                    <th>Groupe actuel</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr><td colSpan={2} style={{ textAlign: 'center', padding: '16px' }}>Aucun élève enregistré.</td></tr>
                  ) : (
                    students.map(student => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>
                          {student.classId ? (
                             <span className="badge badge-secondary">{student.classId}</span>
                          ) : (
                             <span className="badge badge-warning">Aucun groupe</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
