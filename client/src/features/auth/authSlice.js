import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ── Async Thunks ───────────────────────────────────────────────────────────────

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      // Persist user+token to localStorage so auth survives page refresh
      localStorage.setItem('user', JSON.stringify(data.data));
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('user', JSON.stringify(data.data));
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// ── Slice ──────────────────────────────────────────────────────────────────────

// Rehydrate user from localStorage on app load
const userFromStorage = JSON.parse(localStorage.getItem('user') || 'null');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('user');
      state.user = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.user = action.payload;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      .addCase(registerUser.pending,   handlePending)
      .addCase(registerUser.fulfilled, handleFulfilled)
      .addCase(registerUser.rejected,  handleRejected)
      .addCase(loginUser.pending,      handlePending)
      .addCase(loginUser.fulfilled,    handleFulfilled)
      .addCase(loginUser.rejected,     handleRejected);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;