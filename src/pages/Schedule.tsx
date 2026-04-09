import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { format, parseISO, startOfWeek, addDays, getDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, X } from 'lucide-react';
import './Schedule.css';
import type { ScheduleSession } from '../context/AppContext';

export const Schedule = () => {
  const { currentUser, schedule, courses, users, attendance, toggleAttendance, addCourse, addScheduleSession } = useAppContext();
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ScheduleSession | null>(null);

  // Form state
  const [courseTitle, setCourseTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:00');
  const [selectedClassId, setSelectedClassId] = useState('');

  // Extract distinct classIds from students
  const classIds = Array.from(new Set(users.filter(u => u.role === 'ELEVE' && u.classId).map(u => u.classId as string)));

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

  // Grid tools (Monday to Friday, 7h to 19h)
  const currentStartOfWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = Array.from({ length: 5 }).map((_, i) => addDays(currentStartOfWeek, i));
  const hours = Array.from({ length: 13 }).map((_, i) => i + 7); // 7 to 19

  const getBlockStyle = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startHour = startDate.getHours() + (startDate.getMinutes() / 60);
    const endHour = endDate.getHours() + (endDate.getMinutes() / 60);
  
    // 1 hour = 60px height. Grid starts at 7h
    const top = (startHour - 7) * 60;
    const height = (endHour - startHour) * 60;
    return { top: `${top}px`, height: `${height}px` };
  };

  // Submit new course and session
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedClassId) return;

    try {
      // Create course
      const newCourse = await addCourse({ title: courseTitle, poId: currentUser.id });
      
      // Combine date and time
      const startDateTime = new Date(`${selectedDate}T${startTime}:00`);
      const endDateTime = new Date(`${selectedDate}T${endTime}:00`);

      // Create session
      await addScheduleSession({
        courseId: newCourse.id,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        poId: currentUser.id,
        classId: selectedClassId
      });
      
      setShowCreateModal(false);
      setCourseTitle('');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création');
    }
  };

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h1 className="card-title" style={{ fontSize: '1.5rem', margin: 0 }}>
          Planning Hebdomadaire
        </h1>
        {currentUser?.role === 'PO' && (
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowCreateModal(true)}>
            <Plus size={18} />
            Créer un cours
          </button>
        )}
      </div>

      <div className="calendar-wrapper">
        {/* Days Header */}
        <div className="calendar-days-header">
          <div className="calendar-time-col"></div> {/* empty corner */}
          {days.map((day, i) => (
            <div key={i} className="calendar-day-header">
              {format(day, 'EEEE d MMM', { locale: fr })}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="calendar-body">
          {/* Time scale */}
          <div className="calendar-time-labels">
            {hours.map(h => (
              <div key={h} className="time-label">{h}h00</div>
            ))}
          </div>

          {/* Days columns */}
          {days.map((day, dayIndex) => {
            // Find sessions for this specific day of week
            const daySessions = sessions.filter(s => getDay(new Date(s.startTime)) === getDay(day));
            
            return (
              <div key={dayIndex} className="calendar-day-column" style={{ height: `${hours.length * 60}px` }}>
                {daySessions.map(session => {
                  const course = courses.find(c => c.id === session.courseId);
                  return (
                    <div 
                      key={session.id} 
                      className="session-block" 
                      style={getBlockStyle(session.startTime, session.endTime)}
                      onClick={() => setSelectedSession(session)}
                    >
                      <div className="session-title">{course?.title}</div>
                      <div className="session-time">
                        {format(parseISO(session.startTime), 'HH:mm')} - {format(parseISO(session.endTime), 'HH:mm')}
                      </div>
                      <div className="session-time" style={{ marginTop: '4px' }}>Classe: {session.classId}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Planifier un nouveau cours</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="form-label">Titre du cours</label>
                <input type="text" className="form-control" required value={courseTitle} onChange={e => setCourseTitle(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Classe destinataire</label>
                <select className="form-control" required value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}>
                  <option value="">-- Choisir une classe --</option>
                  {classIds.map(id => (
                    <option key={id} value={id}>{id}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input type="date" className="form-control" required value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Heure de début</label>
                  <input type="time" className="form-control" min="07:00" max="19:00" required value={startTime} onChange={e => setStartTime(e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Heure de fin</label>
                  <input type="time" className="form-control" min="07:00" max="19:00" required value={endTime} onChange={e => setEndTime(e.target.value)} />
                </div>
              </div>
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowCreateModal(false)}>Annuler</button>
                <button type="submit" className="btn btn-primary">Valider la planification</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILS / ATTENDANCE MODAL */}
      {selectedSession && (
        <div className="modal-overlay" onClick={(e) => { if(e.target === e.currentTarget) setSelectedSession(null) }}>
          <div className="modal-content">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Détails du cours</h2>
              <button className="close-btn" onClick={() => setSelectedSession(null)}><X size={24} /></button>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.125rem', color: 'var(--primary)' }}>
                {courses.find(c => c.id === selectedSession.courseId)?.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Le {format(parseISO(selectedSession.startTime), 'EEEE d MMMM', { locale: fr })} <br/>
                De {format(parseISO(selectedSession.startTime), 'HH:mm')} à {format(parseISO(selectedSession.endTime), 'HH:mm')} <br/>
                Classe: <span className="badge badge-primary">{selectedSession.classId}</span>
              </p>
            </div>

            {/* Attendance List for PO */}
            {currentUser?.role === 'PO' && (
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '12px' }}>Appel de la classe</h4>
                <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                  {users.filter(u => u.role === 'ELEVE' && u.classId === selectedSession.classId).map(student => {
                    const isPresent = attendance.some(a => a.sessionId === selectedSession.id && a.studentId === student.id);
                    return (
                      <div key={student.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.875rem' }}>{student.name}</span>
                        <button 
                          className={`btn ${isPresent ? 'btn-secondary' : 'btn-outline'}`}
                          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                          onClick={() => toggleAttendance(selectedSession.id, student.id)}
                        >
                          {isPresent ? 'Présent' : 'Marquer présent'}
                        </button>
                      </div>
                    );
                  })}
                  {users.filter(u => u.role === 'ELEVE' && u.classId === selectedSession.classId).length === 0 && (
                    <div style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>Aucun élève trouvé dans cette classe.</div>
                  )}
                </div>
              </div>
            )}

            {/* Attendance status for ELEVE */}
            {currentUser?.role === 'ELEVE' && (
              <div style={{ padding: '16px', background: 'var(--bg-hover)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Votre statut : </span>
                {attendance.some(a => a.sessionId === selectedSession.id && a.studentId === currentUser.id) ? (
                  <span className="badge badge-secondary">Présent</span>
                ) : (
                  <span className="badge badge-warning">En attente d'appel / Absent</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
