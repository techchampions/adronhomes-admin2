import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TransactionListData, TransactionsResponse } from "./type";
import { fetchUserTransactions } from "./usePaymentThunk";

interface TransactionPaginationState {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  
}

interface UserTransactionsState {
  stats: { total: number; approved: number; pending: number; amount_total: number; amount_approved: number; amount_pending: number; };
  items: never[];
  data: TransactionListData | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  pagination: TransactionPaginationState;
}

const initialState: UserTransactionsState = {
  data: null,
  loading: false,
  error: null,
  success: false,
  pagination: {
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  },
  stats: {
    total: 0,
    approved: 0,
    pending: 0,
    amount_total: 0,
    amount_approved: 0,
    amount_pending: 0
  },
  items: []
};

const userTransactionsSlice = createSlice({
  name: "userTransactionsbyid",
  initialState,
  reducers: {
    resetUserTransactionsState: () => initialState,
    setCurrentPage: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.current_page = action.payload;
      }
      state.pagination.currentPage = action.payload;
    },
  
    setPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.perPage = action.payload;
      state.pagination.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        fetchUserTransactions.fulfilled,
        (state, action: PayloadAction<TransactionsResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.data = action.payload.data;
          
          state.pagination = {
            ...state.pagination,
            currentPage: action.payload.data.current_page,
            perPage: action.payload.data.per_page,
            totalItems: action.payload.data.total,
            totalPages: action.payload.data.last_page,
          };
        }
      )
      .addCase(fetchUserTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch user transactions";
        state.success = false;
      });
  },
});

export const { 
  resetUserTransactionsState, 
  setCurrentPage, 
  setPerPage
} = userTransactionsSlice.actions;

export default userTransactionsSlice.reducer;

// Selectors
export const selectUserTransactionsPagination = (state: { userPayments: UserTransactionsState }) =>
  state.userPayments.pagination;

export const selectUserTransactionsList = (state: { userPayments: UserTransactionsState }) =>
  state.userPayments.data?.data;

export const selectUserTransactionsLoading = (state: { userPayments: UserTransactionsState }) =>
  state.userPayments.loading;

export const selectUserTransactionsError = (state: { userPayments: UserTransactionsState }) =>
  state.userPayments.error;

export const selectUserTransactionsSuccess = (state: { userPayments: UserTransactionsState }) =>
  state.userPayments.success;