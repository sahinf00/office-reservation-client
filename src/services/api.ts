import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";


const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
    "Content-Type": "application/json",
    },
});

// request interceptor to add the JWT token to the Authorization header
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("token"); // TODO: replace with secure storage mechanism
        // if both token and config header exist, add the token to the Authorization header
        if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config; // send the updated request config to the backend
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

export default api;