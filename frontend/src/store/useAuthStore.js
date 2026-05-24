import { create } from "zustand";
import axios from "../lib/axios";

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axios.get("/auth/check-auth");
            set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
        } catch (error) {
            localStorage.removeItem('token');
            set({ isCheckingAuth: false, isAuthenticated: false });
        }
    },

    signup: async (name, email, password, role, experience) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post("/auth/signup", { name, email, password, role, experience });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error signing up", isLoading: false });
            throw error;
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post("/auth/login", { email, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            set({
                user: response.data.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            set({ error: error.response.data.message || "Error logging in", isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axios.post("/auth/logout");
            localStorage.removeItem('token');
            set({ user: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
            set({ error: "Error logging out", isLoading: false });
        }
    },
}));
