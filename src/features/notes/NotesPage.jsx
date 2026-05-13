import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';

const NotesPage = () => {
    const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('notes')) || []);
    const [activeNote, setActiveNote] = useState(null);

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes]);

    const createNote = () => {
        const newNote = {
            id: Date.now(),
            title: 'New Note',
            content: '',
            date: new Date().toLocaleDateString()
        };
        setNotes([newNote, ...notes]);
        setActiveNote(newNote);
    };

    const updateNote = (id, field, value) => {
        setNotes(notes.map(note =>
            note.id === id ? { ...note, [field]: value } : note
        ));
        if (activeNote && activeNote.id === id) {
            setActiveNote({ ...activeNote, [field]: value });
        }
    };

    const deleteNote = (id) => {
        setNotes(notes.filter(note => note.id !== id));
        if (activeNote && activeNote.id === id) {
            setActiveNote(null);
        }
    };

    return (
        <div className="animate-fade-in" style={{
            display: 'flex',
            height: 'calc(100vh - 100px)',
            gap: 'var(--spacing-md)',
            padding: 'var(--spacing-lg) 0',
        }}>
            {/* ── Notes Sidebar ────────────────────────────── */}
            <div className="panel" style={{
                width: '280px', minWidth: '280px',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
            }}>
                <div style={{ padding: 'var(--spacing-md)' }}>
                    <button onClick={createNote} className="btn btn-primary" style={{
                        width: '100%', justifyContent: 'center',
                    }}>
                        <Plus size={18} /> New Note
                    </button>
                </div>

                <div style={{
                    flex: 1, overflowY: 'auto',
                    padding: '0 var(--spacing-sm) var(--spacing-sm)',
                    display: 'flex', flexDirection: 'column', gap: '4px',
                }}>
                    {notes.length === 0 && (
                        <div className="flex-center" style={{
                            height: '120px', flexDirection: 'column',
                            color: 'var(--text-muted)', gap: '8px',
                        }}>
                            <FileText size={24} style={{ opacity: 0.3 }} />
                            <p style={{ fontSize: '0.8rem' }}>No notes yet</p>
                        </div>
                    )}
                    {notes.map(note => (
                        <div
                            key={note.id}
                            onClick={() => setActiveNote(note)}
                            style={{
                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                borderRadius: 'var(--radius-md)',
                                background: activeNote?.id === note.id ? 'var(--primary-subtle)' : 'transparent',
                                cursor: 'pointer',
                                border: activeNote?.id === note.id
                                    ? '1px solid rgba(139, 92, 246, 0.2)'
                                    : '1px solid transparent',
                                transition: 'all var(--transition-fast)',
                            }}
                            onMouseEnter={(e) => {
                                if (activeNote?.id !== note.id) {
                                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (activeNote?.id !== note.id) {
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            <h4 style={{
                                fontSize: '0.85rem', fontWeight: 500,
                                marginBottom: '2px',
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                color: activeNote?.id === note.id ? 'var(--primary)' : 'var(--text-primary)',
                            }}>
                                {note.title}
                            </h4>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{note.date}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Editor ───────────────────────────────────── */}
            <div className="panel" style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
            }}>
                {activeNote ? (
                    <>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 'var(--spacing-md) var(--spacing-lg)',
                            borderBottom: '1px solid var(--border-color)',
                        }}>
                            <input
                                type="text"
                                value={activeNote.title}
                                onChange={(e) => updateNote(activeNote.id, 'title', e.target.value)}
                                className="text-display"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    fontWeight: 700,
                                    color: 'var(--text-primary)',
                                    width: '100%',
                                    outline: 'none',
                                }}
                            />
                            <button
                                onClick={() => deleteNote(activeNote.id)}
                                className="btn btn-danger"
                                style={{ padding: '8px' }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <textarea
                            value={activeNote.content}
                            onChange={(e) => updateNote(activeNote.id, 'content', e.target.value)}
                            placeholder="Start writing..."
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                resize: 'none',
                                fontSize: '1rem',
                                color: 'var(--text-secondary)',
                                outline: 'none',
                                lineHeight: 1.8,
                                padding: 'var(--spacing-lg)',
                                fontFamily: 'var(--font-sans)',
                            }}
                        />
                    </>
                ) : (
                    <div className="flex-center" style={{
                        height: '100%', flexDirection: 'column',
                        color: 'var(--text-muted)', gap: 'var(--spacing-sm)',
                    }}>
                        <FileText size={40} style={{ opacity: 0.2 }} />
                        <p>Select a note or create a new one</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesPage;
