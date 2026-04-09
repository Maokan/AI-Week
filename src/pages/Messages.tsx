import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Send } from 'lucide-react';

export const Messages = () => {
  const { users, currentUser, messages, sendMessage } = useAppContext();
  const [activeContactId, setActiveContactId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const chatUsers = users.filter(u => u.id !== currentUser?.id);
  const activeContact = chatUsers.find(u => u.id === activeContactId);

  // Pour cet exo MOCK, on va récupérer tous les messages où le user courant est impliqué avec le contact actif, ou s'il n'y a pas de sélection on montre rien
  const thread = messages.filter(m => 
    (m.senderId === currentUser?.id && m.receiverId === activeContactId) ||
    (m.senderId === activeContactId && m.receiverId === currentUser?.id)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeContactId || !currentUser) return;
    
    sendMessage({
      senderId: currentUser.id,
      receiverId: activeContactId,
      content: newMessage.trim()
    });
    setNewMessage('');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h1 className="card-title" style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Messagerie</h1>

      <div className="chat-container">
        {/* Sidebar */}
        <div className="chat-sidebar">
          <div className="chat-header">Contacts</div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {chatUsers.map(user => (
              <div 
                key={user.id}
                onClick={() => setActiveContactId(user.id)}
                style={{
                  padding: '16px',
                  borderBottom: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  background: activeContactId === user.id ? 'var(--bg-hover)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="chat-main">
          {activeContact ? (
            <>
              <div className="chat-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                 <span>Discussion avec <span style={{ color: 'var(--primary)' }}>{activeContact.name}</span></span>
              </div>
              <div className="chat-messages">
                {thread.map(msg => {
                  const isMe = msg.senderId === currentUser?.id;
                  return (
                    <div key={msg.id} className={`message-bubble ${isMe ? 'sent' : 'received'}`}>
                      {msg.content}
                      <div style={{ fontSize: '0.65rem', marginTop: '4px', opacity: 0.7, textAlign: 'right' }}>
                        {new Date(msg.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute:'2-digit' })}
                      </div>
                    </div>
                  );
                })}
                {thread.length === 0 && (
                  <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', color: 'var(--text-muted)' }}>
                    Aucun message. Commencez la discussion.
                  </div>
                )}
              </div>
              <form className="chat-input-area" onSubmit={handleSend}>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Écrivez votre message..." 
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)' }}>
              Sélectionnez une conversation pour commencer
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
