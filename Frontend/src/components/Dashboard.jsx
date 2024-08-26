import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import '../App.css'

const Dashboard = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            setAuth(token);
            const fetchData = async () => {
                try {
                    const response = await axios.get('http://localhost:3000/api/v1/users/dashboard', {
                        headers: { Authorization: token }
                    });
                    setMessage(response.data.message);
                    setMessageType('success');
                    setUser(response.data.data.user);
                } catch (error) {
                    setMessage('Error fetching dashboard data');
                    setMessageType('error');
                }
            };
            fetchData();
        } else {
            setMessage('You are not logged in');
            setMessageType('error');
            navigate('/login');
        }
    }, [auth, setAuth, navigate]);

    return (
        <div className="container">
            {message && <div className={`message ${messageType}`}>{message}</div>}
            {user && <div>Welcome, {user.username}!</div>}
        </div>
    );
};

export default Dashboard;