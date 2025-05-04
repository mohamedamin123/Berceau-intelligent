import axios from 'axios';
import { API_URL } from '@env';
import useAuthStore from '../store/useAuthStore'; // Import du store Zustand

const api = axios.create({
    baseURL: `${API_URL}/servos`, // Modifier l'URL pour correspondre à l'API DHT
    headers: { 'Content-Type': 'application/json' },
});

// 📌 Utilisation du token depuis Zustand
const getUserToken = () => {
    return useAuthStore.getState().token; // Récupère le token depuis Zustand
};

// 📌 Ajout automatique du token dans toutes les requêtes
api.interceptors.request.use(
    (config) => {
        const token = getUserToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 📌 Récupérer toutes les données 
export const getData = async (berceauId) => {
    try {
        const response = await api.get(`/${berceauId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des données DHT');
    }
};

// 📌 Activer la servo
export const on = async (berceauId) => {
    try {
        const response = await api.post(`/on/${berceauId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Erreur lors de l'activation de la servo");
    }
};

// 📌 Désactiver la servo
export const off = async (berceauId) => {
    try {
        const response = await api.post(`/off/${berceauId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Erreur lors de la désactivation de la servo");
    }
};

// 📌 Changer le mode de la servo
export const changeMode = async (berceauId) => {
    try {
        const response = await api.post(`/changeMode/${berceauId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Erreur lors du changement de mode");
    }
};

export default api;
