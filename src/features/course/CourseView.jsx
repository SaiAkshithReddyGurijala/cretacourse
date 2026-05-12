import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCourse } from './CourseContext';
import { useGamification } from '../gamification/GamificationContext';
import { PlayCircle, CheckCircle, FileText } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import NotesPanel from '../notes/NotesPanel';

const CourseView = () => {
    const { phaseId } = useParams();
    const { getPhaseById, loading } = useCourse();
    const { completedResources } = useGamification();
    const [activeResource, setActiveResource] = useState(null);

    const phase = getPhaseById(phaseId);

    if (loading) return <div>Loading course...</div>;
    if (!phase) return <div>Phase not found. Please try refreshing or re-creating the course.</div>;

    return (
        <div style={{ display: 'flex', gap: 'var(--spacing-lg)', height: '100%' }}>
            {/* Main Content Area */}
            <div style={{ flex: 1, maxWidth: '1200px' }}>
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: 'var(--spacing-sm)' }}>{phase.title}</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{phase.description}</p>
                </div>

                {activeResource ? (
                    <div className="animate-fade-in" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                        <button
                            onClick={() => setActiveResource(null)}
                            className="btn btn-ghost"
                            style={{ marginBottom: 'var(--spacing-md)', paddingLeft: 0 }}
                        >
                            ← Back to Phase Overview
                        </button>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-lg)' }}>
                            <VideoPlayer
                                videoId={activeResource.id}
                                title={activeResource.title}
                                autoPlay={true}
                            />
                            <NotesPanel contextId={activeResource.id} title={`Notes: ${activeResource.title}`} />
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
                        {phase.modules.map(module => (
                            <div key={module.id} className="panel" style={{ padding: 'var(--spacing-lg)' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--spacing-sm)' }}>
                                    {module.title}
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                    {module.resources.map(resource => {
                                        const isCompleted = completedResources.includes(resource.id);
                                        return (
                                            <div
                                                key={resource.id}
                                                onClick={() => setActiveResource(resource)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 'var(--spacing-md)',
                                                    padding: 'var(--spacing-sm)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.2s',
                                                    background: 'transparent'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle size={20} color="var(--primary)" />
                                                ) : (
                                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--text-muted)' }}></div>
                                                )}

                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: '500', color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                                                        {resource.title}
                                                    </div>
                                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        {resource.type === 'video' ? <PlayCircle size={12} /> : <FileText size={12} />}
                                                        {resource.duration}
                                                    </div>
                                                </div>

                                                <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>Start</button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseView;
