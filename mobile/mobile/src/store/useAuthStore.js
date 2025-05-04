import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: null, // NULL pendant le chargement initial

    login: async (userData) => {
        await AsyncStorage.setItem("userToken", userData.token); // Stocke le token
        set({ user: userData.user, token: userData.token, isAuthenticated: true });
    },

    logout: async () => {
        await AsyncStorage.removeItem("userToken"); // Supprime le token
        set({ user: null, token: null, isAuthenticated: false });
    },

    checkAuthStatus: async () => {
        try {
            const token = await AsyncStorage.getItem("userToken");
            set({ isAuthenticated: token ? true : false });
        } catch (error) {
            set({ isAuthenticated: false });
        }
    }
}));

export default useAuthStore;
