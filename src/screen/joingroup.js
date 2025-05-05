import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, set, ref, get } from 'firebase/database';
import app from '../firebase/connection';
import styles from '../style/JoinGroup.module.css';

const db = getDatabase(app);

const JoinGroup = () => {
    const navigate = useNavigate();
    const [groupId, setGroupId] = useState("");
    const [users, setUsers] = useState([]);
    const [isJoined, setIsJoined] = useState(false);
    const username = localStorage.getItem('username');

    useEffect(() => {
        let intervalId;
        if (groupId && isJoined) {
            const fetchUsers = () => {
                const today = new Date().toISOString().split('T')[0];
                get(ref(db, `RajaRaniGame/${today}/G${groupId}`))
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            const data = snapshot.val();
                            setUsers(Object.values(data));
                        } else {
                            alert("No data found for this group.");
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                    });
            };
            fetchUsers();
            intervalId = setInterval(fetchUsers, 5000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [groupId, isJoined]);

    const joinGroup = () => {
        if (groupId) {
            const today = new Date().toISOString().split('T')[0];
            const groupRef = ref(db, `RajaRaniGame/${today}/G${groupId}`);
            get(groupRef)
                .then((snapshot) => {
                    const currentData = snapshot.exists() ? snapshot.val() : {};
                    currentData[username] = {
                        name: username,
                        position: null,
                        action: 0,
                        role: 0,
                    };
                    return set(groupRef, currentData);
                })
                .then(() => {
                    setIsJoined(true);
                    return get(ref(db, `RajaRaniGame/${today}/G${groupId}`));
                })
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        setUsers(Object.values(data));
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

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Enter Group ID to Join:</h1>
            <input
                type="text"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                placeholder="Enter Group ID"
                className={styles.input}
            />
            <button
                onClick={joinGroup}
                className={`${styles.button} ${isJoined ? styles.buttonDisabled : ''}`}
                disabled={isJoined}
            >
                Join Group
            </button>

            <h2 className={styles.header}>Users in Group:</h2>
            {users.length > 0 ? (
                <ul className={styles.ul}>
                    {users.map((user, index) => (
                        <li key={index} className={styles.li}>{user.name}</li>
                    ))}
                </ul>
            ) : (
                <p>No users in this group yet.</p>
            )}

            <button
                onClick={handleStartGame}
                className={`${styles.button} ${!isJoined ? styles.buttonDisabled : ''}`}
                disabled={!isJoined}
            >
                Start Match
            </button>
        </div>
    );
};

export default JoinGroup;
