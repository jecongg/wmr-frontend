import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../js/services/api';

export const fetchModules = createAsyncThunk('modules/fetchModules', async () => {
  const response = await api.get('/api/modules');
  return response.data;
});

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const moduleSlice = createSlice({
  name: 'modules',
  initialState,
  reducers: {
    addModule: (state, action) => {
      state.items.unshift(action.payload);
    },
    removeModule: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
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
      });
  },
});

export const { addModule, removeModule } = moduleSlice.actions;

export const selectAllModules = (state) => state.modules.items;
export const selectModulesStatus = (state) => state.modules.status;

export default moduleSlice.reducer;