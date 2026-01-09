import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAa93TQTlmKM0A4-tQS0iaUoN7uS0zu4zU",
  authDomain: "mytraveleats-d8465.firebaseapp.com",
  databaseURL: "https://mytraveleats-d8465-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mytraveleats-d8465",
  storageBucket: "mytraveleats-d8465.firebasestorage.app",
  messagingSenderId: "180755492554",
  appId: "1:180755492554:web:45aefb026f2615c3e94e33",
  measurementId: "G-5GR60QL36G"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);