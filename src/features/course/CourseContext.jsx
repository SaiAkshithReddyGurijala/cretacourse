import React, { createContext, useContext, useState, useEffect } from 'react';
import { COURSE_DATA } from '../../data/courses';
import { getAllCourses } from '../db/firestoreService';
import { useAuth } from '../auth/AuthContext';

const CourseContext = createContext();

export const useCourse = () => useContext(CourseContext);

export const CourseProvider = ({ children }) => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([COURSE_DATA]);
    const [loading, setLoading] = useState(true);
    const [activeCourseId, setActiveCourseId] = useState(COURSE_DATA.id);

    useEffect(() => {
        const fetchCourses = async () => {
            if (!user) {
                setCourses([COURSE_DATA]);
                setLoading(false);
                return;
            }

            try {
                const customCourses = await getAllCourses(user.uid, user.role === 'admin');
                setCourses([COURSE_DATA, ...customCourses]);

                // Restore active course
                const storedId = localStorage.getItem('active_course_id');
                if (storedId) setActiveCourseId(storedId);
            } catch (err) {
                console.error("Failed to load courses", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [user]);

    const refreshCourses = async () => {
        if (!user) return;
        const customCourses = await getAllCourses(user.uid, user.role === 'admin');
        setCourses([COURSE_DATA, ...customCourses]);
    };

    const switchCourse = (courseId) => {
        setActiveCourseId(courseId);
        localStorage.setItem('active_course_id', courseId);
    };

    const getPhaseById = (phaseId) => {
        for (const course of courses) {
            const phase = course.phases?.find(p => p.id === phaseId);
            if (phase) return phase;
        }
        return null;
    };

    const activeCourse = courses.find(c => c.id === activeCourseId) || courses[0];

    return (
        <CourseContext.Provider value={{
            courses,
            activeCourse,
            switchCourse,
            refreshCourses,
            getPhaseById,
            loading
        }}>
            {children}
        </CourseContext.Provider>
    );
};
