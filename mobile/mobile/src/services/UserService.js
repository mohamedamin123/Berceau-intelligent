import axios from 'axios';
import { API_URL } from '@env';
import useAuthStore from '../store/useAuthStore'; // Import du store Zustand

const api = axios.create({
    baseURL: `${API_URL}/users`,
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
// 📌 Exemple d'utilisation pour récupérer un utilisateur
export const getUser = async (userId) => {
    return api.get(`/${userId}`);
};

// 📌 Exemple d'utilisation pour mettre à jour un utilisateur
export const updateUser = async (userId, userData) => {
    console.log(userId);
    console.log(userData);

    return api.patch(`/${userId}`, userData);
};

// 📌 Exemple d'utilisation pour récupérer tous les utilisateurs
export const getAllUsers = async () => {
    return api.get("/");
};

// 📌 Récupérer un utilisateur par email
export const getUserByEmail = async (email) => {
    return api.get(`/email/${email}`);
};


export default api;
