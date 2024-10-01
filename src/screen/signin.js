import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import '../style/SignIn.css';  // Import your custom CSS for styling

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();  // Initialize the navigate hook

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate username and password fields
    if (username === '' || password === '') {
      setErrorMessage('Username and password are required');
    } else {
      setErrorMessage('');

      // Simulate successful sign-in
      console.log('Signing in with', { username, password });

      // Save username to localStorage
      localStorage.setItem('username', username);

      // Navigate to the home page after signing in
      navigate('/');
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        
        {errorMessage && <p className="error">{errorMessage}</p>}
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>
        
        <button type="submit" className="signin-button">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
