import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pharmacy, setPharmacy] = useState(null); // Add pharmacy state

    // Check for saved user on app start
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (savedToken && savedUser) {
            const userData = JSON.parse(savedUser);
            setToken(savedToken);
            setUser(userData);
            
            // If user is pharmacist, fetch their pharmacy
            if (userData.role === 'pharmacist' && userData.pharmacy_id) {
                fetchPharmacyData(userData.pharmacy_id);
            }
        }
    }, []);

    // Fetch pharmacy data for pharmacist
    const fetchPharmacyData = async (pharmacyId) => {
        try {
            const response = await api.getPharmacyById(pharmacyId);
            if (response.success && response.pharmacy) {
                setPharmacy(response.pharmacy);
            }
        } catch (error) {
            console.error('Error fetching pharmacy:', error);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await api.login(email, password);
            
            if (response.success) {
                // Save to localStorage
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                
                setUser(response.user);
                setToken(response.token);
                
                // If user is pharmacist and has pharmacy, set it
                if (response.user.role === 'pharmacist' && response.user.pharmacy) {
                    setPharmacy(response.user.pharmacy);
                }
                
                return { success: true, user: response.user };
            } else {
                return { success: false, error: response.message };
            }
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const response = await api.register(userData);
            return response;
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    // Set auth data after successful registration/login
    const setAuthData = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', authToken);
        
        // If user is pharmacist with pharmacy, fetch pharmacy data
        if (userData.role === 'pharmacist' && userData.pharmacy_id) {
            fetchPharmacyData(userData.pharmacy_id);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        setPharmacy(null);
    };

    const value = {
        user,
        token,
        pharmacy,
        login,
        register,
        setAuthData,
        logout,
        loading,
        isAuthenticated: !!user,
        isPharmacist: user?.role === 'pharmacist',
        isPatient: user?.role === 'patient',
        refreshPharmacy: () => user?.pharmacy_id && fetchPharmacyData(user.pharmacy_id)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};