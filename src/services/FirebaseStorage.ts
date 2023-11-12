import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";



export { app, db, storage };



const firebaseConfig = {

  apiKey: "AIzaSyA3RTaph63Zou9mmUdxcX7mA0UEOLelxYQ",

  authDomain: "wwnbb-blog.firebaseapp.com",

  projectId: "wwnbb-blog",

  storageBucket: "wwnbb-blog.appspot.com",

  messagingSenderId: "104641055045",

  appId: "1:104641055045:web:fc04dbeebf4ec5883d962c",

  measurementId: "G-6M3TP0G4T2"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);
