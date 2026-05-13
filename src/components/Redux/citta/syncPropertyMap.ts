import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import Cookies from 'js-cookie';
import api from '../middleware';

// ============ TYPES ============
export interface SyncPropertyMapResponse {
  success: boolean;
  message: string;
}

export interface SyncPropertyMapState {
  syncing: boolean;
  error: string | null;
  successMessage: string | null;
}

// ============ API CONFIGURATION ============
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ============ ASYNC THUNK ============
export const syncPropertyMap = createAsyncThunk<
  SyncPropertyMapResponse,
  void,
  { rejectValue: { message: string } }
>(
  'syncPropertyMap/sync',
  async (_, { rejectWithValue }) => {
    try {
    
      const response = await api.get<SyncPropertyMapResponse>(
        `${BASE_URL}/api/admin/sync-property-map`,
        {},
  
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        Cookies.remove('token');
        return rejectWithValue({
          message: 'Session expired. Please login again.',
        });
      }
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to sync property map',
      });
    }
  }
);

// ============ INITIAL STATE ============
const initialState: SyncPropertyMapState = {
  syncing: false,
  error: null,
  successMessage: null,
};

// ============ SLICE ============
const syncPropertyMapSlice = createSlice({
  name: 'syncPropertyMap',
  initialState,
  reducers: {
    clearSyncError: (state) => {
      state.error = null;
    },
    clearSyncSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncPropertyMap.pending, (state) => {
        state.syncing = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(syncPropertyMap.fulfilled, (state, action: PayloadAction<SyncPropertyMapResponse>) => {
        state.syncing = false;
        if (action.payload?.success) {
          state.successMessage = action.payload.message || 'Property map synced successfully';
        } else {
          state.error = action.payload?.message || 'Sync failed';
        }
      })
      .addCase(syncPropertyMap.rejected, (state, action) => {
        state.syncing = false;
        state.error = action.payload?.message || 'Failed to sync property map';
      });
  },
});

export const { clearSyncError, clearSyncSuccess } = syncPropertyMapSlice.actions;

export const selectSyncPropertyMapSyncing = (state: { syncPropertyMap: SyncPropertyMapState }) =>
  state.syncPropertyMap.syncing;

export const selectSyncPropertyMapError = (state: { syncPropertyMap: SyncPropertyMapState }) =>
  state.syncPropertyMap.error;

export const selectSyncPropertyMapSuccess = (state: { syncPropertyMap: SyncPropertyMapState }) =>
  state.syncPropertyMap.successMessage;

export default syncPropertyMapSlice.reducer;