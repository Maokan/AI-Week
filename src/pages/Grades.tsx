import { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export const Grades = () => {
  const { activeRole, currentUser, grades, courses, users, addGrade } = useAppContext();
  const [newGrade, setNewGrade] = useState({ studentId: '', courseId: '', value: '' });

  // ELEVE View
  if (activeRole === 'ELEVE') {
    const myGrades = grades.filter(g => g.studentId === currentUser?.id);
    const avg = myGrades.length ? myGrades.reduce((acc, curr) => acc + curr.value, 0) / myGrades.length : 0;

    return (
      <div>
        <h1 className="card-title">Mes Notes</h1>
        <div className="card">
          <p style={{ fontSize: '1.25rem', marginBottom: '16px' }}>
            Moyenne Générale: <span className="badge badge-primary">{avg.toFixed(2)} / 20</span>
          </p>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Cours</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                {myGrades.map(grade => {
                  const course = courses.find(c => c.id === grade.courseId);
                  return (
                    <tr key={grade.id}>
                      <td>{course?.title || 'Cours inconnu'}</td>
                      <td>{grade.value} / 20</td>
                    </tr>
                  );
                })}
                {myGrades.length === 0 && (
                  <tr>
                    <td colSpan={2}>Aucune note pour le moment.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // PO View
  if (activeRole === 'PO') {
    const classStudents = users.filter(u => u.role === 'ELEVE' && u.classId === currentUser?.classId);
    
    const handleAdd = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newGrade.studentId || !newGrade.courseId || newGrade.value === '') return;
      
      addGrade({
        studentId: newGrade.studentId,
        courseId: newGrade.courseId,
        value: Number(newGrade.value)
      });
      setNewGrade({ studentId: '', courseId: '', value: '' });
    };

    return (
      <div>
        <h1 className="card-title">Centralisation des Notes</h1>
        
        <div className="grid-cards">
          {/* Add a grade form */}
          <div className="card">
            <h2 className="card-title" style={{ fontSize: '1rem' }}>Ajouter une note</h2>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">Élève</label>
                <select 
                  className="form-control"
                  value={newGrade.studentId}
                  onChange={e => setNewGrade({ ...newGrade, studentId: e.target.value })}
                >
                  <option value="">Sélectionner un élève</option>
                  {classStudents.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Cours</label>
                <select 
                  className="form-control"
                  value={newGrade.courseId}
                  onChange={e => setNewGrade({ ...newGrade, courseId: e.target.value })}
                >
                  <option value="">Sélectionner un cours</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Note (/20)</label>
                <input 
                  type="number" 
                  min="0" max="20" step="0.5"
                  className="form-control"
                  value={newGrade.value}
                  onChange={e => setNewGrade({ ...newGrade, value: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Ajouter</button>
            </form>
          </div>

          {/* List of grades & averages */}
          <div className="card">
            <h2 className="card-title" style={{ fontSize: '1rem' }}>Carnet de la classe</h2>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Élève</th>
                    <th>Moyenne</th>
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map(student => {
                    const studentGrades = grades.filter(g => g.studentId === student.id);
                    const avg = studentGrades.length ? studentGrades.reduce((a, b) => a + b.value, 0) / studentGrades.length : 0;
                    return (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{studentGrades.length > 0 ? `${avg.toFixed(2)} / 20` : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>Accès non autorisé.</div>;
};
