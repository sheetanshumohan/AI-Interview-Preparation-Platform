import { create } from 'zustand';
import axiosInstance from '../lib/axios';

const API_URL = '/admin';

export const useLogStore = create((set) => ({
    logs: [],
    stats: { critical: 0, warnings: 0, stability: '100%' },
    isLoading: false,

    fetchLogs: async (filters = {}) => {
        set({ isLoading: true });
        try {
            const { severity = 'All', type = 'All', search = '' } = filters;
            const query = `severity=${severity}&type=${type}&search=${search}`;
            const response = await axiosInstance.get(`${API_URL}/logs?${query}`);
            set({ logs: response.data.logs, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch logs:', error);
            set({ isLoading: false });
        }
    },

    fetchLogStats: async () => {
        try {
            const response = await axiosInstance.get(`${API_URL}/logs/stats`);
            set({ stats: response.data.stats });
        } catch (error) {
            console.error('Failed to fetch log stats:', error);
        }
    }
}));
