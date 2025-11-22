import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../js/services/api';

export const fetchTeachers = createAsyncThunk('teachers/fetchTeachers', async () => {
  const response = await api.get('/api/admin/list-teachers');
  return response.data;
});

export const fetchStudents = createAsyncThunk('teachers/assign/me', async() => {
  const response = await api.get('/api/assignments/teacher/me');
  return response.data;
})

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const teacherSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    addTeacher: (state, action) => {
      state.items.push(action.payload);
    },
    updateTeacher: (state, action) => {
      const index = state.items.findIndex(teacher => teacher.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeTeacher: (state, action) => {
      state.items = state.items.filter(teacher => teacher.id !== action.payload);
    },
  },
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

export const { addTeacher, updateTeacher, removeTeacher } = teacherSlice.actions;

export const selectAllTeachers = (state) => state.teachers.items;
export const selectTeachersStatus = (state) => state.teachers.status;
export const selectTeachersError = (state) => state.teachers.error;

export default teacherSlice.reducer;