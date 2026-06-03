import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import api from '../../middleware';

// ============ TYPES ============
export interface TerminationCode {
  pCode: string;
  pName: string;
}

export interface TerminationCodeResponse {
  success: boolean;
  message: string;
  data: TerminationCode[];
}

export interface TerminationCodeState {
  terminationCodes: TerminationCode[];
  filteredTerminationCodes: TerminationCode[];
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
export const fetchTerminationCodes = createAsyncThunk<
  TerminationCodeResponse,
  void,
  { rejectValue: { message: string; status?: number } }
>(
  'terminationCodes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching termination codes...');

      const response = await api.get<TerminationCodeResponse>(
        `${BASE_URL}/api/citta/termination-codes`
      );

      console.log('Termination codes response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error);
      
      if (error.response?.status === 401) {
        Cookies.remove('token');
        return rejectWithValue({ 
          message: 'Session expired. Please login again.',
          status: 401 
        });
      }
      
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to fetch termination codes',
        status: error.response?.status
      });
    }
  }
);

// ============ INITIAL STATE ============
const initialState: TerminationCodeState = {
  terminationCodes: [],
  filteredTerminationCodes: [],
  loading: false,
  error: null,
  successMessage: null,
  searchTerm: '',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 20,
  },
};

// ============ HELPER FUNCTIONS ============
const filterTerminationCodes = (codes: TerminationCode[], searchTerm: string): TerminationCode[] => {
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

const updatePagination = (state: TerminationCodeState) => {
  state.pagination.totalItems = state.filteredTerminationCodes.length;
  state.pagination.totalPages = Math.ceil(
    state.filteredTerminationCodes.length / state.pagination.perPage
  );
};

// ============ SLICE ============
const terminationCodesSlice = createSlice({
  name: 'terminationCodes',
  initialState,
  reducers: {
    clearTerminationCodeError: (state) => {
      state.error = null;
    },
    clearTerminationCodeSuccess: (state) => {
      state.successMessage = null;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.filteredTerminationCodes = filterTerminationCodes(state.terminationCodes, action.payload);
      state.pagination.currentPage = 1;
      updatePagination(state);
    },
    setTerminationCodeCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setTerminationCodePerPage: (state, action: PayloadAction<number>) => {
      state.pagination.perPage = action.payload;
      state.pagination.currentPage = 1;
      updatePagination(state);
    },
    clearSearch: (state) => {
      state.searchTerm = '';
      state.filteredTerminationCodes = state.terminationCodes;
      state.pagination.currentPage = 1;
      updatePagination(state);
    },
    clearTerminationCodes: (state) => {
      state.terminationCodes = [];
      state.filteredTerminationCodes = [];
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
      .addCase(fetchTerminationCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTerminationCodes.fulfilled, (state, action: PayloadAction<TerminationCodeResponse>) => {
        state.loading = false;
        
        if (action.payload?.success && Array.isArray(action.payload.data)) {
          state.terminationCodes = action.payload.data;
          state.filteredTerminationCodes = filterTerminationCodes(action.payload.data, state.searchTerm);
          state.successMessage = action.payload.message || 'Termination codes loaded successfully';
          updatePagination(state);
        } else {
          state.terminationCodes = [];
          state.filteredTerminationCodes = [];
          state.error = 'Invalid response format';
        }
      })
      .addCase(fetchTerminationCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch termination codes';
        state.terminationCodes = [];
        state.filteredTerminationCodes = [];
      });
  },
});

// ============ ACTIONS ============
export const {
  clearTerminationCodeError,
  clearTerminationCodeSuccess,
  setSearchTerm,
  setTerminationCodeCurrentPage,
  setTerminationCodePerPage,
  clearSearch,
  clearTerminationCodes,
} = terminationCodesSlice.actions;

// ============ SELECTORS ============
export const selectAllTerminationCodes = (state: { terminationCodes: TerminationCodeState }) =>
  state.terminationCodes.terminationCodes;

export const selectFilteredTerminationCodes = (state: { terminationCodes: TerminationCodeState }) => {
  const { filteredTerminationCodes, pagination } = state.terminationCodes;
  const startIndex = (pagination.currentPage - 1) * pagination.perPage;
  const endIndex = startIndex + pagination.perPage;
  return filteredTerminationCodes.slice(startIndex, endIndex);
};

export const selectTerminationCodesLoading = (state: { terminationCodes: TerminationCodeState }) =>
  state.terminationCodes.loading;

export const selectTerminationCodesError = (state: { terminationCodes: TerminationCodeState }) =>
  state.terminationCodes.error;

export const selectTerminationCodesPagination = (state: { terminationCodes: TerminationCodeState }) =>
  state.terminationCodes.pagination;

export const selectSearchTerm = (state: { terminationCodes: TerminationCodeState }) =>
  state.terminationCodes.searchTerm;

export const selectTerminationCodesCount = (state: { terminationCodes: TerminationCodeState }) => ({
  total: state.terminationCodes.terminationCodes.length,
  filtered: state.terminationCodes.filteredTerminationCodes.length,
});

export default terminationCodesSlice.reducer;