import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';
axios.defaults.withCredentials = true;

export const useAnalyticsStore = create((set) => ({
    analytics: null,
    isLoading: false,
    lastSync: null,

    fetchAnalytics: async (range = 'Last 7 Days') => {
        // Keep existing analytics data while loading to avoid UI flickering
        set({ isLoading: true });
        try {
            const response = await axios.get(`${API_URL}/analytics?range=${encodeURIComponent(range)}`);
            set({ 
                analytics: response.data.analytics, 
                isLoading: false,
                lastSync: new Date()
            });
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            set({ isLoading: false });
        }
    }
}));
