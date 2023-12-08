// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-ad654.firebaseapp.com",
  projectId: "mern-estate-ad654",
  storageBucket: "mern-estate-ad654.appspot.com",
  messagingSenderId: "1011249974645",
  appId: "1:1011249974645:web:d75cd05cb0c28384be173c"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);