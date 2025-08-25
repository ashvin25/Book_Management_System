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

// Get all books (public)
export const getPublicBooks = createAsyncThunk(
  'books/getPublic',
  async (params, thunkAPI) => {
    try {
      const { page, limit, search } = params || {};
      let url = `${API_URL}/books/public?`;
      
      if (page) url += `page=${page}&`;
      if (limit) url += `limit=${limit}&`;
      if (search) url += `search=${search}&`;
      
      const response = await axios.get(url);
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

// Get all books (admin)
export const getBooks = createAsyncThunk(
  'books/getAll',
  async (params, thunkAPI) => {
    try {
      const { page, limit, search } = params || {};
      let url = `${API_URL}/books?`;
      
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

// Get book by ID
export const getBookById = createAsyncThunk(
  'books/getById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/books/${id}`, getAuthHeaders());
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

// Create book
export const createBook = createAsyncThunk(
  'books/create',
  async (bookData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/books`,
        bookData,
        {
          ...getAuthHeaders(),
          headers: {
            ...getAuthHeaders().headers,
            'Content-Type': 'multipart/form-data',
          },
        }
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

// Update book
export const updateBook = createAsyncThunk(
  'books/update',
  async ({ id, bookData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API_URL}/books/${id}`,
        bookData,
        {
          ...getAuthHeaders(),
          headers: {
            ...getAuthHeaders().headers,
            'Content-Type': 'multipart/form-data',
          },
        }
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

// Delete book
export const deleteBook = createAsyncThunk(
  'books/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/books/${id}`, getAuthHeaders());
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
  books: [],
  publicBooks: [],
  book: null,
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

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearBook: (state) => {
      state.book = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPublicBooks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPublicBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.publicBooks = action.payload.books;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalBooks
        };
      })
      .addCase(getPublicBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getBooks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.books = action.payload.books;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalBooks
        };
      })
      .addCase(getBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getBookById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBookById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.book = action.payload;
      })
      .addCase(getBookById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.books.push(action.payload);
      })
      .addCase(createBook.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.books = state.books.map(book =>
          book._id === action.payload._id ? action.payload : book
        );
        state.book = action.payload;
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteBook.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.books = state.books.filter(book => book._id !== action.payload);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearBook } = bookSlice.actions;
export default bookSlice.reducer;