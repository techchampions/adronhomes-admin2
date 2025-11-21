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
  filteredPayments: PaymentItem[]; // New state for search results
  pagination: PaginationState;
  loading: boolean;
  error: string | null;
  success: boolean;
  searchQuery: string; // New state for search term
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
  filteredPayments: [],
  pagination: initialPagination,
  loading: false,
  error: null,
  success: false,
  searchQuery: "",
};

const userPaymentsSlice = createSlice({
  name: "user_payments",
  initialState,
  reducers: {
    resetUserPaymentsState: () => initialState,
    
    // New reducer for search
setSearchQuery: (state, action: PayloadAction<string>) => {
  state.searchQuery = action.payload;
  if (!action.payload) {
    state.filteredPayments = state.payments;
  } else {
    const query = action.payload.toLowerCase();
    state.filteredPayments = state.payments.filter(payment => {
      return Object.values(payment).some(value => 
        value !== null &&
        value !== undefined &&
        value.toString().toLowerCase().includes(query)
      );
    });
  }
},

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

          const { payments } = action.payload.data;
          const { list, ...summary } = payments;

          state.summary = summary;
          state.payments = list.data || [];
          state.filteredPayments = list.data || []; // Initialize filteredPayments
          state.pagination = {
              currentPage: list.current_page || 1,
              lastPage: list.last_page || 1,
              total: list.total || 0,
              perPage: list.per_page || 50,
          };
        }
      )
      .addCase(fetchUserPayments.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to fetch user payments.";
        state.summary = null;
        state.payments = [];
        state.filteredPayments = [];
        state.pagination = initialPagination;
      });
  },
});

export const { resetUserPaymentsState, setSearchQuery } = userPaymentsSlice.actions;
export default userPaymentsSlice.reducer;

// Selectors
export const selectUserPayments = (state: RootState) => 
  (state as any).user_payments?.filteredPayments || [];

export const selectPaymentStats = (state: RootState) =>
  (state as any).user_payments?.summary || null;

export const selectUserPaymentsLoading = (state: RootState) =>
  (state as any).user_payments?.loading || false;

export const selectUserPaymentsError = (state: RootState) =>
  (state as any).user_payments?.error || null;

export const selectUserPaymentsPagination = (state: RootState) =>
  (state as any).user_payments?.pagination || initialPagination;

export const selectUserPaymentsSearchQuery = (state: RootState) =>
  (state as any).user_payments?.searchQuery || "";
