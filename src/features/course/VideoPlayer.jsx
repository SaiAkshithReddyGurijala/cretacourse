import React, { useState } from 'react';
import { CheckCircle, Sparkles } from 'lucide-react';
import { useGamification } from '../gamification/GamificationContext';

const VideoPlayer = ({ videoId, title }) => {
    const { markResourceComplete, completedResources } = useGamification();
    const [completed, setCompleted] = useState(completedResources.includes(videoId));
    const [justCompleted, setJustCompleted] = useState(false);

    const handleComplete = () => {
        if (completed) return;
        markResourceComplete(videoId);
        setCompleted(true);
        setJustCompleted(true);
        setTimeout(() => setJustCompleted(false), 2000);
    };

    const cleanId = videoId.split('?')[0];
    const query = videoId.split('?')[1] || '';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {/* Video embed */}
            <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-color)',
            }}>
                <iframe
                    src={`https://www.youtube.com/embed/${cleanId}?${query}`}
                    title={title}
                    style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%', height: '100%',
                        border: 'none',
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>

            {/* Title + Complete button */}
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', padding: 'var(--spacing-xs) 0',
            }}>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 600, flex: 1 }}>{title}</h2>

                <button
                    onClick={handleComplete}
                    disabled={completed}
                    className={`btn ${completed ? 'btn-ghost' : 'btn-primary'}`}
                    style={{
                        position: 'relative',
                        overflow: 'visible',
                    }}
                >
                    {justCompleted && (
                        <div className="animate-bounce-in" style={{
                            position: 'absolute', top: '-8px', right: '-8px',
                            background: 'var(--accent)', color: '#000',
                            borderRadius: 'var(--radius-full)',
                            padding: '2px 8px', fontSize: '0.7rem',
                            fontWeight: 700, whiteSpace: 'nowrap',
                            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)',
                        }}>
                            +50 XP
                        </div>
                    )}
                    {completed ? (
                        <>
                            <CheckCircle size={16} color="var(--success)" />
                            <span>Completed</span>
                        </>
                    ) : (
                        <>
                            <Sparkles size={16} />
                            <span>Mark as Done</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default VideoPlayer;
