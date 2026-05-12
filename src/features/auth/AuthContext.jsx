import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendEmailVerification,
    updateProfile
} from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    // Fetch additional user data from Firestore (like role)
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    const userData = userDoc.exists() ? userDoc.data() : {};

                    setUser({
                        ...currentUser,
                        role: userData.role || 'user',
                        gender: userData.gender
                    });
                } catch (err) {
                    console.error("Firestore getDoc error:", err);
                    // Critical: if Firestore fails due to API key restrictions or rules, 
                    // we still want to log them in, or at least show the failure.
                    // Instead of failing silently and hanging the login screen, we set default role.
                    alert("Logged in, but failed to fetch user profile data from Firestore. Check console for details.");
                    setUser({
                        ...currentUser,
                        role: 'user'
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = async (username, password, email, gender) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Send verification email
            console.log("Attempting to send verification email to:", user.email);
            await sendEmailVerification(user);
            console.log("Verification email sent successfully.");

            // Update display name
            await updateProfile(user, { displayName: username });

            // Save extra data to Firestore
            await setDoc(doc(db, 'users', user.uid), {
                username,
                email,
                gender,
                role: 'user', // Default role
                createdAt: new Date().toISOString()
            });

            return user;
        } catch (error) {
            throw error;
        }
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            signup,
            logout,
            isAuthenticated: !!user,
            isAdmin: user?.role === 'admin'
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
