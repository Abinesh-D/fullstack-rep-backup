// LoginPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // For navigation after successful login

const LoginPage = () => {
    // Local state for the form inputs
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // React Router's useNavigate hook to navigate after successful login
    const navigate = useNavigate();

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Simple validation
        if (!username || !password) {
            setError('Both username and password are required.');
            return;
        }

        // Example authentication logic (this should be replaced with real API call)
        if (username === 'admin' && password === 'password123') {
            // Navigate to the dashboard after successful login
            navigate('/dashboard');
        } else {
            // Show error message for failed login
            setError('Invalid username or password.');
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Login Page</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="username" style={styles.label}>Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="password" style={styles.label}>Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        style={styles.input}
                    />
                </div>
                {error && <p style={styles.errorMessage}>{error}</p>}
                <div>
                    <button type="submit" style={styles.button}>Login</button>
                </div>
            </form>
        </div>
    );
};

// Inline styles
const styles = {
    container: {
        width: '300px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    },
    header: {
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
    },
    input: {
        width: '100%',
        padding: '8px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        width: '100%',
        padding: '10px',
        fontSize: '14px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    buttonHover: {
        backgroundColor: '#45a049',
    },
    errorMessage: {
        color: 'red',
        fontSize: '12px',
        textAlign: 'center',
    },
};

export default LoginPage;
