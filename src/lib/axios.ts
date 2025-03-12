import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// const axiosInstanceforTTS = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_TTS_URL,
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//   }
// });

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // Check if response has status field and it's false
    if (response.data && response.data.status === false) {
      const message = response.data.message || 'Operation failed';
      toast.error(message);
      return Promise.reject(new Error(message));
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      Cookies.remove('token'); // Remove token from cookies
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error);
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    // Handle API errors
    const errorMessage = error.response?.data?.message || 'Something went wrong';
    toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export default axiosInstance; 