import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../style/CreateGroupOrJoinGroup.module.css';
import navStyles from '../style/nav.module.css';
import { auth } from '../firebase/connection';
import { signOut } from 'firebase/auth';

const CreateGroupOrJoinGroup = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      navigate('/signin');
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('username');
      navigate('/signin');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleCreateGroup = () => {
    navigate('/CreateGroup');
  };

  const handleJoinGroup = () => {
    navigate('/JoinGroup');
  };

  return (
    <>
      {/* NavBar */}
      <nav className={navStyles.navbar}>
        <div className={navStyles.navLeft}>Raja Rani</div>
        <div className={navStyles.navRight}>
          <div className={navStyles.profileWrapper} onClick={() => setShowDropdown(!showDropdown)}>
            <img
              src="https://www.gravatar.com/avatar?d=mp&s=40"
              alt="Profile"
              className={navStyles.profileImage}
            />
            {showDropdown && (
              <div className={navStyles.dropdownMenu}>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className={styles.container}>
        <h1 className={styles.heading}>Raja Rani Game</h1>
        <h2 className={styles.heading}>Choose an Option</h2>
        <button className={styles.button} onClick={handleCreateGroup}>Create Group</button>
        <p>or</p>
        <button className={styles.button} onClick={handleJoinGroup}>Join Group</button>
      </div>
    </>
  );
};

export default CreateGroupOrJoinGroup;
