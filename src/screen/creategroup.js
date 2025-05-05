import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, set, ref, get } from 'firebase/database';
import app from '../firebase/connection';
import styles from '../style/CreateGroup.module.css';
import navStyles from '../style/nav.module.css';
import { auth } from '../firebase/connection';
import { signOut } from 'firebase/auth';

const db = getDatabase(app);

const CreateGroup = () => {

    const [showDropdown, setShowDropdown] = useState(false);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();
    const [groupId, setGroupId] = useState(null);
    const [isCreated, setIscreated] = useState(false);
    const [users, setUsers] = useState([]);
    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('username');
            navigate('/signin');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };
    const createGroupId = () => {
        const randomId = Math.floor(100000 + Math.random() * 900000);
        setGroupId(randomId);
        setIscreated(true);
        set(ref(db, `RajaRaniGame/${new Date().toISOString().split('T')[0]}/G${randomId.toString()}`), {
            [username]: {
                name: username,
                position: null,
                action: 0,
                role: 0
            }
        });
    };

    useEffect(() => {
        let intervalId;
        if (groupId && isCreated) {
            const fetchUsers = () => {
                get(ref(db, `RajaRaniGame/${new Date().toISOString().split('T')[0]}/G${groupId}`))
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            const data = snapshot.val();
                            const usersArray = data ? Object.values(data) : [];
                            setUsers(usersArray);
                        } else {
                            alert("No data found for this group.");
                            setUsers([]);
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                    });
            };
            fetchUsers();
            intervalId = setInterval(fetchUsers, 5000);
        }
        return () => clearInterval(intervalId);
    }, [groupId, isCreated]);

    const gameRole = {
        4: ["Raja", "Rani", "Police", "Thief"],
        5: ["Raja", "Rani", "Ministry", "Police", "Thief"],
        6: ["Raja", "Rani", "Ministry", "Police", "Thief1", "Thief2"],
        7: ["Raja", "Rani", "Ministry", "Police", "Thief1", "Thief2", "Thief3"]
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const handleCreateGroup = () => {
        if (groupId) {
            get(ref(db, `RajaRaniGame/${new Date().toISOString().split('T')[0]}/G${groupId}`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const usersArray = data ? Object.values(data) : [];
                        setUsers(usersArray);

                        const userCount = usersArray.length;
                        const roles = gameRole[userCount];

                        if (roles) {
                            const shuffledRoles = shuffleArray([...roles]);
                            const updatedUsers = users.map((user, index) => ({
                                ...user,
                                position: shuffledRoles[index],
                                action: shuffledRoles[index] === "Raja",
                                role: shuffledRoles[index] === "Raja",
                                id: index
                            }));
                            set(ref(db, `RajaRaniGame/${new Date().toISOString().split('T')[0]}/G${groupId.toString()}`), {
                                ...updatedUsers
                            });
                        } else {
                            alert("Invalid number of users for this game.");
                        }
                    } else {
                        alert("No data found for this group.");
                        setUsers([]);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
            if (users.length < 4) {
                alert("Minimum 4 players required");
            } else if (users.length > 7) {
                alert("Maximum 7 players can play");
            } else {
                navigate(`/Group/${groupId}/${username}`);
            }
        } else {
            alert("Please generate a group ID first.");
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
                <h1 className={styles.title}>Group Id: {groupId ? groupId : "No ID generated"}</h1>
                <button className={styles.button} onClick={createGroupId} disabled={isCreated}>Generate Group Id</button>
                <h2 className={styles.subtitle}>Users in Group:</h2>
                {users.length > 0 ? (
                    <ul className={styles.userList}>
                        {users.map((user, index) => (
                            <li key={index} className={styles.userItem}>{user.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No users in this group yet.</p>
                )}
                <button className={styles.button} onClick={handleCreateGroup} disabled={!groupId}>Start Match</button>
            </div>
        </>
    );
};

export default CreateGroup;
