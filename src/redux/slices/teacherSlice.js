import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../js/services/api'; // Pastikan path ini benar

// Thunk untuk mengambil data guru
export const fetchTeachers = createAsyncThunk('teachers/fetchTeachers', async () => {
  const response = await api.get('/api/teachers');
  return response.data;
});

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const teacherSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {}, // Kita akan handle state di extraReducers
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectAllTeachers = (state) => state.teachers.items;
export const selectTeachersStatus = (state) => state.teachers.status;

export default teacherSlice.reducer;