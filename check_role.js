import { db } from './src/lib/firebase.js';
import { collection, getDocs, query, where } from 'firebase/firestore';

async function checkUser() {
    console.log('Checking user role...');
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '>=', 'materialkrishna')); // Simple check

    const snapshot = await getDocs(usersRef);
    const user = snapshot.docs.find(d => d.data().email && d.data().email.includes('materialkrishna'));

    if (user) {
        console.log('User Found:', user.data());
        console.log('Role:', user.data().role);
    } else {
        console.log('User NOT found.');
    }
}

checkUser();
