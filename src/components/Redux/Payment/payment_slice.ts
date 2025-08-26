import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { payments, PaymentsResponse } from "./payment_thunk";

// Define the nested interfaces first
interface PaymentUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface PaymentItem {
  id: number;
  property_id: number | null;
  user_id: number;
  property_plan_id: number | null;
  order_id: number | null;
  amount_paid: number;
  purpose: string;
  payment_type: string;
  status: number; // 0 = pending, 1 = approved, 2 = rejected
  reference: string;
  is_coupon: number;
  created_at: string;
  updated_at: string;
  proof_of_payment: string | null;
  bank_name: string | null;
  description: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface PaymentList {
  current_page: number;
  data: PaymentItem[];
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
}

// The actual payment data structure from the API
export interface PaymentData {
  total: number;
  approved: number;
  pending: number;
  amount_total: number;
  amount_approved: number;
  amount_pending: number;
  list: PaymentList;
}

// The full API response structure


interface PaymentsState {
  data: PaymentData | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
   search: string;
}

const initialState: PaymentsState = {
  data: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    perPage: 50,
    totalItems: 0,
    totalPages: 1,
  },
    search: '',
};

const paymentsSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
      resetErrorMessage: (state) => {
      state.loading = true;
      state.error = null;
    },
       setPaymentSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.pagination.currentPage = 1;
    },
    resetPayments: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(payments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        payments.fulfilled,
        (state, action: PayloadAction<PaymentsResponse>) => {
          state.loading = false;
          state.data = action.payload.data.payments;
          
          // Update pagination from the response
          state.pagination = {
            currentPage: action.payload.data.payments.list.current_page,
            perPage: action.payload.data.payments.list.per_page,
            totalItems: action.payload.data.payments.list.total,
            totalPages: action.payload.data.payments.list.last_page,
          };
        }
      )
      .addCase(payments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch payments";
      });
  },
});

export const { setCurrentPage, resetPayments,resetErrorMessage,setPaymentSearch } = paymentsSlice.actions;

export default paymentsSlice.reducer;

// Selectors
export const selectPaymentsData = (state: { payments: PaymentsState }) =>
  state.payments.data;
export const selectPaymentsLoading = (state: { payments: PaymentsState }) =>
  state.payments.loading;
export const selectPaymentsError = (state: { payments: PaymentsState }) =>
  state.payments.error;
export const selectPaymentsPagination = (state: { payments: PaymentsState }) =>
  state.payments.pagination;
export const selectPaymentList = (state: { payments: PaymentsState }) =>
  state.payments.data?.list.data || [];
export const selectPaymentStats = (state: { payments: PaymentsState }) => ({
  total: state.payments.data?.total || 0,
  approved: state.payments.data?.approved || 0,
  pending: state.payments.data?.pending || 0,
  amount_total: state.payments.data?.amount_total || 0,
  amount_approved: state.payments.data?.amount_approved || 0,
  amount_pending: state.payments.data?.amount_pending || 0,
});
// export const setPaymentSearch = (state: { payments: PaymentsState }) =>
//   state.payments.search;