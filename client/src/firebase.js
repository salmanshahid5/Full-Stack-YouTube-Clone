import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiJGQSA9ik7mribyLBjMKW5q0T_2grqLA",
  authDomain: "food-panda-2.firebaseapp.com",
  projectId: "food-panda-2",
  storageBucket: "food-panda-2.appspot.com",
  messagingSenderId: "1067346731195",
  appId: "1:1067346731195:web:7ca623b3750b7f7968499e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const previder = new GoogleAuthProvider();
export default app;
