import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const loginAPI = (data) => API.post('/auth/login', data);
export const registerAPI = (data) => API.post('/auth/register', data);
export const getMeAPI = () => API.get('/auth/me');

// Student Complaints API
export const createComplaintAPI = (formData) =>
  API.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getMyComplaintsAPI = () => API.get('/complaints/my');
export const getComplaintAPI = (id) => API.get(`/complaints/${id}`);

// Admin API
export const getAdminComplaintsAPI = (params) => API.get('/admin/complaints', { params });
export const getAdminComplaintAPI = (id) => API.get(`/admin/complaints/${id}`);
export const updateComplaintStatusAPI = (id, data) => API.patch(`/admin/complaints/${id}/status`, data);
export const getAdminStatsAPI = () => API.get('/admin/stats');

export default API;
