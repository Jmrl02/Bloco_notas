import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            if (username === 'user' && password === 'password') {
                console.log('Login successful');
                // Redirect to another route
                navigate('/register');
            } else {
                setError('Invalid credentials');
            }
        } catch (error) {
            setError('Error while attempting to log in');
        }
    };

    const navigateToRegister = () => {
        // Redirect to the registration page
        navigate('/register');
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <button className="btn btn-primary me-3" onClick={handleLogin}>
                Login
            </button>
            <button className="btn btn-secondary" onClick={navigateToRegister}>
                Register
            </button>
            {error && <p className="mt-3 text-danger">{error}</p>}
        </div>
    );
}

export default Login;
