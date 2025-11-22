import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../js/services/api';

export const fetchAttendanceHistory = createAsyncThunk(
  'attendance/fetchHistory',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/teacher/student/${studentId}/attendances`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal memuat riwayat kehadiran');
    }
  }
);

export const fetchScheduleforToday = createAsyncThunk('attendance/fetchscheduleForToday', async(_, { rejectWithValue }) => {
    try{
        const today = new Date().toISOString().split('T')[0];
        const response = await api.get(`/api/teacher/schedule?date=${today}`);
        console.log("Schedule response:", response.data);
        return response.data; 
    }catch(err){
        return rejectWithValue(err.response?.data?.message || 'Gagal memuat jadwal hari ini');
    }
}) 

export const createAttendance = createAsyncThunk(
  'attendance/create',
  async (attendanceData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/teacher/attendance/create', attendanceData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal menyimpan laporan');
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    schedule : [],
    attendances: [],
    status: 'idle',
    scheduleStatus: 'idle',
    error: null,
  },
  reducers: {
    clearAttendances: (state) => {
      state.attendances = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendanceHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAttendanceHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.attendances = action.payload;
      })
      .addCase(fetchAttendanceHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createAttendance.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createAttendance.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.attendances.unshift(action.payload); 
      })
      .addCase(createAttendance.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchScheduleforToday.pending, (state) => {
        state.scheduleStatus = 'loading';
      })
      .addCase(fetchScheduleforToday.fulfilled, (state, action) => {
        state.scheduleStatus = 'succeeded';
        state.schedule = action.payload;
        console.log("Updated schedule:", action.payload);
      })
      .addCase(fetchScheduleforToday.rejected, (state, action) => {
        state.scheduleStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearAttendances } = attendanceSlice.actions;

export const selectAllAttendances = (state) => state.attendance.attendances;
export const selectAttendanceStatus = (state) => state.attendance.status;
export const selectScheduleStatus = (state) => state.attendance.scheduleStatus;
export const selectAttendanceError = (state) => state.attendance.error;
export const selectTodaySchedule = (state) => state.attendance.schedule;

export default attendanceSlice.reducer;
