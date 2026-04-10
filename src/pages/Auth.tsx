import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { GraduationCap } from 'lucide-react';

export const Auth = () => {
  const { handleLogin, handleRegister } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [error, setError] = useState('');

  const submitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await handleLogin(login, password);
      } else {
        await handleRegister(name, login, password);
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', color: 'var(--primary)' }}>
          <GraduationCap size={48} />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>CTRL+A</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
          {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte étudiant'}
        </p>

        {error && (
          <div style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={submitAuth} style={{ textAlign: 'left' }}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Nom complet</label>
              <input 
                type="text" 
                className="form-control" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Identifiant de connexion</label>
            <input 
              type="text" 
              className="form-control" 
              value={login} 
              onChange={e => setLogin(e.target.value)} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input 
              type="password" 
              className="form-control" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '12px' }}>
            {isLogin ? 'Se connecter' : 'S\'inscrire'}
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Pas encore de compte ? " : "Déjà inscrit ? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
          >
            {isLogin ? "S'inscrire" : "Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
};
