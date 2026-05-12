import React from 'react';
import { useGamification } from './GamificationContext';
import { Trophy, Flame, Target, Award, Star, Zap } from 'lucide-react';

const ProfilePage = () => {
    const { xp, level, streak } = useGamification();

    const badges = [
        { id: 1, name: 'First Step', icon: Star, desc: 'Watch your first video', unlocked: xp >= 50 },
        { id: 2, name: 'On Fire', icon: Flame, desc: 'Reach a 3-day streak', unlocked: streak >= 3 },
        { id: 3, name: 'Dedicated', icon: Target, desc: 'Reach Level 5', unlocked: level >= 5 },
        { id: 4, name: 'Master', icon: Trophy, desc: 'Reach Level 10', unlocked: level >= 10 },
        { id: 5, name: 'Speedster', icon: Zap, desc: 'Watch 5 videos in a day', unlocked: false },
        { id: 6, name: 'Scholar', icon: Award, desc: 'Take 10 notes', unlocked: false },
    ];

    const nextLevelXp = level * 100;
    const progress = (xp % 100) / 100 * 100; // Simplified progress

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header Stats */}
            <div className="glass-panel" style={{ padding: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-xl)' }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    fontWeight: 'bold'
                }}>
                    {level}
                </div>

                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xs)' }}>Learning Warrior</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)' }}>Level {level} • {xp} Total XP</p>

                    <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.5s ease' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--spacing-xs)', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        <span>{xp % 100} XP</span>
                        <span>{100} XP to next level</span>
                    </div>
                </div>

                <div style={{ textAlign: 'center', padding: 'var(--spacing-md)', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)' }}>
                    <Flame size={32} color="var(--accent)" style={{ marginBottom: 'var(--spacing-xs)' }} />
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{streak}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Day Streak</div>
                </div>
            </div>

            {/* Badges Grid */}
            <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--spacing-lg)' }}>Achievements</h3>
            <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
                {badges.map(badge => {
                    const Icon = badge.icon;
                    return (
                        <div
                            key={badge.id}
                            className="glass-panel"
                            style={{
                                padding: 'var(--spacing-lg)',
                                textAlign: 'center',
                                opacity: badge.unlocked ? 1 : 0.5,
                                filter: badge.unlocked ? 'none' : 'grayscale(100%)',
                                border: badge.unlocked ? '1px solid var(--primary-glow)' : '1px solid var(--glass-border)'
                            }}
                        >
                            <div style={{
                                width: '60px',
                                height: '60px',
                                margin: '0 auto var(--spacing-md)',
                                background: badge.unlocked ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Icon size={32} color={badge.unlocked ? 'var(--primary)' : 'var(--text-muted)'} />
                            </div>
                            <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{badge.name}</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{badge.desc}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProfilePage;
