// userPaymentsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PaymentListData, PaymentsResponse } from "./type";
import { fetchUserPayments } from "./usePaymentThunk";


interface PaymentPaginationState {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  statusFilter: number | null;
  searchFilter: string | null;
}

interface UserPaymentsState {
  data: PaymentListData | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  pagination: PaymentPaginationState;
}

const initialState: UserPaymentsState = {
  data: null,
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

const userPaymentsSlice = createSlice({
  name: "userPaymentsbyid",
  initialState,
  reducers: {
    resetUserPaymentsState: () => initialState,
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
      .addCase(fetchUserPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        fetchUserPayments.fulfilled,
        (state, action: PayloadAction<PaymentsResponse>) => {
          state.loading = false;
          state.success = action.payload.status === "success";
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
      .addCase(fetchUserPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch user payments";
        state.success = false;
      });
  },
});

export const { 
  resetUserPaymentsState, 
  setCurrentPage, 
  setStatusFilter, 
  setSearchFilter,
  setPerPage
} = userPaymentsSlice.actions;

export default userPaymentsSlice.reducer;

// Selectors
export const selectUserPaymentsPagination = (state: { userPayments: UserPaymentsState }) =>
  state.userPayments.pagination;

export const selectUserPaymentsList = (state: { userPayments: UserPaymentsState }) =>
  state.userPayments.data?.data;

export const selectUserPaymentsLoading = (state: { userPayments: UserPaymentsState }) =>
  state.userPayments.loading;

export const selectUserPaymentsError = (state: { userPayments: UserPaymentsState }) =>
  state.userPayments.error;

export const selectUserPaymentsSuccess = (state: { userPayments: UserPaymentsState }) =>
  state.userPayments.success;