import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseCourseContent } from '../../utils/courseParser';
import { useAuth } from '../auth/AuthContext';
import { saveCourse } from '../db/firestoreService';
import { useCourse } from '../course/CourseContext';
import { Sparkles, BookOpen, Eye, FileText } from 'lucide-react';

const CourseCreator = () => {
    const [input, setInput] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { refreshCourses, switchCourse } = useCourse();

    const preview = input ? parseCourseContent(input) : null;

    const handleCreate = async () => {
        if (!input.trim() || !title.trim()) return;
        setLoading(true);

        try {
            const course = parseCourseContent(input);
            course.title = title;

            if (!user) {
                alert("You must be logged in to create a course.");
                setLoading(false);
                return;
            }

            const savedCourse = await saveCourse(course, user.uid);
            await refreshCourses();
            switchCourse(savedCourse.id);
            setSuccess(true);

            setTimeout(() => {
                if (course.phases.length > 0) {
                    navigate(`/phase/${course.phases[0].id}`);
                }
            }, 1200);
        } catch (e) {
            console.error("Course creation failed:", e);
            alert(`Failed to save course: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ padding: 'var(--spacing-xl) 0', maxWidth: '1100px', margin: '0 auto' }}>
            <h1 className="text-display" style={{ fontSize: '2rem', marginBottom: 'var(--spacing-lg)' }}>
                <Sparkles size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }} />
                Create New Course
            </h1>

            {/* Success overlay */}
            {success && (
                <div className="animate-scale-in" style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(8px)',
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div className="animate-bounce-in" style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'var(--gradient-primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto var(--spacing-lg)',
                            boxShadow: 'var(--shadow-glow-lg)',
                        }}>
                            <Sparkles size={36} color="#fff" />
                        </div>
                        <h2 className="text-display" style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-sm)' }}>
                            Course Created!
                        </h2>
                        <p style={{ color: 'var(--text-muted)' }}>Redirecting to your new course...</p>
                    </div>
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'var(--spacing-lg)',
                alignItems: 'start',
            }}>
                {/* ── Editor Panel ─────────────────────────── */}
                <div className="panel" style={{ padding: 'var(--spacing-lg)' }}>
                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <label className="input-label">Course Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input"
                            placeholder="e.g., Advanced React Patterns"
                        />
                    </div>

                    <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <label className="input-label">Paste Course Content</label>
                        <p style={{
                            fontSize: '0.8rem', color: 'var(--text-muted)',
                            marginBottom: 'var(--spacing-sm)',
                        }}>
                            Paste output from ChatGPT or any structured list with "Phase X" headers and YouTube links.
                        </p>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={'Phase 1: Getting Started\n1. Introduction\nhttps://youtube.com/watch?v=...\n\nPhase 2: Advanced Topics\n1. Deep Dive\nhttps://youtube.com/watch?v=...'}
                            className="input"
                            style={{
                                height: '320px',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.85rem',
                                resize: 'vertical',
                                lineHeight: 1.7,
                            }}
                        />
                    </div>

                    <button
                        onClick={handleCreate}
                        className="btn btn-primary"
                        style={{
                            width: '100%', justifyContent: 'center',
                            padding: '14px', fontSize: '1rem', fontWeight: 600,
                        }}
                        disabled={loading || !input.trim() || !title.trim()}
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
                                <Sparkles size={18} />
                                Generate Course
                            </>
                        )}
                    </button>
                </div>

                {/* ── Preview Panel ────────────────────────── */}
                <div className="glass-panel" style={{
                    padding: 'var(--spacing-lg)',
                    position: 'sticky',
                    top: 'var(--spacing-lg)',
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        marginBottom: 'var(--spacing-lg)',
                        color: 'var(--text-secondary)',
                    }}>
                        <Eye size={16} />
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Live Preview</span>
                    </div>

                    {!preview || preview.phases.length === 0 ? (
                        <div className="flex-center" style={{
                            height: '200px', flexDirection: 'column',
                            gap: 'var(--spacing-sm)', color: 'var(--text-muted)',
                        }}>
                            <FileText size={32} style={{ opacity: 0.3 }} />
                            <p style={{ fontSize: '0.85rem' }}>
                                Start typing to see preview...
                            </p>
                            <p style={{ fontSize: '0.75rem' }}>
                                Tip: Type "Phase 1: Intro" to get started
                            </p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'flex', flexDirection: 'column',
                            gap: 'var(--spacing-sm)',
                        }}>
                            {/* Title preview */}
                            <div style={{
                                padding: 'var(--spacing-md)',
                                background: 'var(--gradient-surface)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                                marginBottom: 'var(--spacing-sm)',
                            }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>
                                    {title || 'Untitled Course'}
                                </h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    {preview.phases.length} phases • {preview.phases.reduce((acc, p) => acc + p.modules.reduce((a, m) => a + m.resources.length, 0), 0)} resources
                                </p>
                            </div>

                            {preview.phases.map((phase, i) => {
                                const totalVids = phase.modules.reduce((a, m) => a + m.resources.length, 0);
                                return (
                                    <div key={i} style={{
                                        padding: 'var(--spacing-sm) var(--spacing-md)',
                                        background: 'var(--bg-tertiary)',
                                        borderRadius: 'var(--radius-md)',
                                        borderLeft: '3px solid var(--primary)',
                                    }}>
                                        <div style={{
                                            display: 'flex', justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                                                {phase.title}
                                            </span>
                                            <span className="badge badge-primary">
                                                {totalVids} video{totalVids !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseCreator;
