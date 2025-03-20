import { API_URL } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: `${API_URL}/auths`,
    headers: { 'Content-Type': 'application/json' }
});

export const signIn = async (email, password) => {
    try {
        const response = await api.post('/signIn', { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const signUp = async (nom, prenom, email, password) => {
    try {
        const response = await api.post('/signUp', { nom, prenom, email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const forgot = async (email) => {
    try {
        const response = await api.post('/forgot', { email });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const verifyCode = async (email, code) => {
    try {
        const response = await api.post('/verifyCode', { email, code });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePassword = async (email, newPassword, code) => {
    try {
        const response = await api.patch('/', { email, newPassword, code });
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const checkAuthStatus = async () => {
    try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) return false;

        // Vérifie si le token est toujours valide avec une requête à ton backend
        const response = await api.get("/checkToken", {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data.valid ? { user: response.data.user, token } : false;
    } catch (error) {
        return false;
    }
};
export default api;
