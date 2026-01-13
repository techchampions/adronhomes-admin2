import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import api from '../middleware';

// Types
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface AssignMarketerRequest {
  marketer_id: number | string;
  customer_id: number | string;
}

export interface AssignMarketerResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

interface AssignMarketerState {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
  errors: Record<string, string[]> | null;
}

const initialState: AssignMarketerState = {
  loading: false,
  error: null,
  success: false,
  message: null,
  errors: null,
};

// Thunk for assigning marketer to customer
export const assignMarketer = createAsyncThunk<
  AssignMarketerResponse,
  AssignMarketerRequest,
  {
    rejectValue: ErrorResponse;
  }
>(
  'customer/assignMarketer',
  async (assignData, { rejectWithValue }) => {
    const token = Cookies.get('token');

    if (!token) {
      return rejectWithValue({ message: 'No authentication token found. Please login again.' });
    }

    try {
      const response = await api.post<AssignMarketerResponse>(
        'https://adron.microf10.sg-host.com/api/admin/assign-marketer',
        assignData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'identifier': 'dMNOcdMNOPefFGHIlefFGHIJKLmno',
            'device_id': '1010l0010l1',
          },
        }
      );
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove('token');
        toast.error('Session expired. Please login again.');
      }

      if (axiosError.response) {
        const errorData = axiosError.response.data;
        
        // Format validation errors for display
        if (errorData.errors) {
          const errorMessages = Object.entries(errorData.errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('; ');
          
          toast.error(`Validation failed: ${errorMessages}`);
        } else if (errorData.message) {
          toast.error(errorData.message);
        }

        return rejectWithValue({
          message: errorData.message || 'Failed to assign marketer',
          errors: errorData.errors,
        });
      } else if (axiosError.request) {
        toast.error('No response from server. Please check your network connection.');
        return rejectWithValue({
          message: 'No response from server. Please check your network connection.',
        });
      }

      toast.error('An unexpected error occurred. Please try again.');
      return rejectWithValue({
        message: 'An unexpected error occurred. Please try again.',
      });
    }
  }
);

// Slice
const assignMarketerSlice = createSlice({
  name: 'assignMarketer',
  initialState,
  reducers: {
    resetAssignMarketerState: () => initialState,
    clearErrors: (state) => {
      state.errors = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(assignMarketer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
        state.errors = null;
      })
      .addCase(
        assignMarketer.fulfilled,
        (state, action: PayloadAction<AssignMarketerResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.message = action.payload.message;
          state.errors = action.payload.errors || null;
          state.error = null;

          if (action.payload.success) {
            toast.success(action.payload.message || 'Marketer assigned successfully!');
          } else if (action.payload.errors) {
            // Handle server-side validation errors even on "success: false"
            const errorMessages = Object.entries(action.payload.errors)
              .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
              .join('; ');
            
            toast.error(`Validation failed: ${errorMessages}`);
          }
        }
      )
      .addCase(assignMarketer.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        
        if (action.payload) {
          state.error = action.payload.message || 'Failed to assign marketer';
          state.errors = action.payload.errors || null;
        } else {
          state.error = action.error.message || 'Failed to assign marketer';
          state.errors = null;
        }

        // Only show toast if not already shown in the thunk
        if (!action.payload?.errors && state.error) {
          toast.error(state.error);
        }
      });
  },
});

// Exports
export const { resetAssignMarketerState, clearErrors } = assignMarketerSlice.actions;
export default assignMarketerSlice.reducer;