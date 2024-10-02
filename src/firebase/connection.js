import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBBul5TJjMTA3870Sx3_b6S9qSEBxfl6Tc",
  authDomain: "rajarani-2024.firebaseapp.com",
  projectId: "rajarani-2024",
  storageBucket: "rajarani-2024.appspot.com",
  messagingSenderId: "932766212246",
  appId: "1:932766212246:web:4fe6b7479d45ecd66ae2b7",
  measurementId: "G-N3K6F78KZ9",
  databaseURL: "https://rajarani-2024-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();
provider.addScope('http://localhost:3000/');
auth.useDeviceLanguage();
export default app;
export {auth, provider, getAnalytics}