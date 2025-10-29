import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../js/services/api';

// Thunk untuk guru
export const fetchTeacherRequests = createAsyncThunk('reschedule/fetchTeacherRequests', async () => {
  const response = await api.get('/api/reschedule/teacher/requests');
  return response.data;
});

// Thunk untuk murid
export const fetchStudentRequests = createAsyncThunk('reschedule/fetchStudentRequests', async () => {
  const response = await api.get('/api/reschedule/student/history');
  return response.data;
});

const initialState = {
  items: [], // Akan berisi permintaan untuk guru atau riwayat untuk murid
  status: 'idle',
  error: null,
};

const rescheduleSlice = createSlice({
  name: 'reschedule',
  initialState,
  reducers: {
    // Aksi untuk update item di state secara lokal setelah guru merespons
    updateRequestStatus: (state, action) => {
        const { requestId, status } = action.payload;
        state.items = state.items.filter(item => item._id !== requestId); // Hapus dari daftar 'pending'
    },
  },
  extraReducers: (builder) => {
    builder
      // Cases untuk Guru
      .addCase(fetchTeacherRequests.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchTeacherRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTeacherRequests.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; })
      // Cases untuk Murid
      .addCase(fetchStudentRequests.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchStudentRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchStudentRequests.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; });
  },
});

export const { updateRequestStatus } = rescheduleSlice.actions;

export const selectRescheduleItems = (state) => state.reschedule.items;
export const selectRescheduleStatus = (state) => state.reschedule.status;

export default rescheduleSlice.reducer;