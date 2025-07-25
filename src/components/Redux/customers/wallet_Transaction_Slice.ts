import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletTransaction, WalletTransactionsList, WalletTransactionsResponse, fetchWalletTransactions } from './wallet_Transactions_thunk';

interface WalletTransactionsState {
  data: WalletTransactionsList | null;
  transactions: WalletTransaction[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
  };
}

const initialState: WalletTransactionsState = {
  data: null,
  transactions: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10,
  },
};

const walletTransactionsSlice = createSlice({
  name: 'walletTransactions',
  initialState,
  reducers: {
    clearWalletTransactionsError: (state) => {
      state.error = null;
    },
    setWalletTransactionsPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    resetWalletTransactions: (state) => {
      state.data = null;
      state.transactions = [];
      state.loading = false;
      state.error = null;
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        perPage: 10,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state
      .addCase(fetchWalletTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Handle fulfilled state
      .addCase(
        fetchWalletTransactions.fulfilled,
        (state, action: PayloadAction<WalletTransactionsResponse>) => {
          state.loading = false;
          state.data = action.payload.data;
          state.transactions = action.payload.data.data;
          
          // Update pagination info
          state.pagination = {
            currentPage: action.payload.data.current_page,
            totalPages: action.payload.data.last_page,
            totalItems: action.payload.data.total,
            perPage: action.payload.data.per_page,
          };
        }
      )
      // Handle rejected state
      .addCase(fetchWalletTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch wallet transactions';
      });
  },
});

// Export actions
export const { 
  clearWalletTransactionsError, 
  setWalletTransactionsPage,
  resetWalletTransactions
} = walletTransactionsSlice.actions;

// Export reducer
export default walletTransactionsSlice.reducer;

// Export selectors
export const selectAllWalletTransactions = (state: { walletTransactions: WalletTransactionsState }) => 
  state.walletTransactions.transactions;

export const selectWalletTransactionsData = (state: { walletTransactions: WalletTransactionsState }) =>
  state.walletTransactions.data;

export const selectWalletTransactionsLoading = (state: { walletTransactions: WalletTransactionsState }) =>
  state.walletTransactions.loading;

export const selectWalletTransactionsError = (state: { walletTransactions: WalletTransactionsState }) =>
  state.walletTransactions.error;

export const selectWalletTransactionsPagination = (state: { walletTransactions: WalletTransactionsState }) =>
  state.walletTransactions.pagination;