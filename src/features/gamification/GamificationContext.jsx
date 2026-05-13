import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { COURSE_DATA } from '../../data/courses';
import { useAuth } from '../auth/AuthContext';
import { db } from '../../lib/firebase';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';

const GamificationContext = createContext();

export const useGamification = () => {
    return useContext(GamificationContext);
};

// XP rewards for different actions
const XP_REWARDS = {
    COMPLETE_RESOURCE: 50,
    STREAK_BONUS: 30,
    TAKE_NOTE: 20,
};

// Get today's date string (YYYY-MM-DD) for streak tracking
const getTodayStr = () => new Date().toISOString().split('T')[0];

export const GamificationProvider = ({ children }) => {
    const { user } = useAuth();

    // Gamification State
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [streak, setStreak] = useState(0);
    const [completedResources, setCompletedResources] = useState([]);
    const [lastActiveDate, setLastActiveDate] = useState(null);
    const [unlockedBadges, setUnlockedBadges] = useState([]);

    // Notification state (for XPToast)
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = 'xp') => {
        const id = Date.now() + Math.random();
        setNotifications(prev => [...prev, { id, message, type }]);
        // Auto-remove after 3 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 3000);
    }, []);

    const dismissNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // Load progress from Firestore when user changes
    useEffect(() => {
        if (!user) {
            setXp(0);
            setLevel(1);
            setStreak(0);
            setCompletedResources([]);
            setLastActiveDate(null);
            setUnlockedBadges([]);
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
                setLastActiveDate(data.lastActiveDate || null);
                setUnlockedBadges(data.unlockedBadges || []);
            } else {
                // Initialize if not exists
                const today = getTodayStr();
                setDoc(progressRef, {
                    xp: 0,
                    level: 1,
                    streak: 0,
                    completedResources: [],
                    lastActiveDate: today,
                    unlockedBadges: [],
                });
            }
        });

        return unsubscribe;
    }, [user]);

    // Calculate streak based on lastActiveDate
    const calculateStreak = (currentStreak, lastDate) => {
        const today = getTodayStr();
        if (!lastDate) return 1;
        if (lastDate === today) return currentStreak; // Already active today

        const last = new Date(lastDate);
        const now = new Date(today);
        const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return currentStreak + 1; // Consecutive day
        if (diffDays > 1) return 1; // Streak broken, reset to 1
        return currentStreak;
    };

    // Calculate level from XP (progressive curve)
    const calculateLevel = (totalXp) => {
        // Level thresholds: L1=0, L2=100, L3=250, L4=450, L5=700, etc.
        // Formula: level where cumulative XP = sum of (100 * i) for i=1..level
        let lvl = 1;
        let needed = 0;
        while (needed + lvl * 100 <= totalXp) {
            needed += lvl * 100;
            lvl++;
        }
        return lvl;
    };

    // Check badge unlocks
    const checkBadgeUnlocks = (newXp, newStreak, newCompletedCount) => {
        const newBadges = [];
        const hour = new Date().getHours();

        const badgeConditions = [
            { id: 'first-step', condition: newCompletedCount >= 1, name: 'First Step' },
            { id: 'on-fire', condition: newStreak >= 3, name: 'On Fire' },
            { id: 'dedicated', condition: calculateLevel(newXp) >= 5, name: 'Dedicated' },
            { id: 'master', condition: calculateLevel(newXp) >= 10, name: 'Master' },
            { id: 'night-owl', condition: hour >= 22 || hour < 4, name: 'Night Owl' },
            { id: 'early-bird', condition: hour >= 4 && hour < 7, name: 'Early Bird' },
        ];

        badgeConditions.forEach(({ id, condition, name }) => {
            if (condition && !unlockedBadges.includes(id)) {
                newBadges.push({ id, name });
            }
        });

        return newBadges;
    };

    const markResourceComplete = async (resourceId) => {
        if (!user) return;
        if (completedResources.includes(resourceId)) return;

        // Optimistic update
        setCompletedResources(prev => [...prev, resourceId]);

        const progressRef = doc(db, 'users', user.uid, 'progress', 'general');
        const today = getTodayStr();

        // Calculate new values
        const newXp = xp + XP_REWARDS.COMPLETE_RESOURCE;
        const newStreak = calculateStreak(streak, lastActiveDate);
        const newLevel = calculateLevel(newXp);
        const newCompletedCount = completedResources.length + 1;

        // Check for new badges
        const newBadges = checkBadgeUnlocks(newXp, newStreak, newCompletedCount);
        const allBadgeIds = [...unlockedBadges, ...newBadges.map(b => b.id)];

        // XP notification
        addNotification(`+${XP_REWARDS.COMPLETE_RESOURCE} XP`, 'xp');

        // Streak bonus (if streak just incremented)
        if (newStreak > streak) {
            addNotification(`🔥 ${newStreak}-day streak! +${XP_REWARDS.STREAK_BONUS} XP`, 'streak');
        }

        // Badge notifications
        newBadges.forEach(badge => {
            addNotification(`🏆 Badge Unlocked: ${badge.name}!`, 'badge');
        });

        // Level up notification
        if (newLevel > level) {
            addNotification(`⭐ Level Up! You're now Level ${newLevel}!`, 'levelup');
        }

        // Calculate total XP with streak bonus
        let totalXpGain = XP_REWARDS.COMPLETE_RESOURCE;
        if (newStreak > streak) totalXpGain += XP_REWARDS.STREAK_BONUS;

        try {
            await updateDoc(progressRef, {
                completedResources: arrayUnion(resourceId),
                xp: increment(totalXpGain),
                level: newLevel,
                streak: newStreak,
                lastActiveDate: today,
                unlockedBadges: allBadgeIds,
            });
        } catch (err) {
            console.error('Failed to update progress:', err);
        }
    };

    const getPhaseProgress = (phaseId, allCourses = []) => {
        // Try to find in default
        let phase = COURSE_DATA.phases.find(p => p.id === phaseId);

        // If not found, try custom courses
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
            unlockedBadges,
            markResourceComplete,
            getPhaseProgress,
            notifications,
            dismissNotification,
        }}>
            {children}
        </GamificationContext.Provider>
    );
};
