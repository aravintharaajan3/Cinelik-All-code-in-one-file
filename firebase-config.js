// Firebase SDK-a import panrom (CDN moolama) - Version updated to 10.12.0
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Nee copy panna unnudaiya config
const firebaseConfig = {
  apiKey: "AIzaSyBy-5mFj5g_Pvc6JXwThcF3qOkHyjcZgh0",
  authDomain: "cinelink-bb553.firebaseapp.com",
  projectId: "cinelink-bb553",
  storageBucket: "cinelink-bb553.firebasestorage.app",
  messagingSenderId: "73483610821",
  appId: "1:73483610821:web:4f48117d11323058209eac",
  measurementId: "G-ZH7NHCNDTB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Itha maththa files-la use panna export panrom
export { db, auth };