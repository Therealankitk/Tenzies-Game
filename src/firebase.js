import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyA1aoq_-UonkFagKSPyDcYtfHoYDWJJN6A",
  authDomain: "tenzies-game-9ddc5.firebaseapp.com",
  databaseURL: "https://tenzies-game-9ddc5-default-rtdb.firebaseio.com",
  projectId: "tenzies-game-9ddc5",
  storageBucket: "tenzies-game-9ddc5.firebasestorage.app",
  messagingSenderId: "954214639550",
  appId: "1:954214639550:web:0b90a6c500a1a99775bbef",
  measurementId: "G-WWXJJTT728"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const bestScoreRef = ref(database, "bestScore");

export { database, bestScoreRef, get, set };