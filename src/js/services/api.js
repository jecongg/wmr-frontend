import axios from 'axios';
import { auth } from '../../../firebase'; // Pastikan path ke file firebase.js Anda benar

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- INTERCEPTOR OTOMATIS ---
// Kode ini akan "mencegat" setiap request sebelum dikirim
// dan secara otomatis menambahkan token otentikasi jika user sudah login.
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      // Dapatkan ID Token JWT yang aktif dari Firebase SDK
      const token = await user.getIdToken();
      // Lampirkan token ke header Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;