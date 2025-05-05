import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../style/CreateGroupOrJoinGroup.module.css';

const CreateGroupOrJoinGroup = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            navigate('/signin');
        }
    }, [navigate]);

    const handleCreateGroup = () => {
        navigate('/CreateGroup');
    };

    const handleJoinGroup = () => {
        navigate('/JoinGroup');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Raja Rani Game</h1>
            <h2 className={styles.heading}>Choose an Option</h2>
            <button className={styles.button} onClick={handleCreateGroup}>Create Group</button>
            <p>or</p>
            <button className={styles.button} onClick={handleJoinGroup}>Join Group</button>
            {/* <p>or</p>
            <button className={styles.button} onClick={handleJoinGroup}>Auto Play</button> */}
        </div>
    );
};

export default CreateGroupOrJoinGroup;
