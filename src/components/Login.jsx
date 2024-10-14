import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import { userData } from '../data/UserData'; 

const Login = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
    }); // Store user credentials
    const [isAdmin, setIsAdmin] = useState(false); // Toggle for admin login
    const [error, setError] = useState(''); // Handle login errors
    const navigate = useNavigate(); // Hook to programmatically navigate

    // Handle input changes and reset error message
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
        setError('');
    };

    // Handle form submission and validate credentials
    const handleSubmit = (e) => {
        e.preventDefault();
        const { username, password } = credentials;

        let user;

        // Admin login validation
        if (isAdmin) {
            user = userData.find(
                (user) => user.username === username && user.password === password && user.role === 'admin'
            );

            if (user) {
                onLogin(`${user.firstname} ${user.lastname}`, 'admin'); // Trigger login for admin
            } else {
                setError('Invalid admin credentials');
                return;
            }
        } else {
            // Student login validation
            user = userData.find(
                (user) => user.username === username && user.password === password && user.role === 'student'
            );

            if (user) {
                onLogin(`${user.firstname} ${user.lastname}`, 'student'); // Trigger login for student
            } else {
                setError('Invalid credentials');
                return;
            }
        }

        // Save login info in localStorage
        localStorage.setItem('currentUsername', username);
        localStorage.setItem('userRole', isAdmin ? 'admin' : 'student');
        navigate('/dashboard'); // Navigate to dashboard after successful login
    };

    // Toggle between admin and student login
    const toggleAdmin = () => {
        setIsAdmin(!isAdmin);
        setCredentials({ username: '', password: '' });
        setError('');
    };

    return (
        <div className="login-container">
            <h2>{isAdmin ? 'Admin Login' : 'Student Login'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        placeholder="Username"
                        value={credentials.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        placeholder="Password"
                        type="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <div className="login-options">
                    <input
                        type="checkbox"
                        id="admin"
                        checked={isAdmin}
                        onChange={toggleAdmin}
                    />
                    <label htmlFor="admin">Login as Admin</label>
                </div>
                <button type="submit" className="login-button">Login</button>
                <p>
                    Don't have an account? <a href="/sign-up">Register</a>
                </p>
            </form>
        </div>
    );
};

export default Login;
