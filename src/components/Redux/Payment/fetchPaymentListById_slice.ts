import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPaymentListById } from './payment_thunk';

export interface Payment {
  id: number;
  property_id: number;
  user_id: number;
  plan_id: number;
  amount: number;
  status: number;
  description: string;
  transaction_method: string;
  created_at: string;
  updated_at: string;
  marketer_id: number;


}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface SinglePaymentListResponse {
  success: boolean;
  payment_list: {
    current_page: number;
    data: Payment[];
    first_page_url: string;
    from: number;
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
    to: number;
    total: number;
  };
}
interface PaymentListState {
  data: Payment[];
  loading: boolean;
  error: string | null;
   pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
  };

}

const initialState: PaymentListState = {
  data: [],
  loading: false,
  error: null,
   pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 10,
  },
};

const paymentListSlice = createSlice({
  name: 'paymentList',
  initialState,
  reducers: {
    setPaymentListPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    clearPaymentList: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentListById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentListById.fulfilled, (state, action: PayloadAction<SinglePaymentListResponse>) => {
        state.loading = false;
        state.data = action.payload.payment_list.data;
      })
      .addCase(fetchPaymentListById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch payment list';
        state.data = [];
      });
  },
});

export const { setPaymentListPage, clearPaymentList } = paymentListSlice.actions;
export default paymentListSlice.reducer;

export const selectPaymentListPagination = (state: { paymentList: PaymentListState }) =>
  state.paymentList.pagination;