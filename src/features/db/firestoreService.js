import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, setDoc } from 'firebase/firestore';

export const saveCourse = async (course, userId) => {
    try {
        // Use setDoc with the generated course.id to ensure Document ID matches Data ID
        await setDoc(doc(db, 'courses', course.id), {
            ...course,
            createdBy: userId,
            createdAt: new Date().toISOString()
        });
        return course;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

export const getAllCourses = async (userId = null, isAdmin = false) => {
    let q;
    if (isAdmin) {
        q = collection(db, 'courses');
    } else if (userId) {
        q = query(collection(db, 'courses'), where('createdBy', '==', userId));
    } else {
        return []; // No user, no courses
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteCourse = async (courseId) => {
    try {
        // 1. Try to find documents where the 'id' field matches (legacy/mismatched courses)
        const q = query(collection(db, 'courses'), where('id', '==', courseId));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
            await Promise.all(deletePromises);
            console.log(`Deleted ${snapshot.size} documents via query for id=${courseId}`);
        } else {
            // 2. If no match by field, try deleting by document ID directly
            const courseRef = doc(db, 'courses', courseId);
            await deleteDoc(courseRef);
            console.log(`Attempted delete by doc ID ${courseId}`);
        }
    } catch (e) {
        console.error("Error deleting course:", e);
        throw e;
    }
};

export const deleteUser = async (userId) => {
    // 1. Delete user's courses
    const coursesQuery = query(collection(db, 'courses'), where('createdBy', '==', userId));
    const coursesSnapshot = await getDocs(coursesQuery);
    const deletePromises = coursesSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // 2. Delete user document
    await deleteDoc(doc(db, 'users', userId));
};
