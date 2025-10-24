import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null, 
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  redirectTarget: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const userData = action.payload;
      state.user = userData;
      // console.log(state.user)
      state.status = 'succeeded'; // Status: Berhasil, user ditemukan

      if (userData) {
        if (userData.role === 'admin') {
          state.redirectTarget = '/admin';
        } else if (userData.role === 'teacher') {
          state.redirectTarget = '/teacher/dashboard';
        } else if (userData.role === 'student') {
          state.redirectTarget = '/student/dashboard';
        } else {
          state.redirectTarget = '/';
        }
      } else {
        state.redirectTarget = null;
      }
    },
    clearAuth: (state) => {
      state.user = null;
      // [PERBAIKAN] Ubah 'idle' menjadi 'failed'. 
      // Ini menandakan "proses otentikasi telah selesai dan gagal menemukan user".
      state.status = 'failed'; 
      state.redirectTarget = null;
    },
    setAuthLoading: (state) => {
      state.status = 'loading'; // Status: Sedang dalam proses
    }
  },
});

export const { setUser, clearAuth, setAuthLoading } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectAuthStatus = (state) => state.auth.status;
export const selectRedirectTarget = (state) => state.auth.redirectTarget;

export default authSlice.reducer;