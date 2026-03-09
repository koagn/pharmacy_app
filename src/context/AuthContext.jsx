// File: src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);

    // Login function - stores in memory only (NO localStorage)
    const login = (userData, authToken) => {
        console.log('Login context: setting user', userData);
        setUser(userData);
        setToken(authToken);
        setLoading(false);
    };

    // Register function
    const register = (userData, authToken) => {
        console.log('Register context: setting user', userData);
        setUser(userData);
        setToken(authToken);
        setLoading(false);
    };

    // Logout function
    const logout = () => {
        console.log('Logout context: clearing user');
        setUser(null);
        setToken(null);
    };

    const value = {
        user,
        token,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isPharmacist: user?.role === 'pharmacist',
        isPatient: user?.role === 'patient'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};