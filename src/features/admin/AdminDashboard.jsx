import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Trash2, Users, BookOpen } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { deleteUser } from '../db/firestoreService';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Users
                const usersSnapshot = await getDocs(collection(db, 'users'));
                setUsers(usersSnapshot.docs.map(d => ({ ...d.data(), id: d.id })));

                // Fetch Courses
                const coursesSnapshot = await getDocs(collection(db, 'courses'));
                setCourses(coursesSnapshot.docs.map(d => ({ ...d.data(), id: d.id })));
            } catch (err) {
                console.error("Error fetching admin data", err);
            }
        };
        fetchData();
    }, []);

    const handleDeleteUser = async (userId) => {
        if (confirm(`Delete user and all their courses?`)) {
            await deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
            // Refresh courses list too since we might have deleted some
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
        return <div className="container" style={{ padding: '2rem' }}>Access Denied. Admin only.</div>;
    }

    return (
        <div className="container" style={{ padding: 'var(--spacing-xl) 0' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: 'var(--spacing-xl)' }}>Admin Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)' }}>
                {/* Users Section */}
                <div className="panel" style={{ padding: 'var(--spacing-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
                        <Users size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Users</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                        {users.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No users found.</p>}
                        {users.map(u => (
                            <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--spacing-sm)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                                <span>{u.username || u.email} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({u.role})</span></span>
                                {u.role !== 'admin' && (
                                    <button onClick={() => handleDeleteUser(u.id)} className="btn btn-ghost" style={{ color: '#ef4444', padding: '2px' }}>
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Courses Section */}
                <div className="panel" style={{ padding: 'var(--spacing-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
                        <BookOpen size={24} color="var(--primary)" />
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Courses</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                        {courses.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No custom courses found.</p>}
                        {courses.map(c => (
                            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--spacing-sm)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                                <span>{c.title}</span>
                                <button onClick={() => handleDeleteCourse(c.id)} className="btn btn-ghost" style={{ color: '#ef4444', padding: '2px' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
