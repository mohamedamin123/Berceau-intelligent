import axios from 'axios';
import { API_URL } from '@env';
import useAuthStore from '../store/useAuthStore'; // Import du store Zustand

const api = axios.create({
    baseURL: `${API_URL}/leds`, // Modifier l'URL pour correspondre à l'API LED
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

// 📌 Allumer la LED
export const turnOnLight = async (berceauId) => {
    try {
        const response = await api.post('/on', { berceauId });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Erreur lors de l\'allumage de la LED');
    }
};

// 📌 Éteindre la LED
export const turnOffLight = async (berceauId) => {
    try {
        const response = await api.post('/off', { berceauId });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Erreur lors de l\'extinction de la LED');
    }
};

// 📌 Changer l'intensité de la LED
export const changeLightIntensity = async (berceauId, intensite) => {
    try {
        const response = await api.post('/intensite', { berceauId, intensite });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Erreur lors de la modification de l\'intensité de la LED');
    }
};

// 📌 Récupérer les données (état et intensité) de la LED
export const getLightData = async (berceauId) => {
    try {
        const response = await api.get(`/${berceauId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des données de la LED');
    }
};

export default api;
