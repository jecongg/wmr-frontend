import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../js/services/api';

export const fetchAnnouncements = createAsyncThunk('announcements/fetchAnnouncements', async ({ page = 1, limit = 5 } = {}) => {
  const response = await api.get(`/api/announcements?page=${page}&limit=${limit}`);
  return response.data;
});

export const addAnnouncement = createAsyncThunk('announcements/addAnnouncement', async (newData, {getState}) => {
  const state = getState();
  const userId = state.auth.user.id;

  const data = {
    ...newData,
    userId,
  };

  const response = await api.post(`/api/announcements`, data);
  return response.data;
});

export const deleteAnnouncement = createAsyncThunk('announcements/deleteAnnouncement', async(id) => {
  await api.delete(`/api/announcements/${id}`);
  return ;
})

const initialState = {
  items: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 5
  },
  status: 'idle',
  error: null,
};

const announcementSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    // addAnnouncement: (state, action) => {
    //     state.items.unshift(action.payload);
    // },
    // removeAnnouncement: (state, action) => {
    //     state.items = state.items.filter(item => item._id !== action.payload); 
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.announcements;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addAnnouncement.fulfilled, (state, action) => {
        state.items.unshift(action.payload.data);
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.meta.arg); 
      })
      .addCase(deleteAnnouncement.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(addAnnouncement.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

// export const { addAnnouncement, removeAnnouncement } = announcementSlice.actions;

export const selectAllAnnouncements = (state) => state.announcements.items;
export const selectAnnouncementsStatus = (state) => state.announcements.status;
export const selectAnnouncementsPagination = (state) => state.announcements.pagination;

export default announcementSlice.reducer;