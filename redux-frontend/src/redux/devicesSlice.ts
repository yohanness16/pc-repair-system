import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';

// Thunk for fetching devices from the API
export const fetchDevices = createAsyncThunk('devices/fetchDevices', async () => {
  const response = await apiClient.get('/equipment/show/');
  return response.data;
});

const devicesSlice = createSlice({
  name: 'devices',
  initialState: {
    allDevices: [], // The master list from the API
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // We can add reducers for filters here later if needed
  },
  // extraReducers handle actions generated outside the slice (like our thunk)
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allDevices = action.payload; // Set the fetched devices
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default devicesSlice.reducer;