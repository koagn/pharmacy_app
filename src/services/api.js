// File: src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

const api = {
    // TEST CONNECTION
    test: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/test`);
            return await response.json();
        } catch (error) {
            console.error('Test error:', error);
            return { success: false, message: 'Network error' };
        }
    },

    // REGISTER
    register: async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            console.log('Register response:', data);
            return data;
        } catch (error) {
            console.error('Register error:', error);
            return { 
                success: false, 
                message: 'Network error. Could not connect to server.' 
            };
        }
    },

    // LOGIN
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
    }
};

export default api;