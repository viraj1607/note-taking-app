// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuXAbb3nRktAUo_1SNWiysg9KdJ5pRzXA",
  authDomain: "notes-a7659.firebaseapp.com",
  projectId: "notes-a7659",
  storageBucket: "notes-a7659.appspot.com",
  messagingSenderId: "1022037213784",
  appId: "1:1022037213784:web:431c35aae691e8d7ffc02d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);