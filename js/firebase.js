import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your Firebase credentials
const firebaseConfig = {
  apiKey: "AIzaSyATmXba_AqpAcxyydrwJYoZHP8yhLqknUs",
  authDomain: "myclinicqueue.firebaseapp.com",
  projectId: "myclinicqueue",
  storageBucket: "myclinicqueue.firebasestorage.app",
  messagingSenderId: "1074880785148",
  appId: "1:1074880785148:web:3c603b6496924a65b34579",
  measurementId: "G-19DDQR3HJS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export instances to be used in all other files
export const db = getFirestore(app);
export const auth = getAuth(app);

console.log("🔥 Firebase Connection: Established");