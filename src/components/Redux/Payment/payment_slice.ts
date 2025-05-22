import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaymentData, payments, PaymentsResponse } from "./payment_thunk";

interface PaymentsState {
  data: PaymentData | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
}

const initialState: PaymentsState = {
  data: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    perPage: 50,
    total: 0,
    lastPage: 1,
  },
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    resetPayments: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state
      .addCase(payments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state
      .addCase(payments.fulfilled, (state, action: PayloadAction<PaymentsResponse>) => {
        state.loading = false;
        state.data = action.payload.data.payments;
        
        // Update pagination from the response
        if (action.payload.data.payments.list) {
          state.pagination = {
            currentPage: action.payload.data.payments.list.current_page,
            perPage: action.payload.data.payments.list.per_page,
            total: action.payload.data.payments.list.total,
            lastPage: action.payload.data.payments.list.last_page,
          };
        }
      })
      // Handle rejected state
      .addCase(payments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch payments";
      });
  },
});

// Export actions
export const { setCurrentPage, resetPayments } = paymentsSlice.actions;

// Export reducer
export default paymentsSlice.reducer;

// Selectors
export const selectPaymentsData = (state: { payments: PaymentsState }) => state.payments.data;
export const selectPaymentsLoading = (state: { payments: PaymentsState }) => state.payments.loading;
export const selectPaymentsError = (state: { payments: PaymentsState }) => state.payments.error;
export const selectPaymentsPagination = (state: { payments: PaymentsState }) => state.payments.pagination;