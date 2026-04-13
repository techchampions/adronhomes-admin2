import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractPayment, fetchContractPayments, PaymentsStats, ContractsList, PaymentsResponse } from './contract_payments_thunk';

export interface ContractPaymentState {
  stats: PaymentsStats | null;
  contracts: ContractsList | null;
  payments: ContractPayment[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
  };
  search: string;
  activeTab: string; // 'All Payments', 'wallet', 'interswitch'
}

const initialState: ContractPaymentState = {
  stats: null,
  contracts: null,
  payments: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 20,
  },
  search: '',
  activeTab: 'All Payments',
};

const contractPaymentSlice = createSlice({
  name: 'contractPayments',
  initialState,
  reducers: {
    clearContractPaymentsError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.perPage = action.payload;
      state.pagination.currentPage = 1;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.pagination.currentPage = 1;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
      state.pagination.currentPage = 1;
    },
    clearContractPayments: (state) => {
      state.stats = null;
      state.contracts = null;
      state.payments = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        perPage: 20,
      };
      state.search = '';
      state.activeTab = 'All Payments';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContractPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContractPayments.fulfilled, (state, action: PayloadAction<PaymentsResponse>) => {
        state.loading = false;
        state.stats = action.payload.data.stats;
        state.contracts = action.payload.data.contracts;
        state.payments = action.payload.data.contracts.data;
        
        // Update pagination info from contracts
        state.pagination = {
          currentPage: action.payload.data.contracts.current_page,
          totalPages: action.payload.data.contracts.last_page,
          totalItems: action.payload.data.contracts.total,
          perPage: action.payload.data.contracts.per_page,
        };
      })
      .addCase(fetchContractPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch contract payments';
      });
  },
});

// Export actions
export const { 
  clearContractPaymentsError, 
  setCurrentPage,
  setPerPage,
  setSearchFilter,
  setActiveTab,
  clearContractPayments 
} = contractPaymentSlice.actions;

export default contractPaymentSlice.reducer;

// Export selectors
export const selectAllContractPayments = (state: { contractPayments: ContractPaymentState }) => 
  state.contractPayments.payments;

export const selectContractPaymentsStats = (state: { contractPayments: ContractPaymentState }) =>
  state.contractPayments.stats;

export const selectContractPaymentsContracts = (state: { contractPayments: ContractPaymentState }) =>
  state.contractPayments.contracts;

export const selectContractPaymentsLoading = (state: { contractPayments: ContractPaymentState }) =>
  state.contractPayments.loading;

export const selectContractPaymentsError = (state: { contractPayments: ContractPaymentState }) =>
  state.contractPayments.error;

export const selectContractPaymentsPagination = (state: { contractPayments: ContractPaymentState }) =>
  state.contractPayments.pagination;

export const selectContractPaymentsSearch = (state: { contractPayments: ContractPaymentState }) =>
  state.contractPayments.search;

export const selectActiveTab = (state: { contractPayments: ContractPaymentState }) =>
  state.contractPayments.activeTab;