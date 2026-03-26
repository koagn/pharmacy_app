// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

const api = {
    // Helper to get token from localStorage
    getToken: () => {
        const token = localStorage.getItem('token');
        return token;
    },
    
    getHeaders: () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    },

    // ========== AUTHENTICATION ==========
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            console.log('Login response:', data);
            return data;
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                message: 'Network error. Could not connect to server.' 
            };
        }
    },

    register: async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            return await response.json();
        } catch (error) {
            console.error('Register error:', error);
            return { 
                success: false, 
                message: 'Network error. Could not connect to server.' 
            };
        }
    },

    // ========== PHARMACY ENDPOINTS ==========
    
    // Get all pharmacies (public)
    getAllPharmacies: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/pharmacies`);
            return await response.json();
        } catch (error) {
            console.error('Get pharmacies error:', error);
            return { success: false, pharmacies: [] };
        }
    },

    // Get single pharmacy by ID
    getPharmacyById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/pharmacies/${id}`);
            return await response.json();
        } catch (error) {
            console.error('Get pharmacy error:', error);
            return { success: false };
        }
    },

    // Get pharmacy for a specific user (pharmacist)
    getPharmacyByUserId: async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/pharmacies/user/${userId}`, {
                headers: api.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Get user pharmacy error:', error);
            return { success: false, pharmacy: null };
        }
    },

    // Create a new pharmacy (only for pharmacists)
    createPharmacy: async (pharmacyData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/pharmacies`, {
                method: 'POST',
                headers: api.getHeaders(),
                body: JSON.stringify(pharmacyData)
            });
            return await response.json();
        } catch (error) {
            console.error('Create pharmacy error:', error);
            return { success: false, message: 'Network error' };
        }
    },

    // Update pharmacy (only for owner pharmacist)
    updatePharmacy: async (id, pharmacyData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/pharmacies/${id}`, {
                method: 'PUT',
                headers: api.getHeaders(),
                body: JSON.stringify(pharmacyData)
            });
            return await response.json();
        } catch (error) {
            console.error('Update pharmacy error:', error);
            return { success: false, message: 'Network error' };
        }
    },

    // Get pharmacy inventory
    getPharmacyInventory: async (pharmacyId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/pharmacies/${pharmacyId}/inventory`, {
                headers: api.getHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('Get inventory error:', error);
            return { success: false, inventory: [] };
        }
    }
};

export default api;