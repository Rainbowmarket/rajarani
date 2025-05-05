import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from "../firebase/connection";
import { signInWithPopup } from "firebase/auth";
import styles from '../style/SignIn.module.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === '' || password === '') {
      setErrorMessage('Username and password are required');
    } else {
      setErrorMessage('');
      localStorage.setItem('username', username);
      navigate('/');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem('username', user.displayName);
      navigate('/');
    } catch (error) {
      console.error("Error during sign-in:", error);
      setErrorMessage("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className={styles.signinContainer}>
      <form className={styles.signinForm} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>Sign In</h2>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className={styles.input}
          />
        </div>

        <button type="submit" className={styles.signinButton}>Sign In</button>
      </form>

      <div className={styles.googleSignInWrapper}>
        <button onClick={handleGoogleSignIn} className={styles.googleSignInButton}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;
