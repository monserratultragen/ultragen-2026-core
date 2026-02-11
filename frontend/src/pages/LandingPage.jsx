import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import './LandingPage.css';

const LandingPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/home'); // Redirect to main app after login
        } catch (err) {
            setError('Error de acceso: ' + err.message);
        }
    };

    const handleGuestLogin = async () => {
        try {
            // For now, we can just redirect or use anonymous auth if enabled
            // await signInAnonymously(auth); 
            navigate('/home');
        } catch (err) {
            setError('Error al entrar como invitado: ' + err.message);
        }
    };

    return (
        <div className="landing-container">
            <div className="landing-content">
                <div className="login-section">
                    <h1 className="stranger-title">ULTRAGEN</h1>
                    <p className="subtitle">Entrada al Otro Lado</p>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <input
                                type="email"
                                placeholder="Correo Electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="stranger-input"
                            />
                        </div>
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="stranger-input"
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}

                        <button type="submit" className="stranger-btn primary-btn">
                            INGRESAR
                        </button>
                    </form>

                    <button onClick={handleGuestLogin} className="stranger-btn guest-btn">
                        Entrar como Invitado
                    </button>
                </div>

                <div className="guestbook-section">
                    <h2 className="guestbook-title">Libro de Visitas</h2>
                    <div className="guestbook-content">
                        <p className="guestbook-placeholder">
                            Las voces de los visitantes resuenan en el vacío...
                        </p>
                        {/* Placeholder for future guestbook entries */}
                        <div className="guestbook-entry">
                            <span className="entry-name">Will:</span>
                            <span className="entry-msg">¿Hay alguien ahí?</span>
                        </div>
                        <div className="guestbook-entry">
                            <span className="entry-name">Mike:</span>
                            <span className="entry-msg">Te escucho.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
