import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchTransactions, TransactionsList, TransactionsResponse } from './Transactions_thunk';

interface Transaction {
  id: number;
  property_id: number | null;
  user_id: number | null;
  plan_id: number | null;
  amount: number;
  status: number;
  description: string;
  transaction_method: string;
  created_at: string;
  updated_at: string;
  marketer_id: number | null;
  user: {
    first_name: string;
    last_name: string;
  } | null;
  marketer: {
    first_name: string;
    last_name: string;
  } | null;
}

interface TransactionsData {
  total: number;
  approved: number;
  pending: number;
  list: TransactionsList;
}

interface TransactionsState {
  data: {
    success: boolean;
    data: {
      transactions: TransactionsData;
    };
  };
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    perPage: number;
    totalPages: number;
    totalItems: number;
  };
}

const initialState: TransactionsState = {
  data: {
    success: false,
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
        }
      }
    }
  },
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    perPage: 10,
    totalPages: 1,
    totalItems: 0,
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
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.data = action.payload;
        state.pagination = {
          currentPage: action.payload.data.transactions.list.current_page,
          perPage: action.payload.data.transactions.list.per_page,
          totalPages: action.payload.data.transactions.list.last_page,
          totalItems: action.payload.data.transactions.list.total,
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
  state.transactions.data.data.transactions.list.data;
export const selectTransactionsLoading = (state: { transactions: TransactionsState }) => 
  state.transactions.loading;
export const selectTransactionsError = (state: { transactions: TransactionsState }) => 
  state.transactions.error;
export const selectTransactionsPagination = (state: { transactions: TransactionsState }) => 
  state.transactions.pagination;
export const selectTransactionsSummary = (state: { transactions: TransactionsState }) => ({
  total: state.transactions.data.data.transactions.total,
  approved: state.transactions.data.data.transactions.approved,
  pending: state.transactions.data.data.transactions.pending,
});