import axiosInstance from './axiosInstance';

export const getDashboardStats = async () => {
    return await axiosInstance.get('/admin/stats');
};

export const getAllIssues = async () => {
    return await axiosInstance.get('/issues');
};

export const updateIssueStatus = async (id, status) => {
    return await axiosInstance.put(`/issues/${id}/status`, { status });
};

export const assignIssueToDept = async (id, departmentId) => {
    return await axiosInstance.put(`/issues/${id}/assign`, { departmentId });
};

export const getIssueDetails = async (id) => {
    return await axiosInstance.get(`/issues/${id}`);
};

export const getDepartments = async () => {
    return await axiosInstance.get('/admin/departments');
};
