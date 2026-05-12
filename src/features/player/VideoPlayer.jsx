import React, { useState } from 'react';
import { CheckCircle, PlayCircle } from 'lucide-react';
import { useGamification } from '../gamification/GamificationContext';

const VideoPlayer = ({ videoId, title, channel }) => {
    const { addXp } = useGamification();
    const [completed, setCompleted] = useState(false);

    const handleComplete = () => {
        if (!completed) {
            addXp(50); // Award 50 XP
            setCompleted(true);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div className="glass-panel" style={{ padding: 'var(--spacing-xs)', overflow: 'hidden' }}>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={title}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)'
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>

            <div className="glass-panel" style={{ padding: 'var(--spacing-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-xs)' }}>{title}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>{channel}</p>
                </div>

                <button
                    onClick={handleComplete}
                    disabled={completed}
                    className={`btn ${completed ? 'btn-glass' : 'btn-primary'}`}
                    style={{ minWidth: '160px' }}
                >
                    {completed ? (
                        <>
                            <CheckCircle size={20} color="var(--secondary)" />
                            <span>Completed</span>
                        </>
                    ) : (
                        <>
                            <PlayCircle size={20} />
                            <span>Mark Complete (+50 XP)</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default VideoPlayer;
