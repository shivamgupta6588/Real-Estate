// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-44328.firebaseapp.com",
  projectId: "mern-estate-44328",
  storageBucket: "mern-estate-44328.appspot.com",
  messagingSenderId: "827872649917",
  appId: "1:827872649917:web:1bd8f56cf1d74322b64dd4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);