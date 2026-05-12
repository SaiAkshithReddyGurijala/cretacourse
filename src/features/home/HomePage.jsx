import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { PlusCircle, BookOpen, Clock, ArrowRight, Trash2 } from 'lucide-react';
import { deleteCourse } from '../db/firestoreService';
import { useCourse } from '../course/CourseContext';
import { COURSE_DATA } from '../../data/courses';

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const courseContext = useCourse();

    // Safety check
    if (!courseContext) {
        console.error("CourseContext is undefined! Is CourseProvider wrapping the app?");
        return <div>Error: Course Context Missing</div>;
    }

    const { courses, refreshCourses, loading } = courseContext;

    const handleCourseClick = (course) => {
        // Set active course and navigate
        localStorage.setItem('active_course_id', course.id);
        if (course.phases && course.phases.length > 0) {
            navigate(`/phase/${course.phases[0].id}`);
        } else {
            console.warn("Course has no phases:", course);
        }
    };

    return (
        <div className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
            <header style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: 'var(--spacing-sm)' }}>
                    Welcome back, {user?.displayName || 'Learner'}
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Continue your learning journey.
                </p>
            </header>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Your Courses</h2>
                <button
                    onClick={() => navigate('/create')}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <PlusCircle size={20} />
                    Create New Course
                </button>
            </div>

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading courses...</div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 'var(--spacing-lg)'
                }}>
                    {courses.map(course => (
                        <div
                            key={course.id}
                            onClick={() => handleCourseClick(course)}
                            className="panel"
                            style={{
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                border: '1px solid var(--border-color)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 10px 20px -5px rgba(0, 0, 0, 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{
                                height: '140px',
                                background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)',
                                borderRadius: 'var(--radius-sm)',
                                marginBottom: 'var(--spacing-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <BookOpen size={48} color="var(--primary)" opacity={0.5} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: 'var(--spacing-xs)', flex: 1 }}>
                                    {course.title}
                                </h3>
                                {course.id !== COURSE_DATA.id && (
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation(); // Prevent card click
                                            if (confirm('Delete this course?')) {
                                                await deleteCourse(course.id);
                                                await refreshCourses();
                                            }
                                        }}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#ef4444',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            borderRadius: 'var(--radius-sm)',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        title="Delete Course"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--spacing-md)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <BookOpen size={14} /> {course.phases?.length || 0} Phases
                                </span>
                                {/* Placeholder for duration if we had it */}
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Clock size={14} /> Self-paced
                                </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: '500', fontSize: '0.9rem' }}>
                                Continue Learning <ArrowRight size={16} style={{ marginLeft: '4px' }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;
