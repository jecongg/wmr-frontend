import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../js/services/api';

export const fetchModules = createAsyncThunk('modules/fetchModules', async () => {
  const response = await api.get('/api/modules');
  return response.data;
});

export const fetchStudentModules = createAsyncThunk(
  'modules/fetchStudentModules',
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/modules/student/${studentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal memuat modul');
    }
  }
);

export const createModule = createAsyncThunk(
  'modules/createModule',
  async (moduleData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/modules/teacher/create', moduleData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal menambahkan modul');
    }
  }
);

export const deleteModule = createAsyncThunk(
  'modules/deleteModule',
  async (moduleId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/modules/teacher/delete/${moduleId}`);
      return moduleId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Gagal menghapus modul');
    }
  }
);

const initialState = {
  items: [],
  status: 'idle', 
  error: null,
};

const moduleSlice = createSlice({
  name: 'modules',
  initialState,
  reducers: {
    clearModules: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchModules.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchStudentModules.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudentModules.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchStudentModules.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createModule.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createModule.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.unshift(action.payload);
      })
      .addCase(createModule.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Delete module
      .addCase(deleteModule.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteModule.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      .addCase(deleteModule.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearModules } = moduleSlice.actions;

export const selectAllModules = (state) => state.modules.items;
export const selectModulesStatus = (state) => state.modules.status;
export const selectModulesError = (state) => state.modules.error;

export default moduleSlice.reducer;