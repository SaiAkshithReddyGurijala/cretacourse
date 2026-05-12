import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

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
        <div style={{ display: 'flex', height: 'calc(100vh - 100px)', gap: 'var(--spacing-lg)' }}>
            {/* Sidebar List */}
            <div className="glass-panel" style={{ width: '300px', display: 'flex', flexDirection: 'column', padding: 'var(--spacing-md)' }}>
                <button onClick={createNote} className="btn btn-primary" style={{ width: '100%', marginBottom: 'var(--spacing-md)', justifyContent: 'center' }}>
                    <Plus size={20} /> New Note
                </button>

                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    {notes.map(note => (
                        <div
                            key={note.id}
                            onClick={() => setActiveNote(note)}
                            style={{
                                padding: 'var(--spacing-md)',
                                borderRadius: 'var(--radius-md)',
                                background: activeNote?.id === note.id ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                                cursor: 'pointer',
                                border: activeNote?.id === note.id ? '1px solid var(--primary)' : '1px solid transparent'
                            }}
                        >
                            <h4 style={{ marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{note.title}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{note.date}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor */}
            <div className="glass-panel" style={{ flex: 1, padding: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column' }}>
                {activeNote ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
                            <input
                                type="text"
                                value={activeNote.title}
                                onChange={(e) => updateNote(activeNote.id, 'title', e.target.value)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    color: 'var(--text-primary)',
                                    width: '100%',
                                    outline: 'none'
                                }}
                            />
                            <button
                                onClick={() => deleteNote(activeNote.id)}
                                className="btn btn-glass"
                                style={{ color: 'var(--accent)' }}
                            >
                                <Trash2 size={20} />
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
                                fontSize: '1.1rem',
                                color: 'var(--text-secondary)',
                                outline: 'none',
                                lineHeight: '1.8'
                            }}
                        />
                    </>
                ) : (
                    <div className="flex-center" style={{ height: '100%', color: 'var(--text-muted)' }}>
                        Select a note or create a new one
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesPage;
