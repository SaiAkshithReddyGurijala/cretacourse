import React, { useState } from 'react';
import { Search, Play, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PLAYLISTS } from './mockData';

const PlaylistGenerator = () => {
    const [topic, setTopic] = useState('');
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGenerate = (e) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setLoading(true);
        // Simulate AI delay
        setTimeout(() => {
            const key = topic.toLowerCase();
            const result = MOCK_PLAYLISTS[key] || MOCK_PLAYLISTS['default'];
            setPlaylist(result);
            setLoading(false);
        }, 1500);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-2xl)' }}>
                <h2 className="text-gradient" style={{ fontSize: '3rem', marginBottom: 'var(--spacing-sm)' }}>
                    What do you want to learn?
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Enter a topic and our AI will curate the perfect learning path for you.
                </p>
            </div>

            <form onSubmit={handleGenerate} style={{ marginBottom: 'var(--spacing-2xl)' }}>
                <div
                    className="glass-panel"
                    style={{
                        display: 'flex',
                        padding: 'var(--spacing-sm)',
                        gap: 'var(--spacing-sm)',
                        alignItems: 'center'
                    }}
                >
                    <Search className="text-muted" style={{ marginLeft: 'var(--spacing-sm)' }} />
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., PyTorch, React, Quantum Physics..."
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            fontSize: '1.1rem',
                            padding: 'var(--spacing-sm)',
                            outline: 'none'
                        }}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Generating...' : 'Generate Path'}
                    </button>
                </div>
            </form>

            {playlist && (
                <div className="animate-fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                        <h3 style={{ fontSize: '1.5rem' }}>Your Learning Path</h3>
                        <span style={{ color: 'var(--text-muted)' }}>{playlist.length} videos</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {playlist.map((video, index) => (
                            <div
                                key={video.id}
                                className="glass-panel"
                                style={{
                                    display: 'flex',
                                    gap: 'var(--spacing-md)',
                                    padding: 'var(--spacing-md)',
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate(`/watch/${video.id}`)}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div style={{ position: 'relative', width: '200px', flexShrink: 0 }}>
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        style={{ width: '100%', borderRadius: 'var(--radius-sm)', aspectRatio: '16/9', objectFit: 'cover' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '5px',
                                        right: '5px',
                                        background: 'rgba(0,0,0,0.8)',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem'
                                    }}>
                                        {video.duration}
                                    </div>
                                </div>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <h4 style={{ fontSize: '1.1rem', marginBottom: 'var(--spacing-xs)', lineHeight: '1.4' }}>{video.title}</h4>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{video.channel}</p>
                                    </div>

                                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-sm)' }}>
                                        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                            <Play size={16} /> Start
                                        </button>
                                        <button
                                            className="btn btn-glass"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Mark done logic
                                            }}
                                        >
                                            <CheckCircle size={16} /> Mark Done
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaylistGenerator;
