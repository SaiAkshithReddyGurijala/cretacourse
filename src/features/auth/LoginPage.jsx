import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, loginWithGoogle, user } = useAuth();
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

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        try {
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
            console.error("Google login failed:", err);
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
                        alt="Cretacourse"
                        style={{
                            width: '64px',
                            height: '64px',
                            objectFit: 'contain',
                            margin: '0 auto var(--spacing-md)',
                            borderRadius: 'var(--radius-lg)',
                            filter: 'drop-shadow(0 0 16px rgba(139, 92, 246, 0.35))',
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

                    {/* Google Login Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="btn"
                        style={{
                            width: '100%',
                            justifyContent: 'center',
                            padding: '12px',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 'var(--spacing-lg)',
                            transition: 'all var(--transition-smooth)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = 'var(--glass-border)';
                            e.currentTarget.style.background = 'var(--bg-elevated)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border-color)';
                            e.currentTarget.style.background = 'var(--bg-tertiary)';
                        }}
                    >
                        <GoogleIcon />
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)',
                        marginBottom: 'var(--spacing-lg)',
                    }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                            or
                        </span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                    </div>

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
