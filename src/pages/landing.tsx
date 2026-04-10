import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, LogIn, ArrowRight } from 'lucide-react';
import './Landing.css';

export const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <nav className="landing-nav">
                <div className="landing-logo">
                    <GraduationCap size={32} />
                    <span>CTRL+A</span>
                </div>
                <button className="btn-glass" onClick={() => navigate('/login')}>
                    <LogIn size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
                    Connexion
                </button>
            </nav>

            <main className="landing-hero">
                <h1 className="landing-title">Réinventez la gestion de votre scolarité</h1>
                <p className="landing-subtitle">
                    Une plateforme centralisée pour suivre vos notes, gérer vos projets et communiquer avec vos encadrants.
                </p>

                <button className="btn-primary-gradient" onClick={() => navigate('/login')}>
                    Commencer maintenant
                    <ArrowRight size={20} />
                </button>

                <div className="landing-features">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="feature-title">Ressources & Cours</h3>
                        <p className="feature-desc">Consultez, lisez et téléchargez vos cours directement en ligne sans quitter la plateforme.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <Users size={24} />
                        </div>
                        <h3 className="feature-title">Suivi de Projets</h3>
                        <p className="feature-desc">Gérez vos groupes de travail, suivez l'avancement et laissez notre IA vous assigner efficacement.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <GraduationCap size={24} />
                        </div>
                        <h3 className="feature-title">Espace Scolaire</h3>
                        <p className="feature-desc">Notes, plannings, feuilles d'appel et plus encore. Tout ce dont vous avez besoin au même endroit.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};
