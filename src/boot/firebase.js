import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAU1TQ4OomzN2RjVesWI2EkL5kKsl1OzE4",
  authDomain: "uniflow-6a064.firebaseapp.com",
  projectId: "uniflow-6a064",
  storageBucket: "uniflow-6a064.firebasestorage.app",
  messagingSenderId: "339539887499",
  appId: "1:339539887499:web:01beeaac184009ace01b8e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore

console.log("Firebase initialized:", app.name); // Should log "[DEFAULT]"

// Export auth and db
export { auth, db };
