import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../js/services/api';

export const fetchTeacherAssignments = createAsyncThunk(
  'assignments/fetchTeacherAssignments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/assignments/teacher/me');
    //   console.log(response.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal memuat daftar murid');
    }
  }
);

export const fetchStudentAssignments = createAsyncThunk(
  'assignments/fetchStudentAssignments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/assignments/student/me');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal memuat daftar guru');
    }
  }
);

export const createAssignment = createAsyncThunk(
  'assignments/createAssignment',
  async (assignmentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/admin/assign', assignmentData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal membuat assignment');
    }
  }
);

export const updateAssignment = createAsyncThunk(
  'assignments/updateAssignment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/admin/assign/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal mengupdate assignment');
    }
  }
);

// Delete assignment
export const deleteAssignment = createAsyncThunk(
  'assignments/deleteAssignment',
  async (assignmentId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/admin/assign/${assignmentId}`);
      return assignmentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal menghapus assignment');
    }
  }
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    clearAssignments: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
    addAssignmentOptimistic: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateAssignmentOptimistic: (state, action) => {
      const index = state.items.findIndex(item => item.assignmentId === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.data };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch teacher assignments
      .addCase(fetchTeacherAssignments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTeacherAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTeacherAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Fetch student assignments
      .addCase(fetchStudentAssignments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudentAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchStudentAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create assignment
      .addCase(createAssignment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.unshift(action.payload);
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update assignment
      .addCase(updateAssignment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(item => item.assignmentId === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Delete assignment
      .addCase(deleteAssignment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(item => item.assignmentId !== action.payload);
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { 
  clearAssignments, 
  addAssignmentOptimistic, 
  updateAssignmentOptimistic 
} = assignmentSlice.actions;

export const selectAllAssignments = (state) => state.assignments.items;
export const selectAssignmentsStatus = (state) => state.assignments.status;
export const selectAssignmentsError = (state) => state.assignments.error;

export default assignmentSlice.reducer;
