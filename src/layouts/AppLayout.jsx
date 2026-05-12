import React from 'react';
import { Layout, BookOpen, Map, User, Trophy, Youtube } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AppLayout = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { icon: Youtube, label: 'Learn', path: '/' },
        { icon: Map, label: 'Roadmap', path: '/roadmap' },
        { icon: BookOpen, label: 'Notes', path: '/notes' },
        { icon: Trophy, label: 'Profile', path: '/profile' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside
                className="glass-panel"
                style={{
                    width: '240px',
                    margin: 'var(--spacing-md)',
                    padding: 'var(--spacing-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'sticky',
                    top: 'var(--spacing-md)',
                    height: 'calc(100vh - 2 * var(--spacing-md))'
                }}
            >
                <div className="flex-center" style={{ marginBottom: 'var(--spacing-2xl)', gap: 'var(--spacing-sm)' }}>
                    <Layout size={32} color="var(--primary)" />
                    <h1 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>SkillForge</h1>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-md)',
                                    padding: 'var(--spacing-md)',
                                    borderRadius: 'var(--radius-md)',
                                    background: isActive ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                    border: isActive ? '1px solid var(--primary-glow)' : '1px solid transparent',
                                    transition: 'all var(--transition-fast)'
                                }}
                            >
                                <Icon size={20} />
                                <span style={{ fontWeight: 500 }}>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <div
                        className="glass-panel"
                        style={{
                            padding: 'var(--spacing-md)',
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid var(--glass-border)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Level 1</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>0 / 100 XP</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                            <div style={{ width: '0%', height: '100%', background: 'var(--primary)' }}></div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: 'var(--spacing-md)' }}>
                <div className="container">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
