// Wallet_slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  WalletSuccessResponse } from './types';
import { fetchWalletTransactions } from './wallet_thunk';
// import { fetchWalletTransactions,  } from './Wallet_thunk';

// Pagination state interface
interface WalletPaginationState {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  searchFilter: string | null;
  transactionTypeFilter: string | null;
}

// Main state interface
interface WalletState {
  data: {
    total_wallet_amount: string;
    total_creditted: string;
    total_debitted: string;
    list: {
      current_page: number;
      data: any[];
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      links: Array<{ url: string | null; label: string; active: boolean }>;
      next_page_url: string | null;
      path: string;
      per_page: number;
      prev_page_url: string | null;
      to: number;
      total: number;
    };
  } | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  pagination: WalletPaginationState;
}

const initialState: WalletState = {
  data: null,
  loading: false,
  error: null,
  success: false,
  pagination: {
    currentPage: 1,
    perPage: 20,
    totalItems: 0,
    totalPages: 1,
    searchFilter: null,
    transactionTypeFilter: null,
  },
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    resetWalletState: () => initialState,
    setCurrentPage: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.list.current_page = action.payload;
      }
      state.pagination.currentPage = action.payload;
    },
    setTransactionTypeFilter: (state, action: PayloadAction<string | null>) => {
      state.pagination.transactionTypeFilter = action.payload;
      state.pagination.currentPage = 1;
    },
    setSearchFilter: (state, action: PayloadAction<string | null>) => {
      state.pagination.searchFilter = action.payload;
      state.pagination.currentPage = 1;
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.perPage = action.payload;
      state.pagination.currentPage = 1;
    },
    clearWalletError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        fetchWalletTransactions.fulfilled,
        (state, action: PayloadAction<WalletSuccessResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.data = action.payload.data.transactions;
          
          state.pagination = {
            ...state.pagination,
            currentPage: action.payload.data.transactions.list.current_page,
            perPage: action.payload.data.transactions.list.per_page,
            totalItems: action.payload.data.transactions.list.total,
            totalPages: action.payload.data.transactions.list.last_page,
          };
        }
      )
      .addCase(fetchWalletTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch wallet transactions';
        state.success = false;
      });
  },
});

export const { 
  resetWalletState, 
  setCurrentPage, 
  setTransactionTypeFilter, 
  setSearchFilter,
  setPerPage,
  clearWalletError
} = walletSlice.actions;

export default walletSlice.reducer;

// Selectors
export const selectWalletPagination = (state: { wallet: WalletState }) =>
  state.wallet.pagination;

export const selectWalletTransactionsList = (state: { wallet: WalletState }) =>
  state.wallet.data?.list.data;

export const selectWalletSummary = (state: { wallet: WalletState }) => ({
  total_wallet_amount: state.wallet.data?.total_wallet_amount,
  total_creditted: state.wallet.data?.total_creditted,
  total_debitted: state.wallet.data?.total_debitted,
});

export const selectWalletLoading = (state: { wallet: WalletState }) =>
  state.wallet.loading;

export const selectWalletError = (state: { wallet: WalletState }) =>
  state.wallet.error;

export const selectWalletSuccess = (state: { wallet: WalletState }) =>
  state.wallet.success;

export const selectWalletData = (state: { wallet: WalletState }) =>
  state.wallet.data;