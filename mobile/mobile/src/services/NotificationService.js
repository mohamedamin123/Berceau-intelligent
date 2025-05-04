import axios from 'axios';
import { API_URL } from '@env';
import useAuthStore from '../store/useAuthStore'; // Import du store Zustand

const api = axios.create({
    baseURL: `${API_URL}/notifications`,
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

// 📌 Exemple d'utilisation pour ajouter une notification
export const createNotification = async (notificationData) => {
    try {
        const response = await api.post("/", notificationData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 📌 Exemple d'utilisation pour obtenir toutes les notifications
export const getAllNotifications = async () => {
    try {
        const response = await api.get("/");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 📌 Exemple d'utilisation pour récupérer les notifications par parent ID
export const getNotificationsByParentId = async (parentId) => {
    try {
        const response = await api.get(`/idParent/${parentId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 📌 Exemple d'utilisation pour récupérer les notifications par ID de berceau
export const getNotificationsByBerceauId = async (berceauId) => {
    try {
        const response = await api.get(`/idBerceau/${berceauId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const deleteNotificationsByParentId = async (parentId) => {
    try {
        const response = await api.delete(`/parent/${parentId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const deleteNotificationsByBerceauId = async (berceauId) => {
    try {
        const response = await api.delete(`/berceau/${berceauId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export default api;
