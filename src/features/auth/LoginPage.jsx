import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            console.error("Login failed:", err);
            setError(err.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-primary)',
            padding: 'var(--spacing-md)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Floating gradient orbs */}
            <div className="floating-orbs">
                <div className="orb" />
                <div className="orb" />
                <div className="orb" />
            </div>

            {/* Login card */}
            <div className="animate-scale-in" style={{
                width: '100%',
                maxWidth: '420px',
                position: 'relative',
                zIndex: 1,
            }}>
                {/* Logo area */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    <img
                        src="/logo.png"
                        alt="Creatacourse"
                        style={{
                            width: '56px',
                            height: '56px',
                            objectFit: 'contain',
                            margin: '0 auto var(--spacing-md)',
                            filter: 'drop-shadow(0 0 12px rgba(139, 92, 246, 0.3))',
                        }}
                    />
                    <h1 className="text-display" style={{
                        fontSize: '1.75rem',
                        marginBottom: 'var(--spacing-xs)',
                    }}>
                        Welcome back
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        Sign in to continue your journey
                    </p>
                </div>

                {/* Card */}
                <div className="glass-panel" style={{
                    padding: 'var(--spacing-xl)',
                    boxShadow: 'var(--shadow-lg)',
                }}>
                    {error && (
                        <div className="animate-fade-in" style={{
                            background: 'var(--danger-subtle)',
                            color: 'var(--danger)',
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 'var(--spacing-md)',
                            fontSize: '0.85rem',
                            textAlign: 'center',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                        <div>
                            <label className="input-label">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <div>
                            <label className="input-label">Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input"
                                    placeholder="Enter your password"
                                    required
                                    autoComplete="current-password"
                                    style={{ paddingRight: '44px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: 'var(--text-muted)',
                                        padding: '4px',
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                justifyContent: 'center',
                                padding: '14px',
                                fontSize: '1rem',
                                fontWeight: 600,
                                marginTop: 'var(--spacing-sm)',
                            }}
                            disabled={loading}
                        >
                            {loading ? (
                                <div style={{
                                    width: '20px', height: '20px',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderTopColor: '#fff',
                                    borderRadius: '50%',
                                    animation: 'spin 0.6s linear infinite',
                                }} />
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    Log In
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div style={{
                    marginTop: 'var(--spacing-lg)',
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)',
                }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
