import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCourse } from './CourseContext';
import { useGamification } from '../gamification/GamificationContext';
import { PlayCircle, CheckCircle, FileText, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import NotesPanel from '../notes/NotesPanel';

const CourseView = () => {
    const { phaseId } = useParams();
    const { getPhaseById, loading } = useCourse();
    const { completedResources } = useGamification();
    const [activeResource, setActiveResource] = useState(null);
    const [expandedModules, setExpandedModules] = useState({});

    const phase = getPhaseById(phaseId);

    // Auto-expand all modules on first render
    React.useEffect(() => {
        if (phase) {
            const all = {};
            phase.modules.forEach(m => { all[m.id] = true; });
            setExpandedModules(all);
        }
    }, [phaseId]);

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    if (loading) return (
        <div className="flex-center" style={{ height: '60vh' }}>
            <div style={{
                width: '32px', height: '32px',
                border: '3px solid var(--bg-tertiary)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
            }} />
        </div>
    );

    if (!phase) return (
        <div className="flex-center animate-fade-in" style={{
            height: '60vh', flexDirection: 'column', gap: 'var(--spacing-md)',
        }}>
            <FileText size={48} color="var(--text-muted)" />
            <p style={{ color: 'var(--text-muted)' }}>Phase not found. Try refreshing or re-creating the course.</p>
        </div>
    );

    // Calculate phase progress
    let totalRes = 0, doneRes = 0;
    phase.modules.forEach(m => m.resources.forEach(r => {
        totalRes++;
        if (completedResources.includes(r.id)) doneRes++;
    }));
    const phaseProgress = totalRes === 0 ? 0 : Math.round((doneRes / totalRes) * 100);

    return (
        <div className="animate-fade-in" style={{ padding: 'var(--spacing-lg) 0', maxWidth: '1100px', margin: '0 auto' }}>
            {activeResource ? (
                /* ── Video Player View ─────────────────────── */
                <div>
                    <button
                        onClick={() => setActiveResource(null)}
                        className="btn btn-ghost"
                        style={{ marginBottom: 'var(--spacing-lg)', paddingLeft: 0 }}
                    >
                        <ArrowLeft size={18} /> Back to Phase Overview
                    </button>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: 'var(--spacing-lg)',
                        alignItems: 'start',
                    }}>
                        <VideoPlayer videoId={activeResource.id} title={activeResource.title} />
                        <NotesPanel contextId={activeResource.id} title={`Notes: ${activeResource.title}`} />
                    </div>
                </div>
            ) : (
                /* ── Phase Overview ────────────────────────── */
                <div>
                    {/* Phase Header */}
                    <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)',
                            marginBottom: 'var(--spacing-sm)',
                        }}>
                            <h1 className="text-display" style={{ fontSize: '2rem', flex: 1 }}>
                                {phase.title}
                            </h1>
                            <span className="badge badge-primary" style={{ fontSize: '0.8rem' }}>
                                {phaseProgress}% Complete
                            </span>
                        </div>
                        {phase.description && (
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: 'var(--spacing-md)' }}>
                                {phase.description}
                            </p>
                        )}
                        <div className="progress-bar progress-bar-lg">
                            <div className="progress-bar-fill" style={{ width: `${phaseProgress}%` }} />
                        </div>
                    </div>

                    {/* Modules */}
                    <div className="stagger-children" style={{
                        display: 'flex', flexDirection: 'column',
                        gap: 'var(--spacing-md)',
                    }}>
                        {phase.modules.map(module => {
                            const isExpanded = expandedModules[module.id] !== false;
                            const modTotal = module.resources.length;
                            const modDone = module.resources.filter(r => completedResources.includes(r.id)).length;

                            return (
                                <div key={module.id} className="panel" style={{ overflow: 'hidden' }}>
                                    {/* Module Header (Accordion) */}
                                    <button
                                        onClick={() => toggleModule(module.id)}
                                        style={{
                                            width: '100%', textAlign: 'left',
                                            padding: 'var(--spacing-md) var(--spacing-lg)',
                                            display: 'flex', alignItems: 'center',
                                            justifyContent: 'space-between',
                                            borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none',
                                            transition: 'background var(--transition-fast)',
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '2px' }}>
                                                {module.title}
                                            </h3>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {modDone}/{modTotal} resources
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {modDone === modTotal && modTotal > 0 && (
                                                <CheckCircle size={16} color="var(--success)" />
                                            )}
                                            {isExpanded ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                                        </div>
                                    </button>

                                    {/* Resources */}
                                    {isExpanded && (
                                        <div style={{ padding: 'var(--spacing-sm)' }}>
                                            {module.resources.map(resource => {
                                                const isCompleted = completedResources.includes(resource.id);
                                                return (
                                                    <div
                                                        key={resource.id}
                                                        onClick={() => setActiveResource(resource)}
                                                        style={{
                                                            display: 'flex', alignItems: 'center',
                                                            gap: 'var(--spacing-md)',
                                                            padding: 'var(--spacing-sm) var(--spacing-md)',
                                                            borderRadius: 'var(--radius-md)',
                                                            cursor: 'pointer',
                                                            transition: 'all var(--transition-fast)',
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = 'var(--primary-subtle)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = 'transparent';
                                                        }}
                                                    >
                                                        {isCompleted ? (
                                                            <CheckCircle size={18} color="var(--success)" />
                                                        ) : (
                                                            <div style={{
                                                                width: '18px', height: '18px',
                                                                borderRadius: '50%',
                                                                border: '2px solid var(--text-muted)',
                                                                flexShrink: 0,
                                                            }} />
                                                        )}

                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div style={{
                                                                fontWeight: 500, fontSize: '0.9rem',
                                                                color: isCompleted ? 'var(--text-muted)' : 'var(--text-primary)',
                                                                textDecoration: isCompleted ? 'line-through' : 'none',
                                                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                                            }}>
                                                                {resource.title}
                                                            </div>
                                                            <div style={{
                                                                fontSize: '0.75rem', color: 'var(--text-muted)',
                                                                display: 'flex', gap: '6px', alignItems: 'center',
                                                            }}>
                                                                {resource.type === 'video' ? <PlayCircle size={11} /> : <FileText size={11} />}
                                                                {resource.duration}
                                                            </div>
                                                        </div>

                                                        <span style={{
                                                            fontSize: '0.75rem', fontWeight: 500,
                                                            color: 'var(--primary)',
                                                            opacity: 0.7,
                                                        }}>
                                                            {isCompleted ? 'Review' : 'Start'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseView;
