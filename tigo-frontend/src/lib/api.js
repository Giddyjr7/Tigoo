import axios from 'axios';
import { authClient } from './auth-client';

export const api = axios.create({
    baseURL: 'http://localhost:8081',
    withCredentials: true
});

// Interceptor to attach the Bearer token dynamically
api.interceptors.request.use(async (config) => {
    try {
        const sessionResult = await authClient.getSession();
        const token = sessionResult?.data?.session?.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (err) {
        console.error('Failed to get session for api request:', err);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
