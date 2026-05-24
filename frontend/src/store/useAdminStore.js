import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';

const API_URL = '/admin';

export const useAdminStore = create(
    persist(
        (set) => ({
            users: [],
            stats: {
                totalUsers: 0,
                activeUsers: 0,
                totalInterviews: 0,
                successRate: '0%',
                growthData: [],
                topicData: [],
                sectorData: [],
                recentActivities: []
            },
            isLoading: false,

            fetchUsers: async () => {
                set({ isLoading: true });
                try {
                    const [usersRes, statsRes] = await Promise.all([
                        axiosInstance.get(`${API_URL}/users`),
                        axiosInstance.get(`${API_URL}/stats`)
                    ]);
                    set({ 
                        users: usersRes.data.users, 
                        stats: statsRes.data.stats,
                        isLoading: false 
                    });
                } catch (error) {
                    set({ isLoading: false });
                    toast.error(error.response?.data?.message || 'Failed to fetch admin data');
                }
            },

            fetchStats: async () => {
                set({ isLoading: true });
                try {
                    const response = await axiosInstance.get(`${API_URL}/stats`);
                    set({ stats: response.data.stats, isLoading: false });
                } catch (error) {
                    console.error('Failed to fetch admin stats:', error);
                    set({ isLoading: false });
                }
            },

            updateUserStatus: async (userId, status) => {
                try {
                    await axiosInstance.put(`${API_URL}/users/${userId}/status`, { status });
                    set((state) => ({
                        users: state.users.map(u => u.id === userId ? { ...u, status } : u)
                    }));
                    toast.success(`User ${status.toLowerCase()} successfully`);
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Failed to update user status');
                }
            },

            deleteUser: async (userId) => {
                try {
                    await axiosInstance.delete(`${API_URL}/users/${userId}`);
                    set((state) => ({
                        users: state.users.filter(u => u.id !== userId)
                    }));
                    toast.success('User deleted successfully');
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Failed to delete user');
                }
            },

            provisionUser: async (userData) => {
                try {
                    await axiosInstance.post(`${API_URL}/provision`, userData);
                    toast.success('User provisioned successfully');
                    // Refresh data
                    const [usersRes, statsRes] = await Promise.all([
                        axiosInstance.get(`${API_URL}/users`),
                        axiosInstance.get(`${API_URL}/stats`)
                    ]);
                    set({ 
                        users: usersRes.data.users, 
                        stats: statsRes.data.stats 
                    });
                    return true;
                } catch (error) {
                    toast.error(error.response?.data?.message || 'Provisioning failed');
                    return false;
                }
            }
        }),
        {
            name: 'admin-hub-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
