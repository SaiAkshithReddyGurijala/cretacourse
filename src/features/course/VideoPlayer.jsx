import React, { useState, useEffect } from 'react';
import { CheckCircle, PlayCircle } from 'lucide-react';
import { useGamification } from '../gamification/GamificationContext';

const VideoPlayer = ({ videoId, title }) => {
    const { markResourceComplete, completedResources } = useGamification();
    const [completed, setCompleted] = useState(false);

    // Check if already completed
    useEffect(() => {
        if (completedResources.includes(videoId)) {
            setCompleted(true);
        }
    }, [videoId, completedResources]);

    const handleComplete = () => {
        markResourceComplete(videoId);
        setCompleted(true);
    };

    // Extract actual ID if it has query params (like ?t=870)
    const cleanId = videoId.split('?')[0];
    const query = videoId.split('?')[1] || '';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div className="panel" style={{ padding: '0', overflow: 'hidden', border: 'none' }}>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                    <iframe
                        src={`https://www.youtube.com/embed/${cleanId}?${query}`}
                        title={title}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            borderRadius: 'var(--radius-md)'
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--spacing-sm) 0' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{title}</h2>

                <button
                    onClick={handleComplete}
                    disabled={completed}
                    className={`btn ${completed ? 'btn-ghost' : 'btn-primary'}`}
                >
                    {completed ? (
                        <>
                            <CheckCircle size={18} color="var(--primary)" />
                            <span>Completed</span>
                        </>
                    ) : (
                        <>
                            <CheckCircle size={18} />
                            <span>Mark as Done</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default VideoPlayer;
