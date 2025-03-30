import axios from 'axios';
import { API_URL } from '@env';
import useAuthStore from '../store/useAuthStore'; // Import du store Zustand

const api = axios.create({
    baseURL: `${API_URL}/ventilateurs`, // Modifier l'URL pour correspondre à l'API
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

// 📌 Récupérer les données du ventilateur
export const getData = async (berceauId) => {
    try {
        const response = await api.get(`/${berceauId}`);
        return response.data; // { mode: "auto" } ou { mode: "manuel" }
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Erreur lors de la récupération des données');
    }
};

// 📌 Activer le ventilateur
export const on = async (berceauId) => {
    try {
        await api.post(`/on/${berceauId}`);
    } catch (error) {
        throw new Error(error.response?.data?.error || "Erreur lors de l'activation du ventilateur");
    }
};

// 📌 Désactiver le ventilateur
export const off = async (berceauId) => {
    try {
        await api.post(`/off/${berceauId}`);
    } catch (error) {
        throw new Error(error.response?.data?.error || "Erreur lors de la désactivation du ventilateur");
    }
};

// 📌 Changer le mode du ventilateur
export const changeMode = async (berceauId, newMode) => {
    try {
        const response = await api.post(`/changeMode/${berceauId}`, { mode: newMode });
        return response.data; // { mode: "auto" } ou { mode: "manuel" }
    } catch (error) {
        throw new Error(error.response?.data?.error || "Erreur lors du changement de mode");
    }
};

export default api;
