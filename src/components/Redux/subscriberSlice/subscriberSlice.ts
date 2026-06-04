// subscriberSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { RootState } from '../store';
import api from '../middleware';

// Types
export interface CreateSubscriberPayload {
  payment_id: number;
  plan_id: number;
}

export interface CreateSubscriberResponse {
  success: boolean;
  message: string;
}

export interface SubscriberState {
  loading: boolean;
  success: boolean;
  message: string | null;
  paymentId: number | null;
  planId: number | null;
  error: string | null;
}

// Initial state
const initialState: SubscriberState = {
  loading: false,
  success: false,
  message: null,
  paymentId: null,
  planId: null,
  error: null
};

// Async thunk for creating subscriber
export const createSubscriber = createAsyncThunk<
  CreateSubscriberResponse,  // Return type on success
  CreateSubscriberPayload,   // Argument type
  { rejectValue: string }     // Reject value type
>(
  'subscriber/createSubscriber',
  async ({ payment_id, plan_id }, { rejectWithValue }) => {
    try {
      const response = await api.post<CreateSubscriberResponse>(
        "/api/citta/post-subscriber",
        {
          payment_id,
          plan_id,
        },
      );
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      return rejectWithValue(
        axiosError.response?.data?.message || 'Failed to create subscriber'
      );
    }
  }
);

// Create slice
const subscriberSlice = createSlice({
  name: 'subscriber',
  initialState,
  reducers: {
    resetSubscriberState: (state) => {
      state.loading = false;
      state.success = false;
      state.message = null;
      state.paymentId = null;
      state.planId = null;
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSubscriberData: (state, action: PayloadAction<{ paymentId: number; planId: number }>) => {
      state.paymentId = action.payload.paymentId;
      state.planId = action.payload.planId;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Subscriber - Pending
      .addCase(createSubscriber.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      // Create Subscriber - Fulfilled
      .addCase(createSubscriber.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
        state.paymentId = action.meta.arg.payment_id;
        state.planId = action.meta.arg.plan_id;
        state.error = null;
      })
      // Create Subscriber - Rejected
      .addCase(createSubscriber.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'An error occurred';
        state.message = null;
      });
  }
});

// Export actions
export const { 
  resetSubscriberState, 
  clearMessage, 
  clearError, 
  setSubscriberData 
} = subscriberSlice.actions;

// Export selectors with proper typing


export const selectSubscriberLoading = (state: RootState): boolean => state.subscriber.loading;
export const selectSubscriberSuccess = (state: RootState): boolean => state.subscriber.success;
export const selectSubscriberMessage = (state: RootState): string | null => state.subscriber.message;
export const selectSubscriberError = (state: RootState): string | null => state.subscriber.error;
export const selectSubscriberData = (state: RootState): { paymentId: number | null; planId: number | null } => ({
  paymentId: state.subscriber.paymentId,
  planId: state.subscriber.planId
});

// Export reducer
export default subscriberSlice.reducer;