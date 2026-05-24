import axios from "axios"

const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : '/api',
    withCredentials: true, // send cookies with requests
})

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance
