import axios from "axios"

// Base API URL logic:
// 1. Use VITE_API_URL if explicitly provided
// 2. If on localhost, use '/api' for Vite dev proxy
// 3. Otherwise default to live Render backend URL
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const envApiUrl = import.meta.env.VITE_API_URL;
const fallbackUrl = isLocalhost ? '/api' : 'https://ai-interview-preparation-platform-514b.onrender.com/api';
const rawUrl = envApiUrl || fallbackUrl;
const baseURL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl.replace(/\/$/, '')}/api`;

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true, // send cookies with requests
})

axiosInstance.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance

