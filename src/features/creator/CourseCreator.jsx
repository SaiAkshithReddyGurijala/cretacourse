import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseCourseContent } from '../../utils/courseParser';
import { useAuth } from '../auth/AuthContext';
import { saveCourse } from '../db/firestoreService';

import { useCourse } from '../course/CourseContext';

const CourseCreator = () => {
    const [input, setInput] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { refreshCourses, switchCourse } = useCourse();

    const handleCreate = async () => {
        if (!input.trim() || !title.trim()) return;
        setLoading(true);

        try {
            console.log("Parsing content...");
            const course = parseCourseContent(input);
            console.log("Parsed course:", course);

            course.title = title;

            if (!user) {
                alert("You must be logged in to create a course.");
                setLoading(false);
                return;
            }

            // Save to Firestore
            console.log("Saving to Firestore for user:", user.uid);
            const savedCourse = await saveCourse(course, user.uid);
            console.log("Saved course:", savedCourse);

            // Refresh global course list
            await refreshCourses();

            // Set as active course
            switchCourse(savedCourse.id);

            // Navigate to first phase
            if (course.phases.length > 0) {
                navigate(`/phase/${course.phases[0].id}`);
            } else {
                alert('No phases detected! Check your format.');
            }
        } catch (e) {
            console.error("Course creation failed:", e);
            alert(`Failed to save course: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px', padding: 'var(--spacing-xl) 0' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: 'var(--spacing-lg)' }}>Create New Course</h1>

            <div className="panel" style={{ padding: 'var(--spacing-lg)' }}>
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '600' }}>Course Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Advanced React Patterns"
                        style={{
                            width: '100%',
                            padding: 'var(--spacing-md)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            fontSize: '1.1rem',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontWeight: '600' }}>Paste Course Content</label>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
                        Paste the output from ChatGPT or any structured list. Make sure to include "Phase X" headers and YouTube links.
                    </p>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Phase 1: Basics&#10;1. Intro https://youtube.com/..."
                        style={{
                            width: '100%',
                            height: '300px',
                            padding: 'var(--spacing-md)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            resize: 'vertical',
                            outline: 'none'
                        }}
                    />
                </div>

                <button
                    onClick={handleCreate}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: 'var(--spacing-md)' }}
                    disabled={loading}
                >
                    {loading ? 'Parsing & Building...' : 'Generate Course'}
                </button>

                {/* Debug / Preview Section */}
                <div style={{ marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-md)', background: '#000', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>Live Preview</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>
                        {input ? (
                            (() => {
                                const preview = parseCourseContent(input);
                                if (preview.phases.length === 0) return "No phases detected yet. Try typing 'Phase 1: Intro'";
                                return preview.phases.map(p =>
                                    `Phase: ${p.title} (${p.modules.reduce((acc, m) => acc + m.resources.length, 0)} videos)`
                                ).join('\n');
                            })()
                        ) : (
                            "Start typing to see preview..."
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCreator;
