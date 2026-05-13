import React, { useEffect, useState } from 'react';

const IntroAnimation = ({ onComplete }) => {
    const [phase, setPhase] = useState('logo'); // 'logo' -> 'text' -> 'exit'

    useEffect(() => {
        const t1 = setTimeout(() => setPhase('text'), 1800);
        const t2 = setTimeout(() => setPhase('exit'), 3200);
        const t3 = setTimeout(onComplete, 3900);

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
                    0%   { opacity: 0; transform: scale(1.15); filter: brightness(0.3) blur(8px); }
                    100% { opacity: 1; transform: scale(1);    filter: brightness(1) blur(0); }
                }
                @keyframes intro-glow-pulse {
                    0%, 100% { filter: drop-shadow(0 0 20px rgba(139, 92, 246, 0.15)); }
                    50%      { filter: drop-shadow(0 0 40px rgba(139, 92, 246, 0.3)) 
                                      drop-shadow(0 0 80px rgba(6, 182, 212, 0.15)); }
                }
                @keyframes intro-text-reveal {
                    0%   { opacity: 0; transform: translateY(16px); letter-spacing: 8px; }
                    100% { opacity: 1; transform: translateY(0);    letter-spacing: 4px; }
                }
                @keyframes intro-sub-reveal {
                    0%   { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 0.5; transform: translateY(0); }
                }
                @keyframes intro-particle {
                    0%   { opacity: 0; transform: translateY(0) scale(0); }
                    20%  { opacity: 1; }
                    100% { opacity: 0; transform: translateY(-100vh) scale(1); }
                }
                .intro-particle {
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: rgba(139, 92, 246, 0.6);
                    border-radius: 50%;
                    animation: intro-particle linear forwards;
                }
            `}</style>

            {/* Particle field */}
            {Array.from({ length: 30 }).map((_, i) => (
                <div
                    key={i}
                    className="intro-particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        bottom: `${Math.random() * 20}%`,
                        animationDuration: `${2 + Math.random() * 4}s`,
                        animationDelay: `${Math.random() * 2}s`,
                        width: `${1 + Math.random() * 2}px`,
                        height: `${1 + Math.random() * 2}px`,
                        background: i % 3 === 0 ? 'rgba(6, 182, 212, 0.5)' :
                                    i % 3 === 1 ? 'rgba(139, 92, 246, 0.5)' :
                                                  'rgba(245, 158, 11, 0.3)',
                    }}
                />
            ))}

            {/* Gradient orbs background */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
            }}>
                <div style={{
                    position: 'absolute', width: '500px', height: '500px',
                    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
                    top: '20%', left: '30%', borderRadius: '50%',
                }} />
                <div style={{
                    position: 'absolute', width: '400px', height: '400px',
                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
                    bottom: '10%', right: '20%', borderRadius: '50%',
                }} />
            </div>

            {/* Logo */}
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                transform: phase === 'exit' ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.7s cubic-bezier(0.6, -0.28, 0.735, 0.045)',
                position: 'relative', zIndex: 1,
            }}>
                <img
                    src="/logo_intro.png"
                    alt="CREATACOURSE"
                    style={{
                        width: 'clamp(280px, 55vw, 700px)',
                        height: 'auto',
                        objectFit: 'contain',
                        animation: 'intro-logo-reveal 2s cubic-bezier(0.25, 1, 0.5, 1) forwards, intro-glow-pulse 3s ease-in-out 1.5s infinite',
                    }}
                />

                {/* Text block */}
                <div style={{
                    marginTop: '2rem',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: '0.5rem',
                }}>
                    <p style={{
                        color: '#fff',
                        fontSize: '1rem',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 600,
                        letterSpacing: '4px',
                        textTransform: 'uppercase',
                        opacity: phase === 'logo' ? 0 : 1,
                        animation: phase !== 'logo' ? 'intro-text-reveal 0.8s ease-out forwards' : 'none',
                    }}>
                        MINDIMMAXDEV
                    </p>
                    <p style={{
                        color: '#5c5c7a',
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        letterSpacing: '3px',
                        opacity: 0,
                        animation: phase !== 'logo' ? 'intro-sub-reveal 0.8s ease-out 0.3s forwards' : 'none',
                    }}>
                        AN AKSHITH REDDY PRODUCTION
                    </p>
                </div>
            </div>
        </div>
    );
};

export default IntroAnimation;
