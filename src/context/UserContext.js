// context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded); // Set user with decoded token
            } catch (error) {
                console.error('Failed to decode token:', error);
                setUser(null); // Reset user if token is invalid
            }
        } else {
            setUser(null); // Ensure user is null if no token
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null); // Reset user state on logout
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
