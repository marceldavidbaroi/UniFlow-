// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
console.log("Firebase initialized:", app.name); // Should log "[DEFAULT]"

