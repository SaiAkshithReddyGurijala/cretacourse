import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { PlusCircle, BookOpen, Clock, ArrowRight, Trash2, Flame, Zap, Trophy, TrendingUp } from 'lucide-react';
import { deleteCourse } from '../db/firestoreService';
import { useCourse } from '../course/CourseContext';
import { useGamification } from '../gamification/GamificationContext';
import { COURSE_DATA } from '../../data/courses';

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const courseContext = useCourse();
    const { xp, level, streak, completedResources } = useGamification();

    if (!courseContext) {
        return <div style={{ padding: '40px', color: 'var(--text-muted)' }}>Error: Course Context Missing</div>;
    }

    const { courses, refreshCourses, loading, switchCourse } = courseContext;

    const handleCourseClick = (course) => {
        switchCourse(course.id);
        if (course.phases && course.phases.length > 0) {
            navigate(`/phase/${course.phases[0].id}`);
        }
    };

    // Get time-based greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    // Course gradient colors (cycle through)
    const cardGradients = [
        'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)',
        'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)',
        'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)',
        'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(139, 92, 246, 0.08) 100%)',
    ];
    const cardAccents = ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--success)'];

    return (
        <div style={{ padding: 'var(--spacing-xl) 0', maxWidth: '1100px', margin: '0 auto' }}>
            {/* ── Hero Section ──────────────────────────────── */}
            <header className="animate-fade-in" style={{ marginBottom: 'var(--spacing-2xl)' }}>
                <h1 className="text-display" style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-xs)' }}>
                    {greeting},{' '}
                    <span className="text-gradient">{user?.displayName || 'Learner'}</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
                    Continue your learning journey. You're doing great!
                </p>
            </header>

            {/* ── Stats Cards ──────────────────────────────── */}
            <div className="stagger-children" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-2xl)',
            }}>
                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
                            background: 'var(--primary-subtle)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Zap size={18} color="var(--primary)" />
                        </div>
                        <div>
                            <div className="stat-card-value" style={{ color: 'var(--primary)' }}>{xp}</div>
                            <div className="stat-card-label">Total XP</div>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
                            background: 'rgba(6, 182, 212, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Trophy size={18} color="var(--secondary)" />
                        </div>
                        <div>
                            <div className="stat-card-value" style={{ color: 'var(--secondary)' }}>{level}</div>
                            <div className="stat-card-label">Level</div>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
                            background: 'rgba(245, 158, 11, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Flame size={18} color="var(--accent)" />
                        </div>
                        <div>
                            <div className="stat-card-value" style={{ color: 'var(--accent)' }}>{streak}</div>
                            <div className="stat-card-label">Day Streak</div>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
                            background: 'rgba(16, 185, 129, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <TrendingUp size={18} color="var(--success)" />
                        </div>
                        <div>
                            <div className="stat-card-value" style={{ color: 'var(--success)' }}>
                                {completedResources.length}
                            </div>
                            <div className="stat-card-label">Completed</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Courses Section ──────────────────────────── */}
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 'var(--spacing-lg)',
            }}>
                <h2 className="text-display" style={{ fontSize: '1.5rem' }}>Your Courses</h2>
                <button
                    onClick={() => navigate('/create')}
                    className="btn btn-primary"
                >
                    <PlusCircle size={18} />
                    Create Course
                </button>
            </div>

            {loading ? (
                <div style={{
                    padding: '60px', textAlign: 'center', color: 'var(--text-muted)',
                }}>
                    <div style={{
                        width: '32px', height: '32px', margin: '0 auto var(--spacing-md)',
                        border: '3px solid var(--bg-tertiary)',
                        borderTopColor: 'var(--primary)',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                    }} />
                    Loading courses...
                </div>
            ) : courses.length === 0 ? (
                <div className="glass-panel animate-fade-in" style={{
                    padding: 'var(--spacing-3xl)',
                    textAlign: 'center',
                }}>
                    <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }} />
                    <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>No courses yet</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-lg)' }}>
                        Create your first course by pasting structured text content.
                    </p>
                    <button onClick={() => navigate('/create')} className="btn btn-primary">
                        <PlusCircle size={18} /> Get Started
                    </button>
                </div>
            ) : (
                <div className="stagger-children" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 'var(--spacing-lg)',
                }}>
                    {courses.map((course, index) => (
                        <div
                            key={course.id}
                            onClick={() => handleCourseClick(course)}
                            className="panel"
                            style={{
                                cursor: 'pointer',
                                overflow: 'hidden',
                                transition: 'all var(--transition-smooth)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = `0 8px 30px rgba(0,0,0,0.3), 0 0 20px ${cardAccents[index % 4]}20`;
                                e.currentTarget.style.borderColor = `${cardAccents[index % 4]}40`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.borderColor = 'var(--border-color)';
                            }}
                        >
                            {/* Card header gradient */}
                            <div style={{
                                height: '120px',
                                background: cardGradients[index % 4],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                            }}>
                                <BookOpen size={40} style={{
                                    color: cardAccents[index % 4],
                                    opacity: 0.5,
                                }} />
                                {/* Delete button */}
                                {course.id !== COURSE_DATA.id && (
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if (confirm('Delete this course?')) {
                                                await deleteCourse(course.id);
                                                await refreshCourses();
                                            }
                                        }}
                                        className="btn btn-danger"
                                        style={{
                                            position: 'absolute', top: '8px', right: '8px',
                                            padding: '6px', borderRadius: 'var(--radius-sm)',
                                        }}
                                        title="Delete Course"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>

                            {/* Card body */}
                            <div style={{ padding: 'var(--spacing-md) var(--spacing-lg) var(--spacing-lg)' }}>
                                <h3 style={{
                                    fontSize: '1.15rem', fontWeight: 600,
                                    marginBottom: 'var(--spacing-sm)',
                                    lineHeight: 1.3,
                                }}>
                                    {course.title}
                                </h3>

                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '16px',
                                    color: 'var(--text-muted)', fontSize: '0.8rem',
                                    marginBottom: 'var(--spacing-md)',
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <BookOpen size={13} /> {course.phases?.length || 0} Phases
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Clock size={13} /> Self-paced
                                    </span>
                                </div>

                                <div style={{
                                    display: 'flex', alignItems: 'center',
                                    color: cardAccents[index % 4],
                                    fontWeight: 500, fontSize: '0.85rem',
                                }}>
                                    Continue Learning
                                    <ArrowRight size={15} style={{
                                        marginLeft: '6px',
                                        transition: 'transform var(--transition-fast)',
                                    }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;
