import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyClB7CqkBlE-W7QgReNfwxJdF6_C-TXM4s",
  authDomain: "fir-b2533.firebaseapp.com",
  projectId: "fir-b2533",
  storageBucket: "fir-b2533.firebasestorage.app",
  messagingSenderId: "593602258635",
  appId: "1:593602258635:web:1272d313ff2da00a985d4e",
  measurementId: "G-128LZWCMND",
  databaseURL:
    "https://fir-b2533-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
export { auth, db };
export default app;
