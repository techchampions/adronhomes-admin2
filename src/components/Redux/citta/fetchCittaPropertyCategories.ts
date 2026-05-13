import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import Cookies from 'js-cookie';
import api from '../middleware';

// ============ TYPES ============
export interface CittaPropertyCategory {
  pCode: string;
  pName: string;
}

export interface CittaPropertyCategoryResponse {
  success: boolean;
  data: CittaPropertyCategory[];
}

export interface ErrorResponse {
  message: string;
}

export interface CittaPropertyCategoryState {
  categories: CittaPropertyCategory[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

// ============ API CONFIGURATION ============
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ============ ASYNC THUNK ============
export const fetchCittaPropertyCategories = createAsyncThunk<
  CittaPropertyCategoryResponse,
  void,
  { rejectValue: ErrorResponse }
>(
  'cittaPropertyCategories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
          
      const response = await api.get<CittaPropertyCategoryResponse>(
        `${BASE_URL}/api/admin/citta-property-category`,
        
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        Cookies.remove("token");
        return rejectWithValue({
          message: "Session expired. Please login again.",
        });
      }
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to fetch property categories",
      });
    }
  }
);



// ============ INITIAL STATE ============
const initialState: CittaPropertyCategoryState = {
  categories: [],
  loading: false,
  error: null,
  successMessage: null,
};

// ============ SLICE ============
const cittaPropertyCategorySlice = createSlice({
  name: 'cittaPropertyCategories',
  initialState,
  reducers: {
    clearPropertyCategoryError: (state) => {
      state.error = null;
    },
    clearPropertyCategorySuccess: (state) => {
      state.successMessage = null;
    },
    clearPropertyCategories: (state) => {
      state.categories = [];
      state.error = null;
      state.successMessage = null;
    },
    addPropertyCategory: (state, action: PayloadAction<CittaPropertyCategory>) => {
      state.categories.push(action.payload);
    },
    updatePropertyCategory: (state, action: PayloadAction<CittaPropertyCategory>) => {
      const index = state.categories.findIndex(cat => cat.pCode === action.payload.pCode);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    removePropertyCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(cat => cat.pCode !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Categories
      .addCase(fetchCittaPropertyCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchCittaPropertyCategories.fulfilled, (state, action: PayloadAction<CittaPropertyCategoryResponse>) => {
        state.loading = false;
        
        if (action.payload?.success && Array.isArray(action.payload.data)) {
          state.categories = action.payload.data;
          state.successMessage = 'Property categories loaded successfully';
        } else {
          state.categories = [];
          state.error = 'Invalid response format from server';
        }
      })
      .addCase(fetchCittaPropertyCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch property categories';
      })

  },
});

// ============ ACTIONS ============
export const { 
  clearPropertyCategoryError,
  clearPropertyCategorySuccess,
  clearPropertyCategories,
  addPropertyCategory,
  updatePropertyCategory,
  removePropertyCategory
} = cittaPropertyCategorySlice.actions;

// ============ SELECTORS ============
export const selectAllPropertyCategories = (state: { cittaPropertyCategories: CittaPropertyCategoryState }) => 
  state.cittaPropertyCategories.categories;

export const selectPropertyCategoriesLoading = (state: { cittaPropertyCategories: CittaPropertyCategoryState }) => 
  state.cittaPropertyCategories.loading;

export const selectPropertyCategoriesError = (state: { cittaPropertyCategories: CittaPropertyCategoryState }) => 
  state.cittaPropertyCategories.error;

export const selectPropertyCategoriesSuccess = (state: { cittaPropertyCategories: CittaPropertyCategoryState }) => 
  state.cittaPropertyCategories.successMessage;

// Formatted for dropdown
export const selectPropertyCategoryDropdownOptions = (state: { cittaPropertyCategories: CittaPropertyCategoryState }) => 
  state.cittaPropertyCategories.categories.map(category => ({
    value: category.pCode,
    label: `${category.pCode} - ${category.pName}`,
    original: category
  }));

// Get category by code
export const selectPropertyCategoryByCode = (state: { cittaPropertyCategories: CittaPropertyCategoryState }, pCode: string) => 
  state.cittaPropertyCategories.categories.find(category => category.pCode === pCode);

// Sorted selectors
export const selectPropertyCategoriesSortedByCode = (state: { cittaPropertyCategories: CittaPropertyCategoryState }) => 
  [...state.cittaPropertyCategories.categories].sort((a, b) => a.pCode.localeCompare(b.pCode));

export const selectPropertyCategoriesSortedByName = (state: { cittaPropertyCategories: CittaPropertyCategoryState }) => 
  [...state.cittaPropertyCategories.categories].sort((a, b) => a.pName.localeCompare(b.pName));

export default cittaPropertyCategorySlice.reducer;