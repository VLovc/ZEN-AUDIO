// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:5000/api', // Trỏ thẳng về cổng Backend
    timeout: 10000,                       // Hủy request nếu server không phản hồi sau 10 giây
    headers: {
        'Content-Type': 'application/json',
    }
});

// Tự động kiểm tra và chèn JWT Token vào Header của mọi yêu cầu gửi đi
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;