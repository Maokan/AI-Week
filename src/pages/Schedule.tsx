
import { useAppContext } from '../context/AppContext';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

export const Schedule = () => {
  const { currentUser, schedule, courses, users, attendance, toggleAttendance } = useAppContext();

  const getSessions = () => {
    if (currentUser?.role === 'ELEVE') {
      return schedule.filter(s => s.classId === currentUser?.classId);
    }
    if (currentUser?.role === 'PO') {
      return schedule.filter(s => s.poId === currentUser?.id);
    }
    return [];
  };

  const sessions = getSessions();
  
  // Sort sessions by time
  sessions.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return (
    <div>
      <h1 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
        Emploi du temps
      </h1>

      <div className="grid-cards">
        {sessions.map(session => {
          const course = courses.find(c => c.id === session.courseId);
          const po = users.find(u => u.id === session.poId);
          
          return (
            <div className="card" key={session.id}>
              <div style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border-color)', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--primary)' }}>
                  {course?.title || 'Cours inconnu'}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Intervenant: {po?.name || 'Inconnu'}
                </p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Date:</span>
                  <span style={{ fontWeight: 500 }}>
                    {format(parseISO(session.startTime), 'EEEE d MMMM yyyy', { locale: fr })}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Horaire:</span>
                  <span style={{ fontWeight: 500 }}>
                    {format(parseISO(session.startTime), 'HH:mm')} - {format(parseISO(session.endTime), 'HH:mm')}
                  </span>
                </div>
              </div>

              {/* Attendance System (Appel) */}
              {currentUser?.role === 'PO' && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Appel de la classe</h4>
                  <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {users.filter(u => u.role === 'ELEVE' && u.classId === session.classId).map(student => {
                      const isPresent = attendance.some(a => a.sessionId === session.id && a.studentId === student.id);
                      return (
                        <div key={student.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                          <span style={{ fontSize: '0.875rem' }}>{student.name}</span>
                          <button 
                            className={`btn ${isPresent ? 'btn-secondary' : 'btn-outline'}`}
                            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            onClick={() => toggleAttendance(session.id, student.id)}
                          >
                            {isPresent ? 'Présent' : 'Marquer présent'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {currentUser?.role === 'ELEVE' && currentUser && (
                <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Statut présence: </span>
                  {attendance.some(a => a.sessionId === session.id && a.studentId === currentUser.id) ? (
                    <span className="badge badge-secondary">Présent</span>
                  ) : (
                    <span className="badge badge-warning">En attente / Absent</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {sessions.length === 0 && (
          <p>Aucun cours planifié pour le moment.</p>
        )}
      </div>
    </div>
  );
};
