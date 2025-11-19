import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserPayments, PaymentSummary, UserPaymentsResponse, PaymentItem } from "./paymentbyuser_thunk";
import { RootState } from "../../store";

interface PaginationState {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
}

interface UserPaymentsState {
  summary: Omit<PaymentSummary, 'list'> | null;
  payments: PaymentItem[];
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialPagination: PaginationState = {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 50,
};

const initialState: UserPaymentsState = {
  summary: null,
  payments: [],
  pagination: initialPagination,
  loading: false,
  error: null,
  success: false,
};

const userPaymentsSlice = createSlice({
  name: "user_paymentsss",
  initialState,
  reducers: {
    resetUserPaymentsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        fetchUserPayments.fulfilled,
        (state, action: PayloadAction<UserPaymentsResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.error = null;

          console.log('🔄 Slice - Full API Response:', action.payload);
          
          const { payments } = action.payload.data;
          
          // Extract summary data (excluding list)
          const { list, ...summary } = payments;
          
          console.log('📊 Slice - Summary:', summary);
          console.log('📋 Slice - List data:', list.data);
          console.log('🔢 Slice - Number of items:', list.data.length);

          state.summary = summary;
          state.payments = list.data || [];
          state.pagination = {
              currentPage: list.current_page || 1,
              lastPage: list.last_page || 1,
              total: list.total || 0,
              perPage: list.per_page || 50,
          };

          console.log('✅ Slice - Final state:', {
            paymentsCount: state.payments.length,
            summary: state.summary,
            pagination: state.pagination
          });
        }
      )
      .addCase(fetchUserPayments.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to fetch user payments.";
        state.summary = null;
        state.payments = [];
        state.pagination = initialPagination;
        
        console.log('❌ Slice - Error:', action.payload);
      });
  },
});

export const { resetUserPaymentsState } = userPaymentsSlice.actions;
export default userPaymentsSlice.reducer;

// Updated selectors with proper typing
export const selectUserPayments = (state: RootState) => 
  (state as any).user_payments?.payments || [];

export const selectPaymentStats = (state: RootState) =>
  (state as any).user_payments?.summary || null;

export const selectUserPaymentsLoading = (state: RootState) =>
  (state as any).user_payments?.loading || false;

export const selectUserPaymentsError = (state: RootState) =>
  (state as any).user_payments?.error || null;

export const selectUserPaymentsPagination = (state: RootState) =>
  (state as any).user_payments?.pagination || initialPagination;