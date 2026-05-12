import React, { useEffect, useState } from 'react';

const IntroAnimation = ({ onComplete }) => {
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        // Start exit sequence earlier to make it feel snappy
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(onComplete, 800); // Wait for exit animation
        }, 3500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#000',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99999,
            overflow: 'hidden',
            opacity: exiting ? 0 : 1,
            transition: 'opacity 0.8s ease-in-out',
            pointerEvents: 'none' // Let clicks pass through if it gets stuck
        }}>
            <style>
                {`
          @keyframes cinematicFade {
            0% { opacity: 0; transform: scale(1.1); filter: brightness(0.5) blur(5px); }
            100% { opacity: 1; transform: scale(1); filter: brightness(1) blur(0px); }
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
            </style>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transform: exiting ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.8s cubic-bezier(0.6, -0.28, 0.735, 0.045)'
            }}>
                <img
                    src="/logo_intro.png"
                    alt="CREATACOURSE"
                    style={{
                        width: 'clamp(300px, 60vw, 800px)',
                        height: 'auto',
                        objectFit: 'contain',
                        animation: 'cinematicFade 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                        filter: 'drop-shadow(0 0 15px rgba(0, 242, 254, 0.1))' // Very subtle glow, not a box
                    }}
                />

                <div style={{
                    marginTop: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    animation: 'fadeInUp 1s ease-out 0.5s forwards', // Delay start
                    opacity: 0 // Start hidden
                }}>
                    <p style={{
                        color: '#fff',
                        fontSize: '1.2rem',
                        letterSpacing: '3px',
                        marginBottom: '0.5rem',
                        fontFamily: 'monospace',
                        fontWeight: 'bold'
                    }}>
                        MINDIMMAXDEV
                    </p>
                    <p style={{
                        color: '#64748b',
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}>
                        AN AKSHITH REDDY PRODUCTION
                    </p>
                </div>
            </div>
        </div>
    );
};

export default IntroAnimation;
