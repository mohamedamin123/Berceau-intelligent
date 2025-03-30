import axios from 'axios';
import { API_URL } from '@env';
import useAuthStore from '../store/useAuthStore'; // Import du store Zustand

const api = axios.create({
    baseURL: `${API_URL}/dhts`, // Modifier l'URL pour correspondre à l'API DHT
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

// 📌 Sauvegarder les données DHT (température et humidité)
export const saveDHTData = async (berceauId, tmp, hmd) => {
    try {
        const response = await api.post('/', { berceauId, tmp, hmd });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Erreur lors de l\'enregistrement des données DHT');
    }
};

// 📌 Récupérer toutes les données DHT (température et humidité)
export const getDHTData = async (berceauId) => {
    try {
        const response = await api.get(`/${berceauId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des données DHT');
    }
};

// 📌 Récupérer uniquement la température
export const getTmp = async (berceauId) => {
    try {
        const response = await api.get(`/tmp/${berceauId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Erreur lors de la récupération de la température');
    }
};

// 📌 Récupérer uniquement l'humidité
export const getHmd = async (berceauId) => {
    try {
        const response = await api.get(`/hmd/${berceauId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Erreur lors de la récupération de l\'humidité');
    }
};

export default api;
