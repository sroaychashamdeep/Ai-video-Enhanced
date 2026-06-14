import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const uploadVideo = async (file, quality, onUploadProgress) => {
  const formData = new FormData();
  formData.append('video', file);
  formData.append('quality', quality);

  try {
    const response = await axiosClient.post('/video/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Upload failed');
  }
};

export const getHistory = async () => {
  try {
    const response = await axiosClient.get('/video/history');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch history');
  }
};

export default axiosClient;
