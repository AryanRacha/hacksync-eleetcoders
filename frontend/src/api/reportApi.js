import axiosInstance from './axiosInstance';

export const createIssue = async (formData) => {
    return await axiosInstance.post('/issues', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getUserReports = async () => {
    return await axiosInstance.get('/reports/user');
};

export const getAllIssues = async () => {
    return await axiosInstance.get('/issues');
};
