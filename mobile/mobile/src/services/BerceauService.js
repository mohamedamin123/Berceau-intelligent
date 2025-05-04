import axios from 'axios';
import { API_URL } from '@env';
import useAuthStore from '../store/useAuthStore'; // Import du store Zustand

const api = axios.create({
    baseURL: `${API_URL}/berceaux`,
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

// 📌 Exemple d'utilisation pour créer un bébé
export const createBerceau = async (BerceauData) => {
    try {
        const response = await api.post("/", BerceauData);
        return response.data;
    } catch (error) {
        throw error.message;
    }
};

// 📌 Exemple d'utilisation pour mettre à jour un bébé
export const updateBerceau = async (BerceauId, updateData) => {
    try {
        const response = await api.patch(`/${BerceauId}`, updateData);
        return response.data;
    } catch (error) {
        throw error.message;
    }
};

// 📌 Exemple d'utilisation pour obtenir un bébé par ID
export const getBerceauById = async (BerceauId) => {
    try {
        const response = await api.get(`/${BerceauId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 📌 Exemple d'utilisation pour obtenir tous les bébés
export const getAllBerceaus = async () => {
    try {
        const response = await api.get("/");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 📌 Exemple d'utilisation pour supprimer un bébé
export const deleteBerceau = async (BerceauId) => {
    try {
        const response = await api.delete(`/${BerceauId}`);
        return response.data;
    } catch (error) {
        throw error.message;
    }
};

// 📌 Exemple d'utilisation pour récupérer les bébés par parent ID
export const getBerceausByParentId = async (id) => {
    try {
        const response = await api.get(`/parent/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 📌 Exemple d'utilisation pour récupérer un bébé par ID de berceau
export const getBerceauByBebeId = async (bebeId) => {
    try {
        const response = await api.get(`/bebe/${bebeId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default api;
