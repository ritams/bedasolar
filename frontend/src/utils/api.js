import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const uploadPDF = (file) => {
  const formData = new FormData();
  formData.append('pdf', file);
  return api.post('/upload', formData);
};

export const submitForm = (data) => api.post('/submit', data);

export const submitUserInfo = (data) => api.post('/userinfo', data);

export const sendEmail = (data) => api.post('/send-email', data);

export default api; 