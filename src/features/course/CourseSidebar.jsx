import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { COURSE_DATA } from '../../data/courses';
import { useGamification } from '../gamification/GamificationContext';
import { CheckCircle, PlusCircle, LogOut, Home, Trash2, BookOpen, Trophy, StickyNote, Settings, Bot, Flame } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { useCourse } from './CourseContext';
import { deleteCourse } from '../db/firestoreService';

const CourseSidebar = () => {
  const { getPhaseProgress, xp, level, streak } = useGamification();
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

  const xpForNextLevel = level * 100;
  const xpProgress = ((xp % 100) / 100) * 100;

  return (
    <aside style={{
      width: '280px',
      minWidth: '280px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      zIndex: 'var(--z-sidebar)',
    }}>
      {/* ── Logo + Course Switcher ─────────────────────────── */}
      <div style={{
        padding: 'var(--spacing-lg) var(--spacing-md) var(--spacing-md)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)',
          marginBottom: 'var(--spacing-md)',
        }}>
          <img src="/logo.png" alt="Logo" style={{
            width: '32px', height: '32px', objectFit: 'contain',
            filter: 'drop-shadow(0 0 6px rgba(139, 92, 246, 0.3))',
          }} />
          <span className="text-gradient text-display" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            Cretacourse
          </span>
        </div>

        {/* Course switcher */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <select
            value={activeCourse.id}
            onChange={(e) => handleSwitchCourse(e.target.value)}
            className="input"
            style={{
              flex: 1, padding: '8px 10px',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>

          {activeCourse.id !== COURSE_DATA.id && (
            <button
              onClick={async () => {
                if (confirm('Delete this course? This cannot be undone.')) {
                  await deleteCourse(activeCourse.id);
                  await refreshCourses();
                  switchCourse(COURSE_DATA.id);
                  navigate('/');
                }
              }}
              className="btn btn-danger"
              style={{ padding: '8px', borderRadius: 'var(--radius-md)' }}
              title="Delete Course"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <p style={{
          fontSize: '0.75rem', color: 'var(--text-muted)',
          marginTop: 'var(--spacing-xs)',
        }}>
          {activeCourse?.phases?.length || 0} Phases
        </p>
      </div>

      {/* ── Phase List ─────────────────────────────────────── */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: 'var(--spacing-sm)',
      }}>
        <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {activeCourse?.phases?.map((phase) => {
            const progress = getPhaseProgress(phase.id, courses);
            return (
              <NavLink
                key={phase.id}
                to={`/phase/${phase.id}`}
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                style={{ display: 'block', padding: '10px 12px' }}
              >
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: '4px',
                }}>
                  <span style={{
                    fontSize: '0.85rem', fontWeight: 500,
                    whiteSpace: 'nowrap', overflow: 'hidden',
                    textOverflow: 'ellipsis', maxWidth: '170px',
                  }}>
                    {phase.title}
                  </span>
                  {progress === 100 ? (
                    <CheckCircle size={14} color="var(--success)" />
                  ) : (
                    <span style={{
                      fontSize: '0.7rem', color: 'var(--text-muted)',
                      fontWeight: 600,
                    }}>
                      {progress}%
                    </span>
                  )}
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Navigation ──────────────────────────────── */}
      <div style={{
        padding: 'var(--spacing-sm) var(--spacing-sm) var(--spacing-md)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex', flexDirection: 'column', gap: '2px',
      }}>
        {/* XP Widget */}
        <div style={{
          padding: 'var(--spacing-sm) var(--spacing-md)',
          marginBottom: 'var(--spacing-xs)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '6px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.65rem', fontWeight: 700, color: '#fff',
              }}>
                {level}
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Level {level}</span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              fontSize: '0.75rem', color: 'var(--accent)',
              fontWeight: 600,
            }}>
              <Flame size={12} />
              {streak}
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${xpProgress}%` }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: '4px', fontSize: '0.65rem', color: 'var(--text-muted)',
          }}>
            <span>{xp % 100} XP</span>
            <span>{100} XP to next</span>
          </div>
        </div>

        <NavLink to="/" end className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <Home size={16} /> <span>Home</span>
        </NavLink>
        <NavLink to="/create" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <PlusCircle size={16} /> <span>Create Course</span>
        </NavLink>
        <NavLink to="/notes" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <StickyNote size={16} /> <span>Notes</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
          <Trophy size={16} /> <span>Profile</span>
        </NavLink>

        {user?.role === 'admin' && (
          <NavLink to="/admin" className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}>
            <Settings size={16} /> <span>Admin</span>
          </NavLink>
        )}

        <button
          onClick={async () => { await logout(); navigate('/login'); }}
          className="sidebar-item"
          style={{ width: '100%', textAlign: 'left', marginTop: '4px' }}
        >
          <LogOut size={16} /> <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default CourseSidebar;
