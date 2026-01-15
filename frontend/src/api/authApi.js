import axiosInstance from './axiosInstance';

export const signup = async (userData) => {
    return await axiosInstance.post('/auth/signup', userData);
};

export const login = async (credentials) => {
    return await axiosInstance.post('/auth/login', credentials);
};

export const logout = async () => {
    return await axiosInstance.post('/auth/logout');
};
