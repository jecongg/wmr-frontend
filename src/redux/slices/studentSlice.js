import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../js/services/api';

export const fetchStudents = createAsyncThunk('students/fetchStudents', async () => {
  const response = await api.get('/api/admin/list-students');
  return response.data;
});

export const fetchReportHistory = createAsyncThunk('students/fetchReportHistory', async ({ rejectWithValue }) => {
  try {
    const response = await api.get(`/api/records/student/history`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Gagal memuat riwayat laporan');
  }
});


  export const fetchTodaySchedules = createAsyncThunk('students/fetchTodaySchedule',async (_, {rejectWithValue}) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const response = await api.get(`/api/student/schedule?date=${today}`);
        console.log("Schedule response:", response.data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Gagal memuat schedule');
    }
  });


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

export const fetchStudentAttendanceHistory = createAsyncThunk(
  'students/fetchStudentAttendanceHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/attendance/student/history');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal memuat riwayat kehadiran');
    }
  }
);

const initialState = {
  students: [],
  reportHistory: [],
  reportStatus: 'idle',
  attendancesHistory: [],
  attendancesStatus: 'idle',
  studentAttendanceHistory: [],
  studentAttendanceStatus: 'idle',
  schedule: [],
  scheduleStatus: 'idle',
  status: 'idle', 
  error: null,
};

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    addStudent: (state, action) => {
      state.students.push(action.payload);
    },
    updateStudent: (state, action) => {
      const index = state.students.findIndex(student => student.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = { ...state.students[index], ...action.payload };
      }
    },
    updateStudentPhoto: (state, action) => {
      const { id, photo } = action.payload;
      const index = state.students.findIndex(student => student.id === id);
      if (index !== -1) {
        state.students[index].photo = photo;
      }
    },
    removeStudent: (state, action) => {
      state.students = state.students.filter(student => student.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchReportHistory.pending, (state) => {
        state.reportStatus = 'loading';
      })
      .addCase(fetchReportHistory.fulfilled, (state, action) => {
        state.reportStatus = 'succeeded';
        state.reportHistory = action.payload;
      })
      .addCase(fetchReportHistory.rejected, (state, action) => {
        state.reportStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchAttendanceHistory.pending, (state) => {
        state.attendancesStatus = 'loading';
      })
      .addCase(fetchAttendanceHistory.fulfilled, (state, action) => {
        state.attendancesStatus = 'succeeded';
        state.attendancesHistory = action.payload;
      })
      .addCase(fetchAttendanceHistory.rejected, (state, action) => {
        state.attendancesStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchStudentAttendanceHistory.pending, (state) => {
        state.studentAttendanceStatus = 'loading';
      })
      .addCase(fetchStudentAttendanceHistory.fulfilled, (state, action) => {
        state.studentAttendanceStatus = 'succeeded';
        state.studentAttendanceHistory = action.payload;
      })
      .addCase(fetchStudentAttendanceHistory.rejected, (state, action) => {
        state.studentAttendanceStatus = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchTodaySchedules.pending, (state) => {
        state.scheduleStatus = 'loading';
      })
      .addCase(fetchTodaySchedules.fulfilled, (state, action) => {
        state.scheduleStatus = 'succeeded';
        state.schedule = action.payload;
      })
      .addCase(fetchTodaySchedules.rejected, (state, action) => {
        state.scheduleStatus = 'failed';
        state.error = action.payload;
      })
  },
});

export const { addStudent, updateStudent, updateStudentPhoto, removeStudent } = studentSlice.actions;

export const selectAllStudents = (state) => state.students.students;
export const selectStudentsStatus = (state) => state.students.status;
export const selectStudentsError = (state) => state.students.error;
export const selectAllAttendancesHistory = (state) => state.students.attendancesHistory;
export const selectStudentAttendanceHistory = (state) => state.students.studentAttendanceHistory;
export const selectStudentAttendanceStatus = (state) => state.students.studentAttendanceStatus;
export const selectTodaySchedule = (state) => state.students.schedule;
export const selectScheduleStatus = (state) => state.students.scheduleStatus;

export default studentSlice.reducer;

