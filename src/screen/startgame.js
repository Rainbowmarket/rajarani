import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDatabase, ref, get, update } from 'firebase/database';
import app from '../firebase/connection';
import confetti from 'canvas-confetti';
import styles from '../style/StartGame.module.css';
import navStyles from '../style/nav.module.css';
import { auth } from '../firebase/connection';
import { signOut } from 'firebase/auth';

const db = getDatabase(app);

const StartGame = () => {

  const [showDropdown, setShowDropdown] = useState(false);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const { id: gameId } = useParams();
  const [players, setPlayers] = useState([]);
  const [user, setUser] = useState(null);
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);
  const [isclick, setIsclick] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [coins, setCoins] = useState(1000);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('username');
      navigate('/signin');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const snapshot = await get(ref(db, `RajaRaniGame/${today}/G${gameId}`));

        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log(data.users);

          const playersArray = Object.values(data.users);
          console.log(playersArray);

          const playersObject = playersArray.filter(player => player.name !== username);
          setPlayers(playersObject);

          const userObject = playersArray.find(player => player.name === username);
          if (userObject) setUser(userObject);

          const isUsernameInActionOne = playersArray.find(player => player.action === true && player.name === username);
          setIsclick(!!isUsernameInActionOne);
        } else {
          setError('No players found for this group.');
        }
      } catch (error) {
        console.error('Error fetching players:', error);
        setError('Failed to fetch players. Please try again later.');
      }
    };

    fetchPlayers();
    const intervalId = setInterval(fetchPlayers, 3000);
    return () => clearInterval(intervalId);
  }, [username, navigate, gameId]);

  useEffect(() => {
    const calculatePositions = () => {
      if (!tableRef.current) return;
      const numPlayers = players.length;
      const tableWidth = tableRef.current.clientWidth / 2;
      const tableHeight = tableRef.current.clientHeight / 2;
      const centerX = tableWidth;
      const centerY = tableHeight;

      const playerPositions = players.map((_, index) => {
        const angle = (index / numPlayers) * 360;
        const radians = (angle * Math.PI) / 180;
        const x = centerX + tableWidth * Math.cos(radians);
        const y = centerY + tableHeight * Math.sin(radians) + 10;
        return { x, y };
      });

      setPositions(playerPositions);
    };

    if (players.length > 0) {
      calculatePositions();
      window.addEventListener('resize', calculatePositions);
    }
    return () => window.removeEventListener('resize', calculatePositions);
  }, [players]);

  const handleClick = async (player, user) => {
    setIsclick(false);
    const gameRole = {
      4: ["Raja", "Rani", "Police", "Thief"],
      5: ["Raja", "Rani", "Ministry", "Police", "Thief"],
      6: ["Raja", "Rani", "Ministry", "Police", "Thief1", "Thief2"],
      7: ["Raja", "Rani", "Ministry", "Police", "Thief1", "Thief2", "Thief3"]
    };

    const getCurrentGameRole = gameRole[players.length + 1];

    try {
      const today = new Date().toISOString().split('T')[0];
      const userPositionIndex = getCurrentGameRole.indexOf(user.position);

      if (player.position === getCurrentGameRole[userPositionIndex + 1]) {
        await update(ref(db, `RajaRaniGame/${today}/G${gameId}/users/${user.id}`), { action: false });
        await update(ref(db, `RajaRaniGame/${today}/G${gameId}/users/${player.id}`), { action: true, role: true });
        setCoins(1000);
      } else if (player.role === 1) {
        await update(ref(db, `RajaRaniGame/${today}/G${gameId}/users/${user.id}`), { name: player.name });
        await update(ref(db, `RajaRaniGame/${today}/G${gameId}/users/${player.id}`), { name: user.name });
      } else {
        setCoins(10);
      }

      const snapshot = await get(ref(db, `RajaRaniGame/${today}/G${gameId}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const playersArray = Object.values(data);
        setPlayers(playersArray.filter(player => player.name !== username));
        const userObject = playersArray.find(player => player.name === username);
        if (userObject) setUser(userObject);
        setIsclick(playersArray.some(player => player.action === true && player.name === username));
      } else {
        setError('No players found for this group.');
      }
    } catch (error) {
      alert(error);
    }

    confetti({
      particleCount: 300,
      spread: 150,
      origin: { y: 0.8 },
      shapes: ['circle', 'square'],
      gravity: 0.6,
      scalar: 2.0,
      ticks: 300
    });

    setTimeout(() => {
      setShowPopup(true);
    }, 2000);
  };

  return (
    <>
      <nav className={navStyles.navbar}>
        <div className={navStyles.navLeft}>{username ? username : "Raja Rani"}</div>
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
      <div className={styles.tableContainer} ref={tableRef}>

        {showPopup && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupContent}>
              <h2>Congratulations!</h2>
              <p>You did it! 🎉</p>
              <p>{coins} coins</p>
              <button onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {user && (
          <div className={styles.userCenter}>
            <div className={styles.profilePic}>
              <img src="https://icons.veryicon.com/png/o/system/crm-android-app-icon/app-icon-person.png" alt={`${user.name} profile`} />
            </div>
            <div className={styles.playerInfo}>
              <div className={styles.playerName}>{`${user.name} (You)`}</div>
              <div className={styles.playerContent}>{user.position}</div>
            </div>
          </div>
        )}

        {players.map((player, index) => (
          <div
            key={player.id}
            className={styles.player}
            style={{
              left: `${positions[index]?.x}px`,
              top: `${positions[index]?.y}px`,
              cursor: isclick ? "pointer" : "default"
            }}
            onClick={isclick ? () => handleClick(player, user) : null}
          >
            <div className={styles.profilePic}>
              <img src="https://icons.veryicon.com/png/o/system/crm-android-app-icon/app-icon-person.png" alt={`${player.name} profile`} />
            </div>
            <div className={styles.playerInfo}>
              <div className={styles.playerName}>{player.name}</div>
              <div className={styles.playerContent}>
                {player.role ? player.position : player.name === username ? player.position : "******"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default StartGame;
