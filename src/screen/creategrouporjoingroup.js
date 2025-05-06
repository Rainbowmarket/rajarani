import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../style/CreateGroupOrJoinGroup.module.css';
import navStyles from '../style/nav.module.css';
import { auth } from '../firebase/connection';
import { signOut } from 'firebase/auth';
import { getDatabase, set, ref, get, onValue } from 'firebase/database';
import app from '../firebase/connection';

const db = getDatabase(app);

const CreateGroupOrJoinGroup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [groupId, setGroupId] = useState('');
  const [users, setUsers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [isJoin, setIsJoin] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      navigate('/signin');
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  useEffect(() => {
    if (!groupId) return;
    const groupPath = `RajaRaniGame/${new Date().toISOString().split('T')[0]}/G${groupId}`;
    const groupRef = ref(db, groupPath);

    onValue(groupRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.values(data.users || {});
        setUsers(userList);
        if (data.gameStarted) {
          setGameStarted(true);
          navigate(`/startgame/${groupId}`);
        }
      }
    });
  }, [groupId, navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('username');
    navigate('/signin');
  };

  const handleHost = () => {
    const newGroupId = Math.floor(100000 + Math.random() * 900000).toString();
    setGroupId(newGroupId);
    setIsHost(true);

    const groupPath = `RajaRaniGame/${new Date().toISOString().split('T')[0]}/G${newGroupId}`;
    set(ref(db, groupPath), {
      users: {
        [username]: { name: username, position: null, action: 0, role: 0 }
      },
      gameStarted: false,
    });
  };

  const handleJoin = () => {
    if (groupId.length !== 6) return alert('Enter valid 6-digit Group ID');
    const groupPath = `RajaRaniGame/${new Date().toISOString().split('T')[0]}/G${groupId}`;
    const groupRef = ref(db, groupPath);
    setIsJoin(true);
    get(groupRef).then(snapshot => {
      if (!snapshot.exists()) return alert('Group ID not found');
      const currentData = snapshot.val();
      currentData.users = currentData.users || {};
      currentData.users[username] = {
        name: username, position: null, action: 0, role: 0
      };
      set(groupRef, currentData);
    }).catch(console.error);
  };

  const handleStartGame = () => {
    const groupPath = `RajaRaniGame/${new Date().toISOString().split('T')[0]}/G${groupId}`;
    const groupRef = ref(db, groupPath);
    const userMap = users.reduce((acc, user) => {
      acc[user.name] = user;
      return acc;
    }, {});
    set(groupRef, { users: userMap, gameStarted: true });
  };

  return (
    <>
      <nav className={navStyles.navbar}>
        <div className={navStyles.navLeft}>{username}</div>
        <div className={navStyles.navRight}>
          <div onClick={() => setShowDropdown(!showDropdown)} className={navStyles.profileWrapper}>
            <img src="https://www.gravatar.com/avatar?d=mp&s=40" alt="Profile" className={navStyles.profileImage} />
            {showDropdown && (
              <div className={navStyles.dropdownMenu}>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className={styles.container}>
        <h1 className={styles.heading}>Raja Rani Game</h1>

        {/* Input and Buttons */}
        {!gameStarted && !isHost && !isJoin &&(
          <>
            <div className={styles.inputButtonWrapper}>
              <input
                type="text"
                value={groupId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d{0,6}$/.test(val)) setGroupId(val);
                }}
                placeholder="Enter 6-digit Group ID"
                className={styles.input}
              />

              <button onClick={handleJoin} className={styles.button}>
                Join
              </button>
            </div>

            {!groupId && (
              <>
                <p style={{ marginTop: '5px' }}>or</p>
                <button className={styles.button} onClick={handleHost}>Host</button>

              </>
            )}
          </>
        )}

        {/* Group Info */}
        {groupId && (
          <>
            <h2 className={styles.heading}>Group ID: {groupId}</h2>
            <h3 className={styles.heading}>Users in Group:</h3>
            {users.length ? (
              <ul className={styles.userList}>
                {users.map((user, index) => (
                  <li key={index} className={styles.userItem}>{user.name}</li>
                ))}
              </ul>
            ) : (
              <p>No user available</p>
            )}
          </>
        )}

        {/* Start Game for Host */}
        {isHost && groupId && !gameStarted && (
          <button className={styles.button} onClick={handleStartGame}>Start Game</button>
        )}
      </div>
    </>
  );
};

export default CreateGroupOrJoinGroup;
