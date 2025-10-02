// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { getDatabase } from "firebase/database";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC99qptp4NZWVm8gfNt7m2v3mdB2UDV4CA",
  authDomain: "wisma-musik-rhapsodi.firebaseapp.com",
  projectId: "wisma-musik-rhapsodi",
  storageBucket: "wisma-musik-rhapsodi.firebasestorage.app",
  messagingSenderId: "869424677993",
  appId: "1:869424677993:web:04148865f2f3cac5398ef8",
  measurementId: "G-GF9K5G39PQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const auth = getAuth(app);

const storage = getStorage(app);
const database = getDatabase(app);

const provider = new GoogleAuthProvider();

export { db, auth, analytics, provider, storage, database, collection, getDocs, addDoc, updateDoc, doc, deleteDoc, serverTimestamp };
