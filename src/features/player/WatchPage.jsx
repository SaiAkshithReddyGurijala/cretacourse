import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { MOCK_PLAYLISTS } from '../playlist/mockData';
import { ArrowLeft } from 'lucide-react';

const WatchPage = () => {
    const { videoId } = useParams();
    const navigate = useNavigate();

    // Find video in mock data (inefficient but works for mock)
    let video = null;
    Object.values(MOCK_PLAYLISTS).forEach(list => {
        const found = list.find(v => v.id === videoId);
        if (found) video = found;
    });

    if (!video) {
        return (
            <div className="flex-center" style={{ height: '50vh', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                <h2>Video not found</h2>
                <button onClick={() => navigate('/')} className="btn btn-primary">Go Back</button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <button
                onClick={() => navigate(-1)}
                className="btn btn-glass"
                style={{ marginBottom: 'var(--spacing-md)', padding: '0.5rem 1rem' }}
            >
                <ArrowLeft size={16} /> Back to Path
            </button>

            <div className="grid-responsive" style={{ gridTemplateColumns: '2fr 1fr', alignItems: 'start' }}>
                <VideoPlayer
                    videoId={video.id}
                    title={video.title}
                    channel={video.channel}
                />

                <div className="glass-panel" style={{ padding: 'var(--spacing-md)', height: '100%' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Notes</h3>
                    <textarea
                        placeholder="Take notes here..."
                        style={{
                            width: '100%',
                            height: '300px',
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: 'var(--spacing-sm)',
                            color: 'var(--text-primary)',
                            resize: 'none'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default WatchPage;
