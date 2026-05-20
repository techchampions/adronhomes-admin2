import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import api from '../../middleware';


// ============ TYPES ============
export interface PromoCode {
  pCode: string;
  pName: string;
}

export interface PromoCodeResponse {
  success: boolean;
  message: string;
  data: PromoCode[];
}

export interface PromoCodeState {
  promoCodes: PromoCode[];
  filteredPromoCodes: PromoCode[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  searchTerm: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
  };
}

// ============ API CONFIGURATION ============
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ============ ASYNC THUNK ============
export const fetchPromoCodes = createAsyncThunk<
  PromoCodeResponse,
  void, // No parameters needed since there's no pagination
  { rejectValue: { message: string } }
>(
  'promoCodes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching promo codes...');

      const response = await api.get<PromoCodeResponse>(
        `${BASE_URL}/api/admin/citta/promo-codes`
      );

      console.log('Promo codes response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error);
      if (error.response?.status === 401) {
        Cookies.remove('token');
        return rejectWithValue({ message: 'Session expired. Please login again.' });
      }
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch promo codes',
      });
    }
  }
);

// ============ INITIAL STATE ============
const initialState: PromoCodeState = {
  promoCodes: [],
  filteredPromoCodes: [],
  loading: false,
  error: null,
  successMessage: null,
  searchTerm: '',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 20, // Adjust as needed for frontend pagination
  },
};

// ============ HELPER FUNCTIONS ============
const filterPromoCodes = (codes: PromoCode[], searchTerm: string): PromoCode[] => {
  if (!searchTerm.trim()) {
    return codes;
  }
  
  const term = searchTerm.toLowerCase().trim();
  return codes.filter(
    (code) =>
      code.pCode.toLowerCase().includes(term) ||
      code.pName.toLowerCase().includes(term)
  );
};

const updatePagination = (state: PromoCodeState) => {
  state.pagination.totalItems = state.filteredPromoCodes.length;
  state.pagination.totalPages = Math.ceil(
    state.filteredPromoCodes.length / state.pagination.perPage
  );
};

// ============ SLICE ============
const promoCodesSlice = createSlice({
  name: 'promoCodes',
  initialState,
  reducers: {
    clearPromoCodeError: (state) => {
      state.error = null;
    },
    clearPromoCodeSuccess: (state) => {
      state.successMessage = null;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.filteredPromoCodes = filterPromoCodes(state.promoCodes, action.payload);
      state.pagination.currentPage = 1;
      updatePagination(state);
    },
    setPromoCodeCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setPromoCodePerPage: (state, action: PayloadAction<number>) => {
      state.pagination.perPage = action.payload;
      state.pagination.currentPage = 1;
      updatePagination(state);
    },
    clearSearch: (state) => {
      state.searchTerm = '';
      state.filteredPromoCodes = state.promoCodes;
      state.pagination.currentPage = 1;
      updatePagination(state);
    },
    clearPromoCodes: (state) => {
      state.promoCodes = [];
      state.filteredPromoCodes = [];
      state.searchTerm = '';
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
      .addCase(fetchPromoCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromoCodes.fulfilled, (state, action: PayloadAction<PromoCodeResponse>) => {
        state.loading = false;
        
        if (action.payload?.success && Array.isArray(action.payload.data)) {
          state.promoCodes = action.payload.data;
          state.filteredPromoCodes = filterPromoCodes(action.payload.data, state.searchTerm);
          state.successMessage = action.payload.message || 'Promo codes loaded successfully';
          updatePagination(state);
        } else {
          state.promoCodes = [];
          state.filteredPromoCodes = [];
          state.error = 'Invalid response format';
        }
      })
      .addCase(fetchPromoCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch promo codes';
        state.promoCodes = [];
        state.filteredPromoCodes = [];
      });
  },
});

// ============ ACTIONS ============
export const {
  clearPromoCodeError,
  clearPromoCodeSuccess,
  setSearchTerm,
  setPromoCodeCurrentPage,
  setPromoCodePerPage,
  clearSearch,
  clearPromoCodes,
} = promoCodesSlice.actions;

// ============ SELECTORS ============
export const selectAllPromoCodes = (state: { promoCodes: PromoCodeState }) =>
  state.promoCodes.promoCodes;

export const selectFilteredPromoCodes = (state: { promoCodes: PromoCodeState }) => {
  const { filteredPromoCodes, pagination } = state.promoCodes;
  const startIndex = (pagination.currentPage - 1) * pagination.perPage;
  const endIndex = startIndex + pagination.perPage;
  return filteredPromoCodes.slice(startIndex, endIndex);
};

export const selectPromoCodesLoading = (state: { promoCodes: PromoCodeState }) =>
  state.promoCodes.loading;

export const selectPromoCodesError = (state: { promoCodes: PromoCodeState }) =>
  state.promoCodes.error;

export const selectPromoCodesPagination = (state: { promoCodes: PromoCodeState }) =>
  state.promoCodes.pagination;

export const selectSearchTerm = (state: { promoCodes: PromoCodeState }) =>
  state.promoCodes.searchTerm;

export const selectPromoCodesCount = (state: { promoCodes: PromoCodeState }) => ({
  total: state.promoCodes.promoCodes.length,
  filtered: state.promoCodes.filteredPromoCodes.length,
});

export default promoCodesSlice.reducer;