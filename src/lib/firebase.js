import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCP5ZLb1HPLhBmtAjBknK3wCy4SR7uYDbg",
    authDomain: "cretacourse.firebaseapp.com",
    projectId: "cretacourse",
    storageBucket: "cretacourse.firebasestorage.app",
    messagingSenderId: "845612207214",
    appId: "1:845612207214:web:0f157b63bb0a4ddd3d2a7f",
    measurementId: "G-D6K2S45700"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
