import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../js/services/api';

export const fetchAnnouncements = createAsyncThunk('announcements/fetchAnnouncements', async () => {
  const response = await api.get('/api/announcements');
  return response.data;
});

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const announcementSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    addAnnouncement: (state, action) => {
        state.items.unshift(action.payload); // unshift untuk menambah di awal array
    },
    removeAnnouncement: (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload); // action.payload adalah id
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addAnnouncement, removeAnnouncement } = announcementSlice.actions;

export const selectAllAnnouncements = (state) => state.announcements.items;
export const selectAnnouncementsStatus = (state) => state.announcements.status;

export default announcementSlice.reducer;