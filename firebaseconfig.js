// Configration File

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import {  getFirestore } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyA3Ql0hL3a7bufeXJZfNfS1aFNZW0D7TcI",
  authDomain: "fire-begin-daaba.firebaseapp.com",
  projectId: "fire-begin-daaba",
  storageBucket: "fire-begin-daaba.firebasestorage.app",
  messagingSenderId: "1086688232048",
  appId: "1:1086688232048:web:5ce69975835b3f69762ab5",
  measurementId: "G-KE0KLRBC84"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);