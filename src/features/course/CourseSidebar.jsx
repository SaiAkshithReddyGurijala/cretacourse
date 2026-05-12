import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { COURSE_DATA } from '../../data/courses';
import { useGamification } from '../gamification/GamificationContext';
import { CheckCircle, PlusCircle, Settings, LogOut, Home, Trash2 } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useCourse } from './CourseContext';
import { deleteCourse } from '../db/firestoreService';

const CourseSidebar = () => {
  const { getPhaseProgress } = useGamification();
  const { logout, user } = useAuth();
  const { courses, activeCourse, switchCourse, refreshCourses } = useCourse();
  const navigate = useNavigate();

  const handleSwitchCourse = (courseId) => {
    switchCourse(courseId);
    const course = courses.find(c => c.id === courseId);
    if (course && course.phases && course.phases.length > 0) {
      navigate(`/phase/${course.phases[0].id}`);
    }
  };

  return (
    <aside
      className="panel"
      style={{
        width: '280px',
        height: 'calc(100vh - 2 * var(--spacing-md))',
        position: 'sticky',
        top: 'var(--spacing-md)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)'
      }}
    >
      {/* Course Switcher Header */}
      <div style={{ padding: 'var(--spacing-md)', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>
        <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain', marginBottom: 'var(--spacing-md)' }} />
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          <select
            value={activeCourse.id}
            onChange={(e) => {
              const id = e.target.value;
              handleSwitchCourse(id);
            }}
            style={{
              flex: 1,
              padding: '4px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)'
            }}
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>

          {activeCourse.id !== COURSE_DATA.id && (
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to delete this course? This cannot be undone.')) {
                  await deleteCourse(activeCourse.id);
                  await refreshCourses();
                  switchCourse(COURSE_DATA.id);
                  navigate('/');
                }
              }}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Delete Course"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        {/* DEBUG: Show IDs to verify condition */}
        <div style={{ fontSize: '0.6rem', color: 'red', display: 'none' }}>
          Current: {activeCourse.id} <br />
          Default: {COURSE_DATA.id}
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{activeCourse?.phases?.length || 0} Phases</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-sm)' }}>
        {activeCourse?.phases?.map((phase, index) => {
          const progress = getPhaseProgress(phase.id, courses);
          return (
            <NavLink
              key={phase.id}
              to={`/phase/${phase.id}`}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              style={{ display: 'block', marginBottom: '4px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                  {phase.title}
                </span>
                {progress === 100 ? (
                  <CheckCircle size={14} color="var(--primary)" />
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{progress}%</span>
                )}
              </div>

              <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s' }}></div>
              </div>
            </NavLink>
          );
        })}
      </div>

      <div style={{ padding: 'var(--spacing-md)', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <NavLink to="/" className="sidebar-item">
          <Home size={16} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/create" className="sidebar-item">
          <PlusCircle size={16} />
          <span>Create Course</span>
        </NavLink>

        {user?.role === 'admin' && (
          <NavLink to="/admin" className="sidebar-item">
            <Settings size={16} />
            <span>Admin Dashboard</span>
          </NavLink>
        )}

        <button
          onClick={async () => {
            await logout();
            navigate('/login');
          }}
          className="sidebar-item"
          style={{ width: '100%', textAlign: 'left' }}
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>

        {/* DEBUG INFO */}
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '10px', wordBreak: 'break-all' }}>
          User: {user?.email}<br />
          Role: {user?.role || 'none'}<br />
          v1.1 (Fixes Loaded)
        </div>
      </div>
    </aside>
  );
};

export default CourseSidebar;
