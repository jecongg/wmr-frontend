import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../js/services/api';

export const fetchStudents = createAsyncThunk('students/fetchStudents', async () => {
  const response = await api.get('http://localhost:3000/api/admin/list-students');
  return response.data;
});

const initialState = {
  students: [],
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
        state.students[index] = action.payload;
      }
    },
    removeStudent: (state, action) => {
      state.items = state.students.filter(student => student.id !== action.payload);
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
      });
  },
});

export const { addStudent, updateStudent, removeStudent } = studentSlice.actions;

export const selectAllStudents = (state) => state.students.students;
export const selectStudentsStatus = (state) => state.students.status;
export const selectStudentsError = (state) => state.students.error;

export default studentSlice.reducer;

