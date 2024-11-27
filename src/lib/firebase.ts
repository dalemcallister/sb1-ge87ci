// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUjlE61gVqmwLNLT6mwRqiTKncRkb2Uhg",
  authDomain: "lastmileconnexi.firebaseapp.com",
  projectId: "lastmileconnexi",
  storageBucket: "lastmileconnexi.firebasestorage.app",
  messagingSenderId: "396528673610",
  appId: "1:396528673610:web:7e1ebe4afce965d32c17b3",
  measurementId: "G-ETXM0TLKFW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support persistence.');
    }
  });

// Export the Firebase instances
export { app, auth, db };