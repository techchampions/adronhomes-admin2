import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { RootState } from '../store'; 



const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface PropertyPlanPayment {
  id: number;
  property_id: number;
  plan_id: number;
  status: number;
  amount: number;
  due_date: string;
  created_at: string;
  updated_at: string;
  property: Property;
  property_plan: null;
}

interface Pagination {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

interface PropertyPlanPaymentsResponse {
  status: string;
  message: string;
  properties: {
    current_page: number;
    data: PropertyPlanPayment[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

interface PropertyPlanPaymentsState {
  data: PropertyPlanPayment[] | null;
  pagination: Pagination;
  loading: boolean;
  error: ErrorResponse | null;
}

// Initial state
const initialState: PropertyPlanPaymentsState = {
  data: null,
  pagination: {
    currentPage: 1,
    perPage: 0,
    totalItems: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};
interface Property {
  id: number;
  name: string;
  price: number;
  size: string;
  display_image: string;
  lga: string;
  state: string;
  total_amount: number;
}


// Thunk
export const fetchPropertyPlanPayments = createAsyncThunk<
  PropertyPlanPaymentsResponse,
  number, 
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  'propertyPlanPayments/fetch',
  async (planId, { rejectWithValue, getState }) => {
    const token = Cookies.get('token');
    const state = getState();
    const currentPage = state.propertyPlanPayments?.pagination.currentPage || 1;

    if (!token) {
      return rejectWithValue({
        message: 'No authentication token found. Please login again.',
      });
    }

    try {
      const response = await axios.get<PropertyPlanPaymentsResponse>(
        `${BASE_URL}/api/plan-payment-list/${planId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            identifier: 'dMNOcdMNOPefFGHIlefFGHIJKLmno',
            device_id: '1010l0010l1',
          },
          params: {
            page: currentPage,
          },
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove('token');
      }

      if (axiosError.response) {
        return rejectWithValue({
          message:
            axiosError.response.data.message || 'Failed to fetch property plan payments',
          errors: axiosError.response.data.errors,
        });
      } else if (axiosError.request) {
        return rejectWithValue({
          message: 'No response from server. Please check your network connection.',
        });
      }

      return rejectWithValue({
        message: 'An unexpected error occurred. Please try again.',
      });
    }
  }
);

// Slice
const propertyPlanPaymentsSlice = createSlice({
  name: 'propertyPlanPayments',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertyPlanPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchPropertyPlanPayments.fulfilled,
        (state, action: PayloadAction<PropertyPlanPaymentsResponse>) => {
          state.loading = false;
          state.data = action.payload.properties.data;
          state.pagination = {
            currentPage: action.payload.properties.current_page,
            perPage: action.payload.properties.per_page,
            totalItems: action.payload.properties.total,
            totalPages: action.payload.properties.last_page,
          };
        }
      )
      .addCase(
        fetchPropertyPlanPayments.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.loading = false;
          state.error = action.payload || {
            message: 'An unknown error occurred',
          };
        }
      );
  },
});

export const { setCurrentPage } = propertyPlanPaymentsSlice.actions;
export default propertyPlanPaymentsSlice.reducer;