// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDsYhL1JbjvdAZqVTXbe2Ye8kUKja5r3fo",
    authDomain: "travel-ai-9262a.firebaseapp.com",
    projectId: "travel-ai-9262a",
    storageBucket: "travel-ai-9262a.appspot.com",
    messagingSenderId: "31838266993",
    appId: "1:31838266993:web:26e07c69e5350afcb4ddd0",
    measurementId: "G-ZHMYHJ002S"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
//const analytics = getAnalytics(app);