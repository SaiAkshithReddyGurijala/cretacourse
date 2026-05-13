import React, { useState, useEffect } from 'react';

const NotesPanel = ({ contextId = 'general', title = 'Notes' }) => {
    const [content, setContent] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const savedNotes = JSON.parse(localStorage.getItem('course_notes')) || {};
        setContent(savedNotes[contextId] || '');
    }, [contextId]);

    const handleSave = () => {
        const savedNotes = JSON.parse(localStorage.getItem('course_notes')) || {};
        savedNotes[contextId] = content;
        localStorage.setItem('course_notes', JSON.stringify(savedNotes));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    // Auto-save on blur
    const handleBlur = () => {
        if (content) handleSave();
    };

    return (
        <div className="panel" style={{
            display: 'flex', flexDirection: 'column',
            height: '100%', minHeight: '400px',
            overflow: 'hidden',
        }}>
            <div style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg-tertiary)',
            }}>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {title}
                </span>
                <button
                    onClick={handleSave}
                    className="btn btn-ghost"
                    style={{
                        fontSize: '0.75rem', padding: '4px 10px',
                        color: saved ? 'var(--success)' : 'var(--text-muted)',
                        fontWeight: saved ? 600 : 400,
                    }}
                >
                    {saved ? '✓ Saved' : 'Save'}
                </button>
            </div>

            <textarea
                value={content}
                onChange={(e) => { setContent(e.target.value); setSaved(false); }}
                onBlur={handleBlur}
                placeholder="Type your notes here..."
                style={{
                    flex: 1,
                    border: 'none',
                    resize: 'none',
                    padding: 'var(--spacing-md)',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-sans)',
                    outline: 'none',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    lineHeight: 1.7,
                }}
            />
        </div>
    );
};

export default NotesPanel;
