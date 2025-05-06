import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from "../firebase/connection";
import { signInWithPopup, signInAnonymously } from "firebase/auth";
import styles from '../style/SignIn.module.css';

const SignIn = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem('username', user.displayName || 'Google User');
      navigate('/');
    } catch (error) {
      console.error("Google sign-in error:", error);
      setErrorMessage("Google sign-in failed. Please try again.");
    }
  };

  // Anonymous Sign-In with random guest name
  const handleAnonymousSignIn = async () => {
    try {
      const result = await signInAnonymously(auth);
      const user = result.user;
      console.log("user",user);
      const guestName = `Guest${Math.floor(100 + Math.random() * 900)}`;
      localStorage.setItem('username', guestName);
      localStorage.setItem('userId', user.uid); // Optional: store UID
      navigate('/');
    } catch (error) {
      console.error("Anonymous sign-in error:", error);
      setErrorMessage("Anonymous sign-in failed. Please try again.");
    }
  };

  return (
    <div className={styles.signinContainer}>
      <h2 className={styles.heading}>Sign In</h2>

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      <div className={styles.googleSignInWrapper}>
        <button onClick={handleGoogleSignIn} className={styles.googleSignInButton}>
          Sign in with Google
        </button>
      </div>

      <div className={styles.googleSignInWrapper}>
        <button onClick={handleAnonymousSignIn} className={styles.googleSignInButton}>
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default SignIn;
