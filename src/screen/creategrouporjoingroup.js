import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateGroupOrJoinGroup = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            navigate('/signin'); // Redirect to sign-in page if username is not found
        }
    }, [navigate]);

    const handleCreateGroup = () => {
        navigate('/CreateGroup');
    };

    const handleJoinGroup = () => {
        navigate('/JoinGroup');
    };

    const buttonStyle = {
        padding: '10px 20px',
        margin: '10px',
        fontSize: '16px',
        backgroundColor: '#4caf50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f4f7',
    };

    const headingStyle = {
        marginBottom: '20px',
    };

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>Raja Rani Game</h1>
            <h2 style={headingStyle}>Choose an Option</h2>
            <button style={buttonStyle} onClick={handleCreateGroup}>Create Group</button>
            <p>or</p>
            <button style={buttonStyle} onClick={handleJoinGroup}>Join Group</button>
            {/* <p>or</p>
            <button style={buttonStyle} onClick={handleJoinGroup}>Auto Play</button> */}
        </div>
    );
};

export default CreateGroupOrJoinGroup;
