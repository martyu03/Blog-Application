// context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('Stored token:', token);  // Log to check if the token is present
        
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log('Decoded token:', decoded); // Log the decoded token to verify its content
                
                const currentTime = Date.now() / 1000;  // Get current time in seconds
                if (decoded.exp < currentTime) {
                    // Token has expired
                    console.error('Token has expired');
                    localStorage.removeItem('token');
                    setUser(null);  // Reset user state
                } else {
                    setUser(decoded); // Set user with decoded token
                }
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
