import axios from 'axios';
import { auth } from '../../../firebase';
import { signOut } from 'firebase/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor - Tambahkan token ke setiap request
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle 401 Unauthorized
let isLoggingOut = false;

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && (error.response.status === 401 || 
        (error.response.status === 403 && error.response.data?.message?.includes('session')))) {
      
      if (!isLoggingOut) {
        isLoggingOut = true;
        
        console.warn('Session expired or unauthorized. Logging out...');
        
        try {
          await api.post('/api/auth/logout').catch(() => {
          });
          
          await signOut(auth);
          
          window.location.href = '/login';
        } catch (logoutError) {
          console.error('Error during auto-logout:', logoutError);
          window.location.href = '/login';
        } finally {
          setTimeout(() => {
            isLoggingOut = false;
          }, 1000);
        }
      }
      
      return Promise.reject(error);
    }

    // Untuk error lainnya, kembalikan seperti biasa
    return Promise.reject(error);
  }
);

export default api;