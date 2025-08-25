import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Login admin
export const login = createAsyncThunk(
  'auth/login',
  async (adminData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/admin/login`, adminData);
      
      if (response.data) {
        localStorage.setItem('admin', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      const message = (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) || error.message || error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout admin
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('admin');
});

// Get stored admin from localStorage
const admin = JSON.parse(localStorage.getItem('admin'));

const initialState = {
  admin: admin ? admin : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.admin = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.admin = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.admin = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;