import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ── Async Thunks ───────────────────────────────────────────────────────────────

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/tasks', { params: filters });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const fetchTaskStats = createAsyncThunk(
  'tasks/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/tasks/stats');
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/tasks', taskData);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, updates);
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${id}`);
      return id; // Return id so we can remove it from state
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete task');
    }
  }
);

// ── Slice ──────────────────────────────────────────────────────────────────────

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [],
    stats: { todo: 0, 'in-progress': 0, completed: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    clearTaskError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchTasks.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchTasks.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })
      // Stats
      .addCase(fetchTaskStats.fulfilled, (state, action) => { state.stats = action.payload; })
      // Create — prepend to list for instant UI feedback
      .addCase(createTask.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      // Update — find and replace in place
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.items.findIndex(t => t._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // Delete — filter out the removed task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t._id !== action.payload);
      });
  },
});

export const { clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;