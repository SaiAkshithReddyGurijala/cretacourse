import React, { createContext, useContext, useState, useEffect } from 'react';
import { COURSE_DATA } from '../../data/courses';
import { useAuth } from '../auth/AuthContext';
import { db } from '../../lib/firebase';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';

const GamificationContext = createContext();

export const useGamification = () => {
    return useContext(GamificationContext);
};

export const GamificationProvider = ({ children }) => {
    const { user } = useAuth();

    // Gamification State
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [streak, setStreak] = useState(0);
    const [completedResources, setCompletedResources] = useState([]);

    // Load progress from Firestore when user changes
    useEffect(() => {
        if (!user) {
            // Reset state on logout
            setXp(0);
            setLevel(1);
            setStreak(0);
            setCompletedResources([]);
            return;
        }

        const progressRef = doc(db, 'users', user.uid, 'progress', 'general');

        const unsubscribe = onSnapshot(progressRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setXp(data.xp || 0);
                setLevel(data.level || 1);
                setStreak(data.streak || 0);
                setCompletedResources(data.completedResources || []);
            } else {
                // Initialize if not exists
                setDoc(progressRef, {
                    xp: 0,
                    level: 1,
                    streak: 0,
                    completedResources: []
                });
            }
        });

        return unsubscribe;
    }, [user]);

    const markResourceComplete = async (resourceId) => {
        if (!user) return;
        if (!completedResources.includes(resourceId)) {
            // Optimistic update
            setCompletedResources(prev => [...prev, resourceId]);

            const progressRef = doc(db, 'users', user.uid, 'progress', 'general');

            // Calculate new XP and Level
            const newXp = xp + 50;
            const newLevel = Math.floor(newXp / 100) + 1;

            await updateDoc(progressRef, {
                completedResources: arrayUnion(resourceId),
                xp: increment(50),
                level: newLevel
            });
        }
    };

    // We need access to courses to calculate progress, but we can't use useCourse here 
    // because CourseProvider wraps GamificationProvider.
    // Instead, we'll pass the course data into getPhaseProgress or fetch it differently.
    // Actually, let's just import COURSE_DATA for default and rely on the UI to pass max/total if needed.
    // BETTER FIX: The UI (Sidebar/CourseView) knows the total resources. 
    // Let's keep it simple: We will just count completed resources for now, 
    // OR we can move getPhaseProgress to the Component level or CourseContext.

    // For now, let's try to find the phase in the global courses list if possible, 
    // but we don't have access to it here easily without circular deps.
    // Let's move getPhaseProgress logic to CourseContext or a utility that takes the course list.

    // TEMPORARY FIX: We will accept the 'phase' object as an argument instead of ID, 
    // or the component calling this must provide the phase object.
    const getPhaseProgress = (phaseId, allCourses = []) => {
        // Try to find in default
        let phase = COURSE_DATA.phases.find(p => p.id === phaseId);

        // If not found, try to find in the passed custom courses (if provided)
        if (!phase && allCourses.length > 0) {
            for (const c of allCourses) {
                const p = c.phases?.find(ph => ph.id === phaseId);
                if (p) {
                    phase = p;
                    break;
                }
            }
        }

        if (!phase) return 0;

        let total = 0;
        let completed = 0;

        phase.modules.forEach(module => {
            module.resources.forEach(res => {
                total++;
                if (completedResources.includes(res.id)) completed++;
            });
        });

        return total === 0 ? 0 : Math.round((completed / total) * 100);
    };

    return (
        <GamificationContext.Provider value={{
            xp, level, streak,
            completedResources,
            markResourceComplete,
            getPhaseProgress
        }}>
            {children}
        </GamificationContext.Provider>
    );
};
