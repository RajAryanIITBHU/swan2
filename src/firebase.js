
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyDyrgSpZYw2aGuUEBtRY1djanadggcRVIk",
  authDomain: "swan2-65792.firebaseapp.com",
  projectId: "swan2-65792",
  storageBucket: "swan2-65792.firebasestorage.app",
  messagingSenderId: "315998320960",
  appId: "1:315998320960:web:e8a81f6124577dd01ca2a5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db}
