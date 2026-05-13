import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import Cookies from 'js-cookie';
import api from '../middleware';

// ============ TYPES ============
export interface CittaEstate {
  pCode: string;
  pName: string;
}

export interface CittaEstatesResponse {
  success: boolean;
  data: CittaEstate[];
}

export interface ErrorResponse {
  message: string;
}

export interface CittaEstatesState {
  estates: CittaEstate[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// ============ API CONFIGURATION ============
// const BASE_URL = process.env.REACT_APP_API_URL || 'https://adron.microf10.sg-host.com';

// ============ ASYNC THUNK ============
export const fetchCittaEstates = createAsyncThunk<
  CittaEstatesResponse,
  void, // No parameters needed for this endpoint
  { rejectValue: ErrorResponse }
>(
  'cittaEstates/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
     
      const response = await api.get<CittaEstatesResponse>(
        `${BASE_URL}/api/admin/citta-estates`,

      );
      return response.data;
    } catch (error: any) {
      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        Cookies.remove('token');
        return rejectWithValue({
          message: 'Session expired. Please login again.',
        });
      }
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch Citta estates',
      });
    }
  }
);

// ============ INITIAL STATE ============
const initialState: CittaEstatesState = {
  estates: [],
  loading: false,
  error: null,
  successMessage: null,
};

// ============ SLICE ============
const cittaEstatesSlice = createSlice({
  name: 'cittaEstates',
  initialState,
  reducers: {
    clearCittaEstatesError: (state) => {
      state.error = null;
    },
    clearCittaEstatesSuccess: (state) => {
      state.successMessage = null;
    },
    clearCittaEstates: (state) => {
      state.estates = [];
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // PENDING
      .addCase(fetchCittaEstates.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      // FULFILLED
      .addCase(fetchCittaEstates.fulfilled, (state, action: PayloadAction<CittaEstatesResponse>) => {
        state.loading = false;
        
        if (action.payload?.success && Array.isArray(action.payload.data)) {
          state.estates = action.payload.data;
          state.successMessage = 'Citta estates loaded successfully';
        } else {
          state.estates = [];
          state.error = 'Invalid response format from server';
        }
      })
      // REJECTED
      .addCase(fetchCittaEstates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch Citta estates';
      });
  },
});

// ============ ACTIONS ============
export const { 
  clearCittaEstatesError,
  clearCittaEstatesSuccess,
  clearCittaEstates
} = cittaEstatesSlice.actions;

// ============ SELECTORS ============
export const selectAllCittaEstates = (state: { cittaEstates: CittaEstatesState }) => 
  state.cittaEstates.estates;

export const selectCittaEstatesLoading = (state: { cittaEstates: CittaEstatesState }) => 
  state.cittaEstates.loading;

export const selectCittaEstatesError = (state: { cittaEstates: CittaEstatesState }) => 
  state.cittaEstates.error;

export const selectCittaEstatesSuccess = (state: { cittaEstates: CittaEstatesState }) => 
  state.cittaEstates.successMessage;

// Formatted for dropdown
export const selectCittaEstatesDropdownOptions = (state: { cittaEstates: CittaEstatesState }) => 
  state.cittaEstates.estates.map(estate => ({
    value: estate.pCode,
    label: `${estate.pCode} - ${estate.pName}`,
    original: estate
  }));

// Get estate by pCode
export const selectCittaEstateByCode = (state: { cittaEstates: CittaEstatesState }, pCode: string) => 
  state.cittaEstates.estates.find(estate => estate.pCode === pCode);

export default cittaEstatesSlice.reducer;