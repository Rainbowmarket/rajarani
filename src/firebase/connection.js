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

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID,
//   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
//   databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Auth setup
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/userinfo.email');
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
auth.useDeviceLanguage();

// Export
export default app;
export { auth, provider, analytics };