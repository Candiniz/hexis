// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, remove } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyArWK1K3HLp7GFJbsf09vQFvEeJWT5g9YM",
  authDomain: "hexis-2cd94.firebaseapp.com",
  databaseURL: "https://hexis-2cd94-default-rtdb.firebaseio.com", // URL do Realtime Database
  projectId: "hexis-2cd94",
  storageBucket: "hexis-2cd94.appspot.com",
  messagingSenderId: "181671286131",
  appId: "1:181671286131:web:69cd7c666ba6bcdc6ce106",
  measurementId: "G-HMYE1TMMWS"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, ref, set, get, child, remove, auth };  // Exporte as funções do Realtime Database
