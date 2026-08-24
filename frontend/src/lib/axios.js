import axios from "axios"

// Base API URL from VITE_API_URL environment variable, falling back to '/api' for local dev proxy
const envApiUrl = import.meta.env.VITE_API_URL;
const baseURL = envApiUrl 
  ? (envApiUrl.endsWith('/api') ? envApiUrl : `${envApiUrl.replace(/\/$/, '')}/api`) 
  : '/api';

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

