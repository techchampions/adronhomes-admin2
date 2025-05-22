import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchTransactions, TransactionsList, TransactionsResponse } from './Transactions_thunk';


interface TransactionsState {
  data: {
    transactions: {
      total: number;
      approved: number;
      pending: number;
      list: TransactionsList;
    };
  };
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    perPage: number;
    totalPages: number;
  };
}

const initialState: TransactionsState = {
  data: {
    transactions: {
      total: 0,
      approved: 0,
      pending: 0,
      list: {
        current_page: 1,
        data: [],
        first_page_url: '',
        from: 0,
        last_page: 1,
        last_page_url: '',
        links: [],
        next_page_url: null,
        path: '',
        per_page: 10,
        prev_page_url: null,
        to: 0,
        total: 0,
      },
    },
  },
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    perPage: 10,
    totalPages: 1,
  },
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    resetTransactions: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<TransactionsResponse>) => {
        state.loading = false;
        state.data = action.payload.data;
        state.pagination = {
          currentPage: action.payload.data.transactions.list.current_page,
          perPage: action.payload.data.transactions.list.per_page,
          totalPages: action.payload.data.transactions.list.last_page,
        };
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch transactions';
      });
  },
});

export const { setCurrentPage, resetTransactions } = transactionsSlice.actions;

export default transactionsSlice.reducer;

// Selectors
export const selectTransactions = (state: { transactions: TransactionsState }) => 
  state.transactions.data.transactions.list.data;
export const selectTransactionsLoading = (state: { transactions: TransactionsState }) => 
  state.transactions.loading;
export const selectTransactionsError = (state: { transactions: TransactionsState }) => 
  state.transactions.error;
export const selectTransactionsPagination = (state: { transactions: TransactionsState }) => 
  state.transactions.pagination;
export const selectTransactionsSummary = (state: { transactions: TransactionsState }) => ({
  total: state.transactions.data.transactions.total,
  approved: state.transactions.data.transactions.approved,
  pending: state.transactions.data.transactions.pending,
});