import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Check, X } from 'lucide-react';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Password strength
    const getStrength = (pw) => {
        let s = 0;
        if (pw.length >= 6) s++;
        if (pw.length >= 10) s++;
        if (/[A-Z]/.test(pw)) s++;
        if (/[0-9]/.test(pw)) s++;
        if (/[^a-zA-Z0-9]/.test(pw)) s++;
        return s;
    };
    const strength = getStrength(formData.password);
    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'][strength] || '';
    const strengthColor = ['', 'var(--danger)', 'var(--accent)', 'var(--accent)', 'var(--success)', 'var(--success)'][strength] || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (!formData.gender) {
            setError('Please select a gender');
            return;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await signup(formData.username, formData.password, formData.email, formData.gender);
            navigate('/');
        } catch (err) {
            setError(err.message.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
        } finally {
            setLoading(false);
        }
    };

    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
        { value: 'prefer-not-to-say', label: 'Prefer not to say' },
    ];

    const GoogleIcon = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
    );

    const handleGoogleSignup = async () => {
        setError('');
        setLoading(true);
        try {
            await loginWithGoogle();
            navigate('/');
        } catch (err) {
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
            <div className="floating-orbs">
                <div className="orb" />
                <div className="orb" />
                <div className="orb" />
            </div>

            <div className="animate-scale-in" style={{
                width: '100%',
                maxWidth: '460px',
                position: 'relative',
                zIndex: 1,
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    <img
                        src="/logo.png"
                        alt="Cretacourse"
                        style={{
                            width: '56px', height: '56px',
                            objectFit: 'contain',
                            margin: '0 auto var(--spacing-md)',
                            borderRadius: 'var(--radius-lg)',
                            filter: 'drop-shadow(0 0 12px rgba(139, 92, 246, 0.3))',
                        }}
                    />
                    <h1 className="text-display" style={{ fontSize: '1.75rem', marginBottom: 'var(--spacing-xs)' }}>
                        Create account
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        Start your learning journey today
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

                    {/* Google Signup Button */}
                    <button
                        onClick={handleGoogleSignup}
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
                            or sign up with email
                        </span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {/* Username */}
                        <div>
                            <label className="input-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="input"
                                placeholder="Choose a username"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="input-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input"
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        {/* Password row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                            <div>
                                <label className="input-label">Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="••••••••"
                                        required
                                        autoComplete="new-password"
                                        style={{ paddingRight: '40px' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute', right: '10px', top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'var(--text-muted)', padding: '4px',
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Confirm</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="••••••••"
                                        required
                                        autoComplete="new-password"
                                    />
                                    {formData.confirmPassword && (
                                        <div style={{
                                            position: 'absolute', right: '10px', top: '50%',
                                            transform: 'translateY(-50%)',
                                        }}>
                                            {formData.password === formData.confirmPassword ?
                                                <Check size={16} color="var(--success)" /> :
                                                <X size={16} color="var(--danger)" />
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Password strength indicator */}
                        {formData.password && (
                            <div className="animate-fade-in">
                                <div style={{
                                    display: 'flex', gap: '4px', marginBottom: '4px',
                                }}>
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} style={{
                                            flex: 1, height: '3px',
                                            borderRadius: 'var(--radius-full)',
                                            background: i <= strength ? strengthColor : 'var(--bg-tertiary)',
                                            transition: 'background 0.3s',
                                        }} />
                                    ))}
                                </div>
                                <span style={{
                                    fontSize: '0.7rem',
                                    color: strengthColor,
                                    fontWeight: 500,
                                }}>
                                    {strengthLabel}
                                </span>
                            </div>
                        )}

                        {/* Gender — Styled radio buttons */}
                        <div>
                            <label className="input-label">Gender</label>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: 'var(--spacing-xs)',
                            }}>
                                {genderOptions.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, gender: opt.value })}
                                        style={{
                                            padding: '10px 4px',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: '0.78rem',
                                            fontWeight: 500,
                                            textAlign: 'center',
                                            border: formData.gender === opt.value
                                                ? '1px solid var(--primary)'
                                                : '1px solid var(--border-color)',
                                            background: formData.gender === opt.value
                                                ? 'var(--primary-subtle)'
                                                : 'var(--bg-tertiary)',
                                            color: formData.gender === opt.value
                                                ? 'var(--primary)'
                                                : 'var(--text-secondary)',
                                            transition: 'all var(--transition-smooth)',
                                        }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
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
                                    <UserPlus size={18} />
                                    Create Account
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
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
