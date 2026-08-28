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

api.interceptors.response.use(
    // proceed with the 2xx responses
    (response) => {
    return response;
    },
    (error: AxiosError) => {

        const isAuthRoute = error.config?.url?.includes("/auth/");
        // handle 401 unauthorized errors
        if (error.response?.status === 401 && !isAuthRoute) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            // redirect to the login page
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;