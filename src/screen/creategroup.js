import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, set, ref, get } from 'firebase/database';
import app from '../firebase/connection';

const db = getDatabase(app);

const CreateGroup = () => {
    const navigate = useNavigate();
    const [groupId, setGroupId] = useState(null);
    const [isCreated, setIscreated] = useState(false);
    const [users, setUsers] = useState([]);
    const username = localStorage.getItem('username');

    const createGroupId = () => {
        const randomId = Math.floor(100000 + Math.random() * 900000);
        setGroupId(randomId);
        setIscreated(true);
        set(ref(db, `RajaRaniGame/${new Date().toISOString().split('T')[0]}/G${randomId.toString()}`), {
            username: {
                name: username,
                position: null,
                action: 0,
                role: 0
            }
        });
    }
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
                                action: shuffledRoles[index]==="Raja",
                                role: shuffledRoles[index]==="Raja",
                                id:index
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
            navigate(`/Group/${groupId}/${username}`);
        } else {
            alert("Please generate a group ID first.");
        }
    };


    return (
        <div>
            <style>
                {`
                    div {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        height: 100vh;
                        background-color: #f0f4f7;
                        font-family: Arial, sans-serif;
                    }

                    h1, h2 {
                        color: #333;
                    }

                    button {
                        padding: 10px 20px;
                        margin: 10px;
                        background-color: #4caf50;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                    }

                    button:hover {
                        background-color: #45a049;
                    }

                    button:disabled {
                        background-color: #ccc;
                        cursor: not-allowed;
                    }

                    ul {
                        list-style-type: none;
                        padding: 0;
                        margin-top: 20px;
                    }

                    li {
                        background-color: #f9f9f9;
                        padding: 10px;
                        margin: 5px;
                        border-radius: 5px;
                        border: 1px solid #ddd;
                        width: 300px;
                        text-align: center;
                    }
                `}
            </style>

            <h1>Group Id: {groupId ? groupId : "No ID generated"}</h1>
            <button onClick={createGroupId} disabled={isCreated}>Generate Group Id</button>
            <h2>Users in Group:</h2>
            {users.length > 0 ? (
                <ul>
                    {users.map((user, index) => (
                        <li key={index}>{user.name}</li>
                    ))}
                </ul>
            ) : (
                <p>No users in this group yet.</p>
            )}

            <button onClick={handleCreateGroup} disabled={!groupId}>Start Match</button>
        </div>
    );
};

export default CreateGroup;
