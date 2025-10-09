import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../js/services/api';

const RegisterTeacher = () => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromUrl = new URLSearchParams(location.search).get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      setError('');
    } else {
      setError('Tautan pendaftaran tidak valid atau token tidak ditemukan.');
    }
  }, [location]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password minimal harus 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/api/auth/complete-registration', {
        registrationToken: token,
        authProvider: 'email',
        password: password,
      });
      setSuccess(`${response.data.message} Anda akan diarahkan secara otomatis.`);
      setTimeout(() => navigate('/login'), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat pendaftaran.');
    } finally {
      setIsLoading(false);
    }
  };

  if ((!token && !error) || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Memproses...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Selesaikan Pendaftaran Anda</h2>
          <p className="mt-2 text-sm text-gray-600">Buat kata sandi untuk akun Anda.</p>
        </div>
        
        {error && <div className="p-3 text-sm font-medium text-red-800 bg-red-100 rounded-lg text-center">{error}</div>}
        {success && <div className="p-3 text-sm font-medium text-green-800 bg-green-100 rounded-lg text-center">{success}</div>}
        
        {!success && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Buat Kata Sandi Baru"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Konfirmasi Kata Sandi"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan & Selesaikan Pendaftaran'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegisterTeacher;