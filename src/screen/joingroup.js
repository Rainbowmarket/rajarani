import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, set, ref, get } from 'firebase/database';
import app from '../firebase/connection';
import styles from '../style/JoinGroup.module.css';
import navStyles from '../style/nav.module.css';
import { auth } from '../firebase/connection';
import { signOut } from 'firebase/auth';

const db = getDatabase(app);

const JoinGroup = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const [groupId, setGroupId] = useState("");
    const [users, setUsers] = useState([]);
    const [isJoined, setIsJoined] = useState(false);
    const username = localStorage.getItem('username');

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
        <>
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
        </>
    );
};

export default JoinGroup;
