import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Trash2, Users, BookOpen, Shield } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { deleteUser } from '../db/firestoreService';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'));
                setUsers(usersSnapshot.docs.map(d => ({ ...d.data(), id: d.id })));

                const coursesSnapshot = await getDocs(collection(db, 'courses'));
                setCourses(coursesSnapshot.docs.map(d => ({ ...d.data(), id: d.id })));
            } catch (err) {
                console.error("Error fetching admin data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDeleteUser = async (userId) => {
        if (confirm('Delete user and all their courses?')) {
            await deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
            const coursesSnapshot = await getDocs(collection(db, 'courses'));
            setCourses(coursesSnapshot.docs.map(d => ({ ...d.data(), id: d.id })));
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (confirm('Delete this course?')) {
            await deleteDoc(doc(db, 'courses', courseId));
            setCourses(courses.filter(c => c.id !== courseId));
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div className="flex-center" style={{
                height: '60vh', flexDirection: 'column', gap: 'var(--spacing-md)',
            }}>
                <Shield size={48} color="var(--danger)" />
                <h2>Access Denied</h2>
                <p style={{ color: 'var(--text-muted)' }}>Admin privileges required.</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in" style={{ padding: 'var(--spacing-xl) 0', maxWidth: '1100px', margin: '0 auto' }}>
            <h1 className="text-display" style={{ fontSize: '2rem', marginBottom: 'var(--spacing-xl)' }}>
                <Shield size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }} />
                Admin Dashboard
            </h1>

            {/* Stats */}
            <div className="stagger-children" style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)',
            }}>
                <div className="stat-card">
                    <Users size={20} color="var(--primary)" />
                    <div className="stat-card-value" style={{ color: 'var(--primary)' }}>{users.length}</div>
                    <div className="stat-card-label">Total Users</div>
                </div>
                <div className="stat-card">
                    <BookOpen size={20} color="var(--secondary)" />
                    <div className="stat-card-value" style={{ color: 'var(--secondary)' }}>{courses.length}</div>
                    <div className="stat-card-label">Total Courses</div>
                </div>
                <div className="stat-card">
                    <Shield size={20} color="var(--success)" />
                    <div className="stat-card-value" style={{ color: 'var(--success)' }}>
                        {users.filter(u => u.role === 'admin').length}
                    </div>
                    <div className="stat-card-label">Admins</div>
                </div>
            </div>

            {loading ? (
                <div className="flex-center" style={{ padding: '40px' }}>
                    <div style={{
                        width: '32px', height: '32px',
                        border: '3px solid var(--bg-tertiary)',
                        borderTopColor: 'var(--primary)',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                    }} />
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                    {/* Users */}
                    <div className="panel" style={{ padding: 'var(--spacing-lg)' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)',
                            marginBottom: 'var(--spacing-lg)',
                        }}>
                            <Users size={20} color="var(--primary)" />
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Users</h2>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {users.length === 0 && (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No users found.</p>
                            )}
                            {users.map(u => (
                                <div key={u.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: 'var(--spacing-sm) var(--spacing-md)',
                                    background: 'var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-md)',
                                }}>
                                    <div>
                                        <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                                            {u.username || u.email}
                                        </span>
                                        <span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-success'}`}
                                              style={{ marginLeft: '8px' }}>
                                            {u.role}
                                        </span>
                                    </div>
                                    {u.role !== 'admin' && (
                                        <button
                                            onClick={() => handleDeleteUser(u.id)}
                                            className="btn btn-danger"
                                            style={{ padding: '4px 8px' }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Courses */}
                    <div className="panel" style={{ padding: 'var(--spacing-lg)' }}>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)',
                            marginBottom: 'var(--spacing-lg)',
                        }}>
                            <BookOpen size={20} color="var(--secondary)" />
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Courses</h2>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {courses.length === 0 && (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No courses found.</p>
                            )}
                            {courses.map(c => (
                                <div key={c.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: 'var(--spacing-sm) var(--spacing-md)',
                                    background: 'var(--bg-tertiary)',
                                    borderRadius: 'var(--radius-md)',
                                }}>
                                    <span style={{ fontWeight: 500, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                                        {c.title}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteCourse(c.id)}
                                        className="btn btn-danger"
                                        style={{ padding: '4px 8px' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
