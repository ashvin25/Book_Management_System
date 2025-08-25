import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import authorReducer from './slices/authorSlice';
import bookReducer from './slices/bookSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    authors: authorReducer,
    books: bookReducer,
  },
});