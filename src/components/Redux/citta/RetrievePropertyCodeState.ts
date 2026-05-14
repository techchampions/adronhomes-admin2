import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import Cookies from 'js-cookie';
import api from '../middleware';

// ============ TYPES ============
export interface RetrievePropertyCodeResponse {
  success: boolean;
  data: {
    id: number;
    code: string;
    size: string;
  };
}

export interface RetrievePropertyCodeState {
  currentProperty: { id: number; code: string; size: string } | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

// ============ API CONFIGURATION ============
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ============ ASYNC THUNK ============
export const retrievePropertyCode = createAsyncThunk<
  RetrievePropertyCodeResponse,
  string, // size parameter (e.g., "400sqm")
  { rejectValue: { message: string } }
>(
  'retrievePropertyCode/fetch',
  async (size, { rejectWithValue }) => {
    try {
   
      const response = await api.get<RetrievePropertyCodeResponse>(
        `${BASE_URL}/api/admin/retrieve-property-code/${encodeURIComponent(size)}`,
     
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        Cookies.remove('token');
        return rejectWithValue({
          message: 'Session expired. Please login again.',
        });
      }
      if (error.response?.status === 404) {
        return rejectWithValue({
          message: `No property found for size: ${size}`,
        });
      }
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to retrieve property code',
      });
    }
  }
);

// ============ INITIAL STATE ============
const initialState: RetrievePropertyCodeState = {
  currentProperty: null,
  loading: false,
  error: null,
  successMessage: null,
};

// ============ SLICE ============
const retrievePropertyCodeSlice = createSlice({
  name: 'retrievePropertyCode',
  initialState,
  reducers: {
    clearRetrieveError: (state) => {
      state.error = null;
    },
    clearRetrieveSuccess: (state) => {
      state.successMessage = null;
    },
    clearCurrentProperty: (state) => {
      state.currentProperty = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(retrievePropertyCode.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(retrievePropertyCode.fulfilled, (state, action: PayloadAction<RetrievePropertyCodeResponse>) => {
        state.loading = false;
        if (action.payload?.success && action.payload.data) {
          state.currentProperty = action.payload.data;
          state.successMessage = 'Property code retrieved successfully';
        } else {
          state.error = 'Invalid response format';
        }
      })
      .addCase(retrievePropertyCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to retrieve property code';
        state.currentProperty = null;
      });
  },
});

export const { clearRetrieveError, clearRetrieveSuccess, clearCurrentProperty } = retrievePropertyCodeSlice.actions;

export const selectCurrentProperty = (state: { retrievePropertyCode: RetrievePropertyCodeState }) =>
  state.retrievePropertyCode.currentProperty;

export const selectRetrievePropertyCodeLoading = (state: { retrievePropertyCode: RetrievePropertyCodeState }) =>
  state.retrievePropertyCode.loading;

export const selectRetrievePropertyCodeError = (state: { retrievePropertyCode: RetrievePropertyCodeState }) =>
  state.retrievePropertyCode.error;

export const selectRetrievePropertyCodeSuccess = (state: { retrievePropertyCode: RetrievePropertyCodeState }) =>
  state.retrievePropertyCode.successMessage;

export default retrievePropertyCodeSlice.reducer;