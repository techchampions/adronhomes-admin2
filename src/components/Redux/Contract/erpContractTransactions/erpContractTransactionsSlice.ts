// erpContractTransactionsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchERPContractTransactions,
  ERPTransactionsResponse,
  ERPTransaction,
} from "./erpContractTransactionsThunk";

export interface ERPContractTransactionsState {
  loading: boolean;
  success: boolean;
  error: string | null;
  transactions: ERPTransaction[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number;
    to: number;
    firstPageUrl: string;
    lastPageUrl: string;
    nextPageUrl: string | null;
    prevPageUrl: string | null;
    path: string;
    links: Array<{ url: string | null; label: string; active: boolean }>;
  };
  contractId: string | null;
}

const initialState: ERPContractTransactionsState = {
  loading: false,
  success: false,
  error: null,
  transactions: [],
  pagination: {
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0,
    from: 0,
    to: 0,
    firstPageUrl: "",
    lastPageUrl: "",
    nextPageUrl: null,
    prevPageUrl: null,
    path: "",
    links: [],
  },
  contractId: null,
};

const erpContractTransactionsSlice = createSlice({
  name: "erpContractTransactions",
  initialState,
  reducers: {
    resetERPContractTransactionsState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.transactions = [];
      state.pagination = initialState.pagination;
      state.contractId = null;
    },
    clearTransactions: (state) => {
      state.transactions = [];
      state.pagination = initialState.pagination;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchERPContractTransactions.pending, (state, action) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.contractId = action.meta.arg.contractId;
      })
      .addCase(fetchERPContractTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.transactions = action.payload.data.data;
        state.pagination = {
          currentPage: action.payload.data.current_page,
          lastPage: action.payload.data.last_page,
          perPage: action.payload.data.per_page,
          total: action.payload.data.total,
          from: action.payload.data.from,
          to: action.payload.data.to,
          firstPageUrl: action.payload.data.first_page_url,
          lastPageUrl: action.payload.data.last_page_url,
          nextPageUrl: action.payload.data.next_page_url,
          prevPageUrl: action.payload.data.prev_page_url,
          path: action.payload.data.path,
          links: action.payload.data.links,
        };
        state.error = null;
      })
      .addCase(fetchERPContractTransactions.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload?.message || "Failed to fetch contract transactions";
        state.transactions = [];
        state.pagination = initialState.pagination;
      });
  },
});

export const { resetERPContractTransactionsState, clearTransactions, setPage } =
  erpContractTransactionsSlice.actions;

// Selectors
export const selectERPTransactions = (state: {
  erpContractTransactions: ERPContractTransactionsState;
}) => state.erpContractTransactions.transactions;

export const selectERPTransactionsLoading = (state: {
  erpContractTransactions: ERPContractTransactionsState;
}) => state.erpContractTransactions.loading;

export const selectERPTransactionsError = (state: {
  erpContractTransactions: ERPContractTransactionsState;
}) => state.erpContractTransactions.error;

export const selectERPTransactionsSuccess = (state: {
  erpContractTransactions: ERPContractTransactionsState;
}) => state.erpContractTransactions.success;

export const selectERPTransactionsPagination = (state: {
  erpContractTransactions: ERPContractTransactionsState;
}) => state.erpContractTransactions.pagination;

export const selectCurrentContractId = (state: {
  erpContractTransactions: ERPContractTransactionsState;
}) => state.erpContractTransactions.contractId;

// Aggregate selector for total amount calculations
export const selectTransactionsTotalAmount = (state: {
  erpContractTransactions: ERPContractTransactionsState;
}) => {
  return state.erpContractTransactions.transactions.reduce(
    (total, transaction) => {
      return total + Math.abs(transaction.TransactionAmount);
    },
    0,
  );
};

// Selector for grouped transactions by type (Credit/Debit)
export const selectTransactionsByType = (state: {
  erpContractTransactions: ERPContractTransactionsState;
}) => {
  const credit = state.erpContractTransactions.transactions.filter(
    (t) => t.TransactionDRCR === "C",
  );
  const debit = state.erpContractTransactions.transactions.filter(
    (t) => t.TransactionDRCR === "D",
  );

  return {
    credit,
    debit,
    creditTotal: credit.reduce(
      (sum, t) => sum + Math.abs(t.TransactionAmount),
      0,
    ),
    debitTotal: debit.reduce(
      (sum, t) => sum + Math.abs(t.TransactionAmount),
      0,
    ),
  };
};

export default erpContractTransactionsSlice.reducer;
