import axios from "axios"

const axiosInstance = axios.create({
    baseURL: '/api',
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
