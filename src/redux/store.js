import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import teacherReducer from './slices/teacherSlice';
import studentReducer from './slices/studentSlice';
import announcementReducer from './slices/announcementSlice';
import moduleReducer from './slices/moduleSlice';
import rescheduleReducer from './slices/rescheduleSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    teachers: teacherReducer,
    students: studentReducer,
    announcements: announcementReducer, // Baru
    modules: moduleReducer,             // Baru
    reschedule: rescheduleReducer,      // Baru
  },
});