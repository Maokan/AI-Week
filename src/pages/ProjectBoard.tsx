import { useState } from 'react';
import { useAppContext } from '../context/AppContext';


export const ProjectBoard = () => {
  const { tasks, addTask, updateTaskStatus } = useAppContext();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({ title: newTaskTitle, status: 'TODO' });
    setNewTaskTitle('');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="card-title" style={{ fontSize: '1.5rem', margin: 0 }}>Suivi de Projet</h1>
      </div>

      <div className="kanban-board">
        {/* TODO Column */}
        <div className="kanban-column">
          <div className="kanban-header">
            <span>À faire</span>
            <span className="badge badge-secondary">{tasks.filter(t => t.status === 'TODO').length}</span>
          </div>
          <div className="kanban-cards">
            {tasks.filter(t => t.status === 'TODO').map(task => (
              <div className="kanban-card" key={task.id}>
                <p style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '12px' }}>{task.title}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn btn-outline" style={{ flex: 1, padding: '4px', fontSize: '0.75rem' }} onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}>
                    Commencer
                  </button>
                </div>
              </div>
            ))}
          </div>
          <form style={{ marginTop: '16px' }} onSubmit={handleAdd}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Nouvelle tâche..."
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
            />
          </form>
        </div>

        {/* IN_PROGRESS Column */}
        <div className="kanban-column">
          <div className="kanban-header">
            <span>En cours</span>
            <span className="badge badge-primary">{tasks.filter(t => t.status === 'IN_PROGRESS').length}</span>
          </div>
          <div className="kanban-cards">
            {tasks.filter(t => t.status === 'IN_PROGRESS').map(task => (
              <div className="kanban-card" key={task.id}>
                <p style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: '12px' }}>{task.title}</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                   <button className="btn btn-outline" style={{ flex: 1, padding: '4px', fontSize: '0.75rem' }} onClick={() => updateTaskStatus(task.id, 'TODO')}>
                    Annuler
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1, padding: '4px', fontSize: '0.75rem' }} onClick={() => updateTaskStatus(task.id, 'DONE')}>
                    Terminer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DONE Column */}
        <div className="kanban-column">
          <div className="kanban-header">
            <span>Terminé</span>
            <span className="badge" style={{ background: 'var(--border-color)' }}>{tasks.filter(t => t.status === 'DONE').length}</span>
          </div>
          <div className="kanban-cards">
            {tasks.filter(t => t.status === 'DONE').map(task => (
              <div className="kanban-card" key={task.id} style={{ opacity: 0.7 }}>
                <p style={{ fontWeight: 500, fontSize: '0.875rem', textDecoration: 'line-through' }}>{task.title}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
