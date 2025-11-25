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

export interface DeleteCustomerResponse {
  success: boolean;
  message: string;
}

interface DeleteCustomerState {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}

const initialState: DeleteCustomerState = {
  loading: false,
  error: null,
  success: false,
  message: null,
};

// 🔥 Thunk for deleting a customer
export const deleteCustomer = createAsyncThunk<
  DeleteCustomerResponse,
  number,
  { rejectValue: ErrorResponse }
>(
  'customer/deleteCustomer',
  async (customerId, { rejectWithValue }) => {
    const token = Cookies.get('token');

    if (!token) {
      return rejectWithValue({
        message: 'No authentication token found. Please login again.',
      });
    }

    try {
      const response = await api.delete<DeleteCustomerResponse>(
        `https://adron.microf10.sg-host.com/api/admin/delete-user/${customerId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            identifier: 'dMNOcdMNOPefFGHIlefFGHIJKLmno',
            device_id: '1010l0010l1',
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
        return rejectWithValue({
          message: axiosError.response.data.message || 'Failed to delete customer',
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

// 🔥 Slice
const deleteCustomerSlice = createSlice({
  name: 'deleteCustomer',
  initialState,
  reducers: {
    resetDeleteCustomerState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(
        deleteCustomer.fulfilled,
        (state, action: PayloadAction<DeleteCustomerResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.message = action.payload.message;
          state.error = null;

          if (action.payload.success) {
            toast.success(action.payload.message);
          }
        }
      )
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          (action.payload && 'message' in action.payload)
            ? action.payload.message
            : action.error.message || 'Failed to delete customer';

        if (state.error) {
          toast.error(state.error);
        }
      });
  },
});

// Exports
export const { resetDeleteCustomerState } = deleteCustomerSlice.actions;
export default deleteCustomerSlice.reducer;
