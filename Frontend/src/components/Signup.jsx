import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Signup = () => {
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const navigate = useNavigate();

    const details = {
        username: username,
        fullname: fullname,
        email: email,
        password: password
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/v1/users/register', details);
            navigate('/login')
        } catch (error) {
            setMessage('Error creating user');
            setMessageType('error');
        }
    };

    return (
        <div className="container">
            <h2>Create Account</h2>
            {message && <div className={`message ${messageType}`}>{message}</div>}
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="text" placeholder="Fullname" onChange={(e) => setFullname(e.target.value)} />
            <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSignup}>Create Account</button>
        </div>
    );
};

export default Signup;