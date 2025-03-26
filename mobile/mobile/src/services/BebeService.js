import axios from 'axios';
import { API_URL } from '@env';
import useAuthStore from '../store/useAuthStore'; // Import du store Zustand

const api = axios.create({
    baseURL: `${API_URL}/bebes`,
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
export const createBebe = async (bebeData) => {
    try {
        const response = await api.post("/", bebeData);
        return response.data;
    } catch (error) {
        throw error.message;
    }
};

// 📌 Exemple d'utilisation pour mettre à jour un bébé
export const updateBebe = async (bebeId, updateData) => {
    try {
        const response = await api.patch(`/${bebeId}`, updateData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 📌 Exemple d'utilisation pour obtenir un bébé par ID
export const getBebeById = async (bebeId) => {
    try {
        const response = await api.get(`/${bebeId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 📌 Exemple d'utilisation pour obtenir tous les bébés
export const getAllBebes = async () => {
    try {
        const response = await api.get("/");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 📌 Exemple d'utilisation pour supprimer un bébé
export const deleteBebe = async (bebeId) => {
    try {
        const response = await api.delete(`/${bebeId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 📌 Exemple d'utilisation pour récupérer les bébés par parent ID
export const getBebesByParentId = async (parentId) => {
    try {
        const response = await api.get(`/parent/${parentId}`);
        console.log(response)
        return response.data;
    } catch (error) {
        throw error;
    }
};

// 📌 Exemple d'utilisation pour récupérer un bébé par ID de berceau
export const getBebeByBerceauId = async (berceauId) => {
    try {
        const response = await api.get(`/berceau/${berceauId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default api;
