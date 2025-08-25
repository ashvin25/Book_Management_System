import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getAuthHeaders = () => {
  const admin = JSON.parse(localStorage.getItem('admin'));
  
  if (admin && admin.token) {
    return {
      headers: {
        Authorization: `Bearer ${admin.token}`,
      },
    };
  }
  
  return {};
};

// Get all authors
export const getAuthors = createAsyncThunk(
  'authors/getAll',
  async (params, thunkAPI) => {
    try {
      const { page, limit, search } = params || {};
      let url = `${API_URL}/authors?`;
      
      if (page) url += `page=${page}&`;
      if (limit) url += `limit=${limit}&`;
      if (search) url += `search=${search}&`;
      
      const response = await axios.get(url, getAuthHeaders());
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

// Get author by ID
export const getAuthorById = createAsyncThunk(
  'authors/getById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/authors/${id}`, getAuthHeaders());
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

// Create author
export const createAuthor = createAsyncThunk(
  'authors/create',
  async (authorData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/authors`,
        authorData,
        getAuthHeaders()
      );
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

// Update author
export const updateAuthor = createAsyncThunk(
  'authors/update',
  async ({ id, authorData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API_URL}/authors/${id}`,
        authorData,
        getAuthHeaders()
      );
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

// Delete author
export const deleteAuthor = createAsyncThunk(
  'authors/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/authors/${id}`, getAuthHeaders());
      return id;
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

const initialState = {
  authors: [],
  author: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  }
};

const authorSlice = createSlice({
  name: 'authors',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearAuthor: (state) => {
      state.author = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAuthors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAuthors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.authors = action.payload.authors;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalAuthors
        };
      })
      .addCase(getAuthors.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAuthorById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAuthorById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.author = action.payload;
      })
      .addCase(getAuthorById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createAuthor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAuthor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.authors.push(action.payload);
      })
      .addCase(createAuthor.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateAuthor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAuthor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.authors = state.authors.map(author =>
          author._id === action.payload._id ? action.payload : author
        );
        state.author = action.payload;
      })
      .addCase(updateAuthor.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteAuthor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAuthor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.authors = state.authors.filter(author => author._id !== action.payload);
      })
      .addCase(deleteAuthor.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearAuthor } = authorSlice.actions;
export default authorSlice.reducer;