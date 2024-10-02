import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, set, ref, get } from 'firebase/database';
import app from './firebase/connection';

const db = getDatabase(app);

const OvelTable = () => {
  const navigate = useNavigate();
  const [groupId, setGroupId] = useState("");
  const [users, setUsers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const username = localStorage.getItem('username');

  // Fetch users whenever the groupId changes
  useEffect(() => {
    let intervalId; // Declare an interval ID to clear later

    if (groupId && isJoined) {
      const fetchUsers = () => {
        const today = new Date().toISOString().split('T')[0];
        get(ref(db, `RajaRaniGame/${today}/G${groupId}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              if (data) {
                setUsers(Object.values(data)); // Convert to array
              } else {
                alert("No users found in this group.");
                setUsers([]);
              }
            } else {
              alert("No data found for this group.");
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      };

      fetchUsers(); // Initial fetch
      intervalId = setInterval(fetchUsers, 5000); // Fetch every 5 seconds

    }

    // Cleanup function to clear the interval when component unmounts or dependencies change
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [groupId, isJoined]);

  const joinGroup = () => {
    if (groupId) {
      const today = new Date().toISOString().split('T')[0];
      const groupRef = ref(db, `RajaRaniGame/${today}/G${groupId}`);
      get(groupRef)
        .then((snapshot) => {
          const currentData = snapshot.exists() ? {} : {};
          currentData["Naveen"] = {
            name: "Naveen",
            position: "Raja",
            action: 0,
            role: 0,
          };
          currentData["Geetha"] = {
            name: "Geetha",
            position: null,
            action: 0,
            role: 0,
          };
          currentData["Dhivya"] = {
            name: "Dhivya",
            position: null,
            action: 0,
            role: 0,
          }; 
          currentData["Santhi"] = {
            name: "Santhi",
            position: null,
            action: 0,
            role: 0,
          };
          return set(groupRef, currentData);
        })
        .then(() => {
          setIsJoined(true);
          // Fetch users again after joining
          return get(ref(db, `RajaRaniGame/${today}/G${groupId}`));
        })
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUsers(Object.values(data.users || {})); // Update user state
          }
        })
        .catch((error) => {
          console.error("Error joining group:", error);
        });
    } else {
      alert("Please enter a valid Group ID.");
    }
  };


  const handleStartGame = () => {
    if (groupId) {
      navigate(`/Group/${groupId}/${username}`);
    } else {
      alert("Please enter a group ID first.");
    }
  };

  // Inner styles for the component
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f0f4f7',
      fontFamily: 'Arial, sans-serif',
    },
    input: {
      padding: '10px',
      width: '300px',
      marginBottom: '15px',
      border: '2px solid #ccc',
      borderRadius: '5px',
      fontSize: '16px',
    },
    button: {
      padding: '10px 20px',
      margin: '10px',
      backgroundColor: '#4caf50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
    ul: {
      listStyleType: 'none',
      padding: 0,
      marginTop: '20px',
    },
    li: {
      backgroundColor: '#f9f9f9',
      padding: '10px',
      margin: '5px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      width: '300px',
      textAlign: 'center',
    },
    header: {
      color: '#333',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Enter Group ID to Join:</h1>
      <input
        type="text"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
        placeholder="Enter Group ID"
        style={styles.input}
      />
      <button
        onClick={joinGroup}
        style={{ ...styles.button, ...(isJoined ? styles.buttonDisabled : {}) }}
        disabled={isJoined}
      >
        Join Group
      </button>

      <h2 style={styles.header}>Users in Group:</h2>
      {users.length > 0 ? (
        <ul style={styles.ul}>
          {users.map((user, index) => (
            <li key={index} style={styles.li}>{user.name}</li>
          ))}
        </ul>
      ) : (
        <p>No users in this group yet.</p>
      )}

      <button
        onClick={handleStartGame}
        style={{ ...styles.button, ...(!isJoined ? styles.buttonDisabled : {}) }}
        disabled={!isJoined}
      >
        Start Match
      </button>
    </div>
  );
};

export default OvelTable;
