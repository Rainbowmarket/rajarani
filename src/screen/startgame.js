import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDatabase, ref, get, update } from 'firebase/database';
import app from '../firebase/connection';
import '../style/StartGame.css';
import confetti from 'canvas-confetti';

const db = getDatabase(app);

const StartGame = () => {
  const navigate = useNavigate();
  const { id: gameId, username } = useParams();
  const [players, setPlayers] = useState([]);
  const [user, setUser] = useState(null);
  const [positions, setPositions] = useState([]);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);
  const [isclick, setIsclick] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [coins, setCoins] = useState(1000);

  useEffect(() => {
    // if (username !== localStorage.getItem('username')) {
    //   navigate('/signin');
    // }

    const fetchPlayers = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const snapshot = await get(ref(db, `RajaRaniGame/${today}/G${gameId}`));

        if (snapshot.exists()) {
          const data = snapshot.val();
          const playersArray = Object.values(data);

          const playersObject = playersArray.filter(player => player.name !== username);
          setPlayers(playersObject);

          const userObject = playersArray.find(player => player.name === username);
          if (userObject) {
            setUser(userObject);
          }
          const isUsernameInActionOne = playersArray.find(player => player.action === true && player.name === username);
          if (isUsernameInActionOne) {
            setIsclick(true);
          }
          else {
            setIsclick(false);
          }
        } else {
          setError('No players found for this group.');
        }
      } catch (error) {
        console.error('Error fetching players:', error);
        setError('Failed to fetch players. Please try again later.');
      }
    };

    fetchPlayers(); // Initial fetch

    const intervalId = setInterval(fetchPlayers, 3000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Clean up the interval on unmount
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
        const userRef = ref(db, `RajaRaniGame/${today}/G${gameId}/${user.id}`);
        await update(userRef, { action: false });
        const playerRef = ref(db, `RajaRaniGame/${today}/G${gameId}/${player.id}`);
        await update(playerRef, { action: true, role: true });
        setCoins(1000);
      }
      else if (player.role === 1) {
        const userRef = ref(db, `RajaRaniGame/${today}/G${gameId}/${user.id}`);
        await update(userRef, { name: player.name });
        const playerRef = ref(db, `RajaRaniGame/${today}/G${gameId}/${player.id}`);
        await update(playerRef, { name: user.name });
      }else{
        setCoins(10);
      }
      const snapshot = await get(ref(db, `RajaRaniGame/${today}/G${gameId}`));

      if (snapshot.exists()) {
        const data = snapshot.val();
        const playersArray = Object.values(data);

        const playersObject = playersArray.filter(player => player.name !== username);
        setPlayers(playersObject);

        const userObject = playersArray.find(player => player.name === username);
        if (userObject) {
          setUser(userObject);
        }
        const isUsernameInActionOne = playersArray.find(player => player.action === true && player.name === username);
        if (isUsernameInActionOne) {
          setIsclick(true);
        }
        else {
          setIsclick(false);
        }
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
  const closePopup = () => {
    setShowPopup(false);
  };
  return (
    <div className="table-container" ref={tableRef}>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Congratulations!</h2>
            <p>You did it! 🎉</p>
            <p>{coins} coins</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
      <div className="table"></div>
      {error && <div className="error-message">{error}</div>}

      {user && (
        <div
          key={user.id}
          className="user-center"
        // onClick={isclick ? () => handleClick(user.id) : null}
        >
          <div className="profile-pic">
            <img src="https://icons.veryicon.com/png/o/system/crm-android-app-icon/app-icon-person.png" alt={`${user.name} profile`} />
          </div>
          <div className="player-info">
            <div className="player-name">{`${user.name} (You)`}</div>
            <div className="player-content">{user.position}</div>
          </div>
        </div>
      )}
      {players.map((player, index) => (
        <div
          key={player.id}
          className="player"
          style={{
            position: 'absolute',
            left: `${positions[index]?.x}px`,
            top: `${positions[index]?.y}px`,
            cursor: isclick ? "pointer" : "default"
          }}
          onClick={isclick ? () => handleClick(player, user) : null}
        >
          <div className="profile-pic">
            <img src="https://icons.veryicon.com/png/o/system/crm-android-app-icon/app-icon-person.png" alt={`${player.name} profile`} />
          </div>
          <div className="player-info">
            <div className="player-name">
              {player.name}
            </div>
            <div className="player-content">
              {player.role ? player.position : player.name === username ? player.position : "******"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StartGame;
