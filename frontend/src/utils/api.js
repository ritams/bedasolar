import axios from 'axios';

const api = axios.create({
  baseURL: '/', // Use proxy instead of direct backend URL
  withCredentials: true, // Include cookies for authentication
});

// Authentication API calls
export const getCurrentUser = () => api.get('/auth/user');
export const logout = () => api.get('/auth/logout');

// Existing API calls
export const uploadPDF = (file) => {
  const formData = new FormData();
  formData.append('pdf', file);
  return api.post('/api/upload', formData);
};

export const submitForm = (data) => api.post('/api/submit', data);

export const submitUserInfo = (data) => api.post('/api/userinfo', data);

export const sendEmail = (data) => api.post('/api/send-email', data);

export default api; 