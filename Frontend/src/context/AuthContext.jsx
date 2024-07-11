import React, { createContext, useState, useEffect } from "react";
import axios from "../axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                const { data } = await axios.post("/refresh-token");
                setUser(data.user);
            } catch (error) {
                console.log(error);
            }
        };
        checkLoggedIn();
    }, []);

    const login = async (credentials) => {
        const { data } = await axios.post("/login", credentials);
        setUser(data.user);
    };

    const register = async (userData) => {
        const { data } = await axios.post("/register", userData);
        setUser(data.user);
    };

    const logout = async () => {
        await axios.post("/logout");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };