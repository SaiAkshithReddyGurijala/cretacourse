import React from 'react';
import { useGamification } from '../features/gamification/GamificationContext';
import { X } from 'lucide-react';

const XPToast = () => {
    const { notifications, dismissNotification } = useGamification();

    if (notifications.length === 0) return null;

    const getStyle = (type) => {
        switch (type) {
            case 'badge':
                return {
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.95), rgba(6, 182, 212, 0.95))',
                    borderColor: 'var(--primary)',
                    shadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                };
            case 'levelup':
                return {
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.95), rgba(239, 68, 68, 0.95))',
                    borderColor: 'var(--accent)',
                    shadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
                };
            case 'streak':
                return {
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.95), rgba(245, 158, 11, 0.8))',
                    borderColor: 'var(--accent)',
                    shadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
                };
            default: // xp
                return {
                    background: 'rgba(18, 18, 26, 0.95)',
                    borderColor: 'var(--primary-glow)',
                    shadow: 'var(--shadow-glow)',
                };
        }
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 'var(--spacing-lg)',
            right: 'var(--spacing-lg)',
            zIndex: 'var(--z-toast)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-sm)',
            pointerEvents: 'none',
        }}>
            {notifications.map((notif, index) => {
                const style = getStyle(notif.type);
                return (
                    <div
                        key={notif.id}
                        className="animate-slide-up"
                        style={{
                            background: style.background,
                            backdropFilter: 'blur(12px)',
                            border: `1px solid ${style.borderColor}`,
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--spacing-sm) var(--spacing-lg)',
                            boxShadow: style.shadow,
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                            pointerEvents: 'auto',
                            animation: `slideUp 0.4s ease-out forwards`,
                            animationDelay: `${index * 0.1}s`,
                            minWidth: '200px',
                        }}
                    >
                        <span style={{ flex: 1 }}>{notif.message}</span>
                        <button
                            onClick={() => dismissNotification(notif.id)}
                            style={{
                                color: 'rgba(255,255,255,0.6)',
                                padding: '2px',
                                cursor: 'pointer',
                            }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default XPToast;
