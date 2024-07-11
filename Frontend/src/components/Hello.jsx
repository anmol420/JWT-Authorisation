import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Hello = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div>
            <h1>Hello, {user?.fullname}!</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Hello;