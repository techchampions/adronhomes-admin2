import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { fetchMarketerDashboard, MarketerDashboardResponse, UpcomingPayment, User } from "./CareerDashboard_thunk";

interface DashboardState {
  data: MarketerDashboardResponse["data"] | null;
  loading: boolean;
  error: string | null;
  upcomingPaymentsPagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
  referredUsersPagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
  upcomingPaymentsPagination: {
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  },
  referredUsersPagination: {
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  },
};

const careerDashboardSlice = createSlice({
  name: "careerDashboard",
  initialState,
  reducers: {
    clearDashboardData: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
      state.upcomingPaymentsPagination = initialState.upcomingPaymentsPagination;
      state.referredUsersPagination = initialState.referredUsersPagination;
    },
    setUpcomingPaymentsCurrentPage: (state, action: PayloadAction<number>) => {
      state.upcomingPaymentsPagination.currentPage = action.payload;
    },
    setReferredUsersCurrentPage: (state, action: PayloadAction<number>) => {
      state.referredUsersPagination.currentPage = action.payload;
    },
    updateUpcomingPayment: (state, action: PayloadAction<UpcomingPayment>) => {
      if (state.data?.upcoming_payment_customers.data) {
        const index = state.data.upcoming_payment_customers.data.findIndex(
          (payment:any) => payment.id === action.payload.id
        );
        if (index !== -1) {
          state.data.upcoming_payment_customers.data[index] = action.payload;
        }
      }
    },
    updateReferredUser: (state, action: PayloadAction<User>) => {
      if (state.data?.referred_users.data) {
        const index = state.data.referred_users.data.findIndex(
          (user:any) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.data.referred_users.data[index] = action.payload;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketerDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMarketerDashboard.fulfilled,
        (state, action: PayloadAction<MarketerDashboardResponse>) => {
          state.loading = false;
          state.data = action.payload.data;

          // Update upcoming payments pagination
          if (action.payload.data.upcoming_payment_customers) {
            state.upcomingPaymentsPagination = {
              currentPage: action.payload.data.upcoming_payment_customers.current_page,
              perPage: action.payload.data.upcoming_payment_customers.per_page,
              totalItems: action.payload.data.upcoming_payment_customers.total,
              totalPages: action.payload.data.upcoming_payment_customers.last_page,
            };
          }

          // Update referred users pagination
          if (action.payload.data.referred_users) {
            state.referredUsersPagination = {
              currentPage: action.payload.data.referred_users.current_page,
              perPage: action.payload.data.referred_users.per_page,
              totalItems: action.payload.data.referred_users.total,
              totalPages: action.payload.data.referred_users.last_page,
            };
          }
        }
      )
      .addCase(fetchMarketerDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch dashboard data";
        state.data = null;
      });
  },
});

export const {
  clearDashboardData,
  setUpcomingPaymentsCurrentPage,
  setReferredUsersCurrentPage,
  updateUpcomingPayment,
  updateReferredUser,
} = careerDashboardSlice.actions;

// Selectors
export const selectDashboardLoading = (state: RootState) =>
  state.careerDashboard.loading;
export const selectDashboardError = (state: RootState) =>
  state.careerDashboard.error;
export const selectDashboardData = (state: RootState) =>
  state.careerDashboard.data;

export const selectTotalReferredUsers = (state: RootState) =>
  state.careerDashboard.data?.total_referred_users || 0;
export const selectTotalCompletedPropertyPlans = (state: RootState) =>
  state.careerDashboard.data?.total_completed_property_plans || 0;
export const selectTotalActivePropertyPlans = (state: RootState) =>
  state.careerDashboard.data?.total_active_property_plans || 0;
export const selectUpcomingPaymentCount = (state: RootState) =>
  state.careerDashboard.data?.upcoming_payment_count || 0;

export const selectUpcomingPayments = (state: RootState) =>
  state.careerDashboard.data?.upcoming_payment_customers.data || [];
export const selectReferredUsers = (state: RootState) =>
  state.careerDashboard.data?.referred_users.data || [];
export const selectMarketerInfo = (state: RootState) =>
  state.careerDashboard.data?.marketer || null;

export const selectUpcomingPaymentsPagination = (state: RootState) =>
  state.careerDashboard.upcomingPaymentsPagination;
export const selectReferredUsersPagination = (state: RootState) =>
  state.careerDashboard.referredUsersPagination;

export default careerDashboardSlice.reducer;