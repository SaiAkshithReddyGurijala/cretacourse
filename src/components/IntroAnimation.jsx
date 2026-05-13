import React, { useEffect, useState } from 'react';

const IntroAnimation = ({ onComplete }) => {
    const [phase, setPhase] = useState('logo'); // 'logo' -> 'text' -> 'exit'

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('text'), 1200);
        const t2 = setTimeout(() => setPhase('exit'), 2800);
        const t3 = setTimeout(onComplete, 3500);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [onComplete]);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: '#050508',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99999,
            overflow: 'hidden',
            opacity: phase === 'exit' ? 0 : 1,
            transition: 'opacity 0.7s ease-in-out',
            pointerEvents: 'none'
        }}>
            <style>{`
                @keyframes intro-logo-reveal {
                    0%   { opacity: 0; transform: scale(0.6) rotate(-5deg); filter: brightness(0) blur(20px); }
                    60%  { opacity: 1; transform: scale(1.05) rotate(0deg); filter: brightness(1.2) blur(0); }
                    100% { opacity: 1; transform: scale(1) rotate(0deg);    filter: brightness(1) blur(0); }
                }
                @keyframes intro-glow-ring {
                    0%   { box-shadow: 0 0 0px rgba(139, 92, 246, 0), 0 0 0px rgba(6, 182, 212, 0); }
                    50%  { box-shadow: 0 0 40px rgba(139, 92, 246, 0.3), 0 0 80px rgba(6, 182, 212, 0.15); }
                    100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.15), 0 0 40px rgba(6, 182, 212, 0.08); }
                }
                @keyframes intro-text-slide {
                    0%   { opacity: 0; transform: translateY(20px); letter-spacing: 12px; }
                    100% { opacity: 1; transform: translateY(0);    letter-spacing: 6px; }
                }
                @keyframes intro-sub-fade {
                    0%   { opacity: 0; transform: translateY(8px); }
                    100% { opacity: 0.6; transform: translateY(0); }
                }
                @keyframes intro-line-expand {
                    0%   { width: 0; opacity: 0; }
                    100% { width: 80px; opacity: 0.3; }
                }
                @keyframes intro-particle {
                    0%   { opacity: 0; transform: translateY(0) scale(0); }
                    15%  { opacity: 0.8; }
                    100% { opacity: 0; transform: translateY(-100vh) scale(1); }
                }
                .intro-particle {
                    position: absolute;
                    border-radius: 50%;
                    animation: intro-particle linear forwards;
                }
            `}</style>

            {/* Particle field */}
            {Array.from({ length: 40 }).map((_, i) => (
                <div
                    key={i}
                    className="intro-particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        bottom: `${Math.random() * 30}%`,
                        animationDuration: `${2.5 + Math.random() * 4}s`,
                        animationDelay: `${Math.random() * 2}s`,
                        width: `${1 + Math.random() * 3}px`,
                        height: `${1 + Math.random() * 3}px`,
                        background: i % 4 === 0 ? 'rgba(6, 182, 212, 0.6)' :
                                    i % 4 === 1 ? 'rgba(139, 92, 246, 0.6)' :
                                    i % 4 === 2 ? 'rgba(245, 158, 11, 0.4)' :
                                                  'rgba(255, 255, 255, 0.2)',
                    }}
                />
            ))}

            {/* Ambient glow orbs */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute', width: '600px', height: '600px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 60%)',
                    top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                }} />
                <div style={{
                    position: 'absolute', width: '300px', height: '300px',
                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 60%)',
                    top: '30%', right: '20%', borderRadius: '50%',
                }} />
            </div>

            {/* Logo + Text */}
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                transform: phase === 'exit' ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.7s cubic-bezier(0.6, -0.28, 0.735, 0.045)',
                position: 'relative', zIndex: 1,
            }}>
                {/* Logo icon */}
                <div style={{
                    width: '120px', height: '120px',
                    borderRadius: '28px',
                    overflow: 'hidden',
                    animation: 'intro-logo-reveal 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards, intro-glow-ring 3s ease-in-out 1s infinite',
                    marginBottom: '2rem',
                }}>
                    <img
                        src="/logo.png"
                        alt="Creatacourse"
                        style={{
                            width: '100%', height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </div>

                {/* Brand name */}
                <h1 style={{
                    color: '#fff',
                    fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    letterSpacing: '3px',
                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    opacity: phase === 'logo' ? 0 : 1,
                    animation: phase !== 'logo' ? 'intro-text-slide 0.8s ease-out forwards' : 'none',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                }}>
                    Creatacourse
                </h1>

                {/* Divider line */}
                <div style={{
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)',
                    marginBottom: '1rem',
                    opacity: 0,
                    animation: phase !== 'logo' ? 'intro-line-expand 0.6s ease-out 0.3s forwards' : 'none',
                }} />

                {/* Production credit */}
                <p style={{
                    color: '#5c5c7a',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '4px',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    opacity: 0,
                    animation: phase !== 'logo' ? 'intro-sub-fade 0.8s ease-out 0.5s forwards' : 'none',
                }}>
                    An Akshith Reddy Production
                </p>
            </div>
        </div>
    );
};

export default IntroAnimation;
