import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import Cookies from 'js-cookie';
import api from '../middleware';

// ============ TYPES ============
export interface CittaPropertyMapItem {
  id: number;
  p_code: string;
  estate_code: string;
  estate_map: string;
  estate_address: string;
  size: string;
  duration: number;
  created_at: string;
  updated_at: string;
  trimmed_price: number;
  displayed_price: string;
  property_code?: string;
}

export interface CittaPropertyMapResponse {
  success: boolean;
  count?: number;
  data: CittaPropertyMapItem[];
}

export interface CittaPropertyMapState {
  properties: CittaPropertyMapItem[];
  filteredProperties: CittaPropertyMapItem[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
  };
  filters: {
    estate_code: string;
    category_code: string;
  };
}

// ============ API CONFIGURATION ============
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ============ ASYNC THUNK ============
export const fetchCittaPropertyMap = createAsyncThunk<
  CittaPropertyMapResponse,
  { estate_code?: string; category_code?: string; page?: number; per_page?: number },
  { rejectValue: { message: string } }
>(
  'cittaPropertyMap/fetchAll',
  async ({ estate_code = '', category_code = ''}, { rejectWithValue }) => {
    try {
      const params: Record<string, string | number> = {
        // page,
        // per_page,
      };

      if (estate_code?.trim()) {
        params.estate_code = estate_code.trim();
      }

      if (category_code?.trim()) {
        params.category_code = category_code.trim();
      }

      console.log('Fetching property map with params:', params);

      const response = await api.get<CittaPropertyMapResponse>(
        `${BASE_URL}/api/admin/citta-property-map`,
        { params }   // ← This was missing!
      );

      console.log('Property map response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error);
      if (error.response?.status === 401) {
        Cookies.remove('token');
        return rejectWithValue({ message: 'Session expired. Please login again.' });
      }
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch property map',
      });
    }
  }
);
// ============ INITIAL STATE ============
const initialState: CittaPropertyMapState = {
  properties: [],
  filteredProperties: [],
  loading: false,
  error: null,
  successMessage: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 20,
  },
  filters: {
    estate_code: '',
    category_code: '',
  },
};

// ============ SLICE ============
const cittaPropertyMapSlice = createSlice({
  name: 'cittaPropertyMap',
  initialState,
  reducers: {
    clearPropertyMapError: (state) => {
      state.error = null;
    },
    clearPropertyMapSuccess: (state) => {
      state.successMessage = null;
    },
    setPropertyMapEstateFilter: (state, action: PayloadAction<string>) => {
      state.filters.estate_code = action.payload;
      state.pagination.currentPage = 1;
    },
    setPropertyMapCategoryFilter: (state, action: PayloadAction<string>) => {
      state.filters.category_code = action.payload;
      state.pagination.currentPage = 1;
    },
    setPropertyMapCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setPropertyMapPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.perPage = action.payload;
      state.pagination.currentPage = 1;
    },
    clearPropertyMapFilters: (state) => {
      state.filters = { estate_code: '', category_code: '' };
      state.filteredProperties = state.properties;
      state.pagination.currentPage = 1;
    },
    clearPropertyMap: (state) => {
      state.properties = [];
      state.filteredProperties = [];
      state.filters = { estate_code: '', category_code: '' };
      state.error = null;
      state.successMessage = null;
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        perPage: 20,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCittaPropertyMap.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCittaPropertyMap.fulfilled, (state, action: PayloadAction<CittaPropertyMapResponse>) => {
        state.loading = false;
        
        if (action.payload?.success && Array.isArray(action.payload.data)) {
          state.properties = action.payload.data;
          state.filteredProperties = action.payload.data;
          state.pagination.totalItems = action.payload.data.length;
          state.pagination.totalPages = Math.ceil(action.payload.data.length / state.pagination.perPage);
          state.successMessage = 'Property map loaded successfully';
        } else {
          state.properties = [];
          state.filteredProperties = [];
          state.error = 'Invalid response format';
        }
      })
      .addCase(fetchCittaPropertyMap.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch property map';
      });
  },
});

// ============ ACTIONS ============
export const {
  clearPropertyMapError,
  clearPropertyMapSuccess,
  setPropertyMapEstateFilter,
  setPropertyMapCategoryFilter,
  setPropertyMapCurrentPage,
  setPropertyMapPerPage,
  clearPropertyMapFilters,
  clearPropertyMap,
} = cittaPropertyMapSlice.actions;

// ============ SELECTORS ============
export const selectAllPropertyMapItems = (state: { cittaPropertyMap: CittaPropertyMapState }) =>
  state.cittaPropertyMap.properties;

export const selectFilteredPropertyMapItems = (state: { cittaPropertyMap: CittaPropertyMapState }) => {
  const { filteredProperties, pagination } = state.cittaPropertyMap;
  const startIndex = (pagination.currentPage - 1) * pagination.perPage;
  const endIndex = startIndex + pagination.perPage;
  return filteredProperties.slice(startIndex, endIndex);
};

export const selectPropertyMapLoading = (state: { cittaPropertyMap: CittaPropertyMapState }) =>
  state.cittaPropertyMap.loading;

export const selectPropertyMapError = (state: { cittaPropertyMap: CittaPropertyMapState }) =>
  state.cittaPropertyMap.error;

export const selectPropertyMapPagination = (state: { cittaPropertyMap: CittaPropertyMapState }) =>
  state.cittaPropertyMap.pagination;

export const selectPropertyMapFilters = (state: { cittaPropertyMap: CittaPropertyMapState }) =>
  state.cittaPropertyMap.filters;

export default cittaPropertyMapSlice.reducer;