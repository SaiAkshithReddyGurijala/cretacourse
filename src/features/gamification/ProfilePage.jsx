import React from 'react';
import { useGamification } from './GamificationContext';
import { useAuth } from '../auth/AuthContext';
import { useCourse } from '../course/CourseContext';
import { Trophy, Flame, Target, Award, Star, Zap, BookOpen, CheckCircle, Moon, Sun } from 'lucide-react';

const ProfilePage = () => {
    const { xp, level, streak, completedResources } = useGamification();
    const { user } = useAuth();
    const { courses } = useCourse();

    // Calculate total resources across all courses
    let totalResources = 0;
    courses.forEach(c => c.phases?.forEach(p => p.modules?.forEach(m => {
        totalResources += m.resources?.length || 0;
    })));

    const badges = [
        { id: 1, name: 'First Step', icon: Star, desc: 'Complete your first resource', unlocked: completedResources.length >= 1, color: 'var(--accent)' },
        { id: 2, name: 'On Fire', icon: Flame, desc: 'Reach a 3-day streak', unlocked: streak >= 3, color: 'var(--accent)' },
        { id: 3, name: 'Dedicated', icon: Target, desc: 'Reach Level 5', unlocked: level >= 5, color: 'var(--secondary)' },
        { id: 4, name: 'Master', icon: Trophy, desc: 'Reach Level 10', unlocked: level >= 10, color: 'var(--primary)' },
        { id: 5, name: 'Speedster', icon: Zap, desc: 'Complete 5 resources in one session', unlocked: false, color: 'var(--secondary)' },
        { id: 6, name: 'Scholar', icon: Award, desc: 'Take 10 notes', unlocked: false, color: 'var(--success)' },
        { id: 7, name: 'Night Owl', icon: Moon, desc: 'Study after 10 PM', unlocked: false, color: 'var(--primary)' },
        { id: 8, name: 'Early Bird', icon: Sun, desc: 'Study before 7 AM', unlocked: false, color: 'var(--accent)' },
    ];

    const unlockedCount = badges.filter(b => b.unlocked).length;
    const xpForNextLevel = 100;
    const xpProgress = (xp % 100);

    return (
        <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--spacing-xl) 0' }}>
            {/* ── Profile Header ───────────────────────────── */}
            <div className="glass-panel" style={{
                padding: 'var(--spacing-xl)',
                marginBottom: 'var(--spacing-xl)',
                display: 'flex', alignItems: 'center', gap: 'var(--spacing-xl)',
                flexWrap: 'wrap',
            }}>
                {/* Avatar / Level Circle */}
                <div style={{ position: 'relative' }}>
                    <div style={{
                        width: '100px', height: '100px',
                        borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.5rem', fontWeight: 800,
                        fontFamily: 'var(--font-display)',
                        color: '#fff',
                        boxShadow: 'var(--shadow-glow-lg)',
                    }}>
                        {level}
                    </div>
                    {/* Level badge */}
                    <div style={{
                        position: 'absolute', bottom: '-4px', right: '-4px',
                        background: 'var(--accent)',
                        color: '#000', fontWeight: 700,
                        fontSize: '0.65rem',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        boxShadow: '0 2px 6px rgba(245, 158, 11, 0.4)',
                    }}>
                        LVL
                    </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                    <h2 className="text-display" style={{ fontSize: '1.75rem', marginBottom: '2px' }}>
                        {user?.displayName || 'Learner'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--spacing-md)', fontSize: '0.9rem' }}>
                        Level {level} • {xp} Total XP • {unlockedCount}/{badges.length} Badges
                    </p>

                    {/* XP Progress Bar */}
                    <div>
                        <div className="progress-bar progress-bar-xl">
                            <div className="progress-bar-fill" style={{ width: `${xpProgress}%` }} />
                        </div>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-muted)',
                        }}>
                            <span>{xpProgress} XP</span>
                            <span>{xpForNextLevel} XP to next level</span>
                        </div>
                    </div>
                </div>

                {/* Streak Card */}
                <div style={{
                    textAlign: 'center',
                    padding: 'var(--spacing-md) var(--spacing-lg)',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-lg)',
                    border: streak > 0 ? '1px solid var(--accent-glow)' : '1px solid var(--border-color)',
                }}>
                    <Flame size={28} color="var(--accent)" style={{ marginBottom: '4px' }} />
                    <div style={{
                        fontSize: '1.75rem', fontWeight: 800,
                        fontFamily: 'var(--font-display)',
                        color: streak > 0 ? 'var(--accent)' : 'var(--text-muted)',
                    }}>
                        {streak}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                        Day Streak
                    </div>
                </div>
            </div>

            {/* ── Stats Grid ───────────────────────────────── */}
            <div className="stagger-children" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-xl)',
            }}>
                <div className="stat-card">
                    <Zap size={20} color="var(--primary)" />
                    <div className="stat-card-value" style={{ color: 'var(--primary)' }}>{xp}</div>
                    <div className="stat-card-label">Total XP</div>
                </div>
                <div className="stat-card">
                    <CheckCircle size={20} color="var(--success)" />
                    <div className="stat-card-value" style={{ color: 'var(--success)' }}>{completedResources.length}</div>
                    <div className="stat-card-label">Completed</div>
                </div>
                <div className="stat-card">
                    <BookOpen size={20} color="var(--secondary)" />
                    <div className="stat-card-value" style={{ color: 'var(--secondary)' }}>{courses.length}</div>
                    <div className="stat-card-label">Courses</div>
                </div>
                <div className="stat-card">
                    <Target size={20} color="var(--accent)" />
                    <div className="stat-card-value" style={{ color: 'var(--accent)' }}>
                        {totalResources > 0 ? Math.round((completedResources.length / totalResources) * 100) : 0}%
                    </div>
                    <div className="stat-card-label">Progress</div>
                </div>
            </div>

            {/* ── Achievements ─────────────────────────────── */}
            <h3 className="text-display" style={{ fontSize: '1.3rem', marginBottom: 'var(--spacing-lg)' }}>
                Achievements
            </h3>
            <div className="stagger-children grid-responsive" style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
            }}>
                {badges.map(badge => {
                    const Icon = badge.icon;
                    return (
                        <div
                            key={badge.id}
                            className="panel"
                            style={{
                                padding: 'var(--spacing-lg)',
                                textAlign: 'center',
                                opacity: badge.unlocked ? 1 : 0.45,
                                filter: badge.unlocked ? 'none' : 'grayscale(80%)',
                                border: badge.unlocked ? `1px solid ${badge.color}30` : '1px solid var(--border-color)',
                                transition: 'all var(--transition-smooth)',
                                cursor: 'default',
                            }}
                        >
                            <div style={{
                                width: '56px', height: '56px',
                                margin: '0 auto var(--spacing-sm)',
                                background: badge.unlocked ? `${badge.color}18` : 'var(--bg-tertiary)',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: badge.unlocked ? `0 0 20px ${badge.color}20` : 'none',
                            }}>
                                <Icon size={26} color={badge.unlocked ? badge.color : 'var(--text-muted)'} />
                            </div>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>
                                {badge.name}
                            </h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                {badge.desc}
                            </p>
                            {badge.unlocked && (
                                <div className="badge badge-success" style={{ marginTop: 'var(--spacing-sm)' }}>
                                    Unlocked
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProfilePage;
