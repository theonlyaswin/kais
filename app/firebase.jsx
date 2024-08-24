
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase, ref, set, get, push } from 'firebase/database';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCV1Z8-EZWdUwPnsAiPrRn6hScbt9_AnHs",
  authDomain: "kaisonline.firebaseapp.com",
  databaseURL: "https://kaisonline-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kaisonline",
  storageBucket: "kaisonline.appspot.com",
  messagingSenderId: "1038384566126",
  appId: "1:1038384566126:web:0a2dab22a90c750066bb7f",
  measurementId: "G-336STKC5HQ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { db, storage , database };