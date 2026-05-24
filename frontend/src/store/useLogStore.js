import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';
axios.defaults.withCredentials = true;

export const useLogStore = create((set) => ({
    logs: [],
    stats: { critical: 0, warnings: 0, stability: '100%' },
    isLoading: false,

    fetchLogs: async (filters = {}) => {
        set({ isLoading: true });
        try {
            const { severity = 'All', type = 'All', search = '' } = filters;
            const query = `severity=${severity}&type=${type}&search=${search}`;
            const response = await axios.get(`${API_URL}/logs?${query}`);
            set({ logs: response.data.logs, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch logs:', error);
            set({ isLoading: false });
        }
    },

    fetchLogStats: async () => {
        try {
            const response = await axios.get(`${API_URL}/logs/stats`);
            set({ stats: response.data.stats });
        } catch (error) {
            console.error('Failed to fetch log stats:', error);
        }
    }
}));
