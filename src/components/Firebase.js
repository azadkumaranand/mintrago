// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import 'firebase/auth';
import 'firebase/firestore';
import { getStorage } from "firebase/storage";

// const firebaseConfig = {

//   apiKey: "AIzaSyA4JHaW9GIvlWs68csrh3uSlQPx6JR_sDE",
//   authDomain: "mintrago-31a22.firebaseapp.com",
//   projectId: "mintrago-31a22",
//   storageBucket: "mintrago-31a22.appspot.com",
//   messagingSenderId: "537441610613",
//   appId: "1:537441610613:web:0761110686e662ec79413c"
// };
const firebaseConfig = {

  apiKey: "AIzaSyDZhawSu6oH2vGvH1HUGl5FKSnK2xcoPRI",
  authDomain: "mintrago-98cf7.firebaseapp.com",
  projectId: "mintrago-98cf7",
  storageBucket: "mintrago-98cf7.appspot.com",
  messagingSenderId: "508923322928",
  appId: "1:508923322928:web:cc8a39b38096cf08ecc3f5",
  measurementId: "G-C511Q97SZY"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth()
const resetpass = sendPasswordResetEmail()
export {app, auth, db, resetpass, storage}