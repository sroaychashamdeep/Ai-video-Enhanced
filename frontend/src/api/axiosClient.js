import axios from 'axios';

const axiosClient = axios.create({
  baseURL: '/api',
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const uploadVideo = async (file, quality, moduleId = 'enhance') => {
  const formData = new FormData();
  formData.append('video', file);
  formData.append('quality', quality);
  formData.append('moduleId', moduleId);

  try {
    const response = await axiosClient.post('/video/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Upload failed');
  }
};

export const analyzeVideo = async (file) => {
  const formData = new FormData();
  formData.append('video', file);

  try {
    const response = await axiosClient.post('/video/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Analysis failed');
  }
};

export const getJobStatus = async (jobId) => {
  try {
    const response = await axiosClient.get(`/video/status/${jobId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch job status');
  }
};

export const getHistory = async () => {
  try {
    const response = await axiosClient.get('/video/history');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getStats = async () => {
  try {
    const response = await axiosClient.get('/video/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default axiosClient;
