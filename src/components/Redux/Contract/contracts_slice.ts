import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchContracts, ContractsResponse, Contract } from "./contracts_thunk";

interface ContractPaginationState {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  statusFilter: number | null;
  searchFilter: string | null;
}

interface ContractsState {
  data: {
    current_page: number;
    data: Contract[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
  } | null;
  totalContracts: number | null;
  totalInvoice: number | null;
  totalPaidContract: number | null;
  totalUnpaidContract: number | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  pagination: ContractPaginationState;
}

const initialState: ContractsState = {
  data: null,
  totalContracts: null,
  totalInvoice: null,
  totalPaidContract: null,
  totalUnpaidContract: null,
  loading: false,
  error: null,
  success: false,
  pagination: {
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
    statusFilter: null,
    searchFilter: null,
  },
};

const contractsSlice = createSlice({
  name: "contracts",
  initialState,
  reducers: {
    resetContractsState: () => initialState,
    setCurrentPage: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.current_page = action.payload;
      }
      state.pagination.currentPage = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<number | null>) => {
      state.pagination.statusFilter = action.payload;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        fetchContracts.fulfilled,
        (state, action: PayloadAction<ContractsResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.data = action.payload.contract_list;
          state.totalContracts = action.payload.total_contracts;
          state.totalInvoice = action.payload.total_invoice;
          state.totalPaidContract = action.payload.total_paid_contract;
          state.totalUnpaidContract = action.payload.total_unpaid_contract;
          
          state.pagination = {
            ...state.pagination,
            currentPage: action.payload.contract_list.current_page,
            perPage: action.payload.contract_list.per_page,
            totalItems: action.payload.contract_list.total,
            totalPages: action.payload.contract_list.last_page,
          };
        }
      )
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch contracts";
        state.success = false;
      });
  },
});

export const { 
  resetContractsState, 
  setCurrentPage, 
  setStatusFilter, 
  setSearchFilter,
  setPerPage
} = contractsSlice.actions;

export default contractsSlice.reducer;

// selectors in contracts_slice.ts

export const selectContractPagination = (state: { getcontracts: ContractsState }) =>
  state.getcontracts.pagination;

export const selectContractList = (state: { getcontracts: ContractsState }) =>
  state.getcontracts.data?.data;

export const selectTotalContracts = (state: { getcontracts: ContractsState }) =>
  state.getcontracts.totalContracts;

export const selectTotalInvoice = (state: { getcontracts: ContractsState }) =>
  state.getcontracts.totalInvoice;

export const selectTotalPaidContract = (state: { getcontracts: ContractsState }) =>
  state.getcontracts.totalPaidContract;

export const selectTotalUnpaidContract = (state: { getcontracts: ContractsState }) =>
  state.getcontracts.totalUnpaidContract;

export const selectLoading = (state: { getcontracts: ContractsState }) =>
  state.getcontracts.loading;

export const selectError = (state: { getcontracts: ContractsState }) =>
  state.getcontracts.error;