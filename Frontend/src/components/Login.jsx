import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Login = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate();

    const loginDetails = {
        username: username,
        password: password
    };

    useEffect(() => {
        if (auth) {
            setMessage('You are already logged in');
            setMessageType('success');
        }
    }, [auth]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/v1/users/login', loginDetails);
            const token = response.data.data.token;
            setAuth(token);
            localStorage.setItem('token', token);
            navigate('/dashboard');
        } catch (error) {
            setMessage('Invalid credentials');
            setMessageType('error');
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            {message && <div className={`message ${messageType}`}>{message}</div>}
            {!auth && (
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit">Login</button>
                </form>
            )}
        </div>
    );
};

export default Login;