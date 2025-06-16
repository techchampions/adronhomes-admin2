import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchMarketerDashboard, MarketerDashboardResponse, ReferredUser } from "./Dashboard_thunk";
import { RootState } from "../store";

interface DashboardState {
  data: MarketerDashboardResponse["data"] | null;
  loading: boolean;
  error: string | null;
  referredUsersPagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
  activePlansPagination: {
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
  referredUsersPagination: {
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  },
  activePlansPagination: {
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  },
};

const marketerdashboardSlice = createSlice({
  name: "marketerDashboard",
  initialState,
reducers: {
  clearDashboardData: (state) => {
    state.data = null;
    state.error = null;
    state.loading = false;
    state.referredUsersPagination = initialState.referredUsersPagination;
    state.activePlansPagination = initialState.activePlansPagination;
  },
  setReferredUsersCurrentPage: (state, action: PayloadAction<number>) => {
    state.referredUsersPagination.currentPage = action.payload;
  },
  setActivePlansCurrentPage: (state, action: PayloadAction<number>) => {
    state.activePlansPagination.currentPage = action.payload;
  },
  updateReferredUser: (state, action: PayloadAction<ReferredUser>) => {
    if (state.data?.referred_users.data) {
      const index = state.data.referred_users.data.findIndex(
        (user) => user.id === action.payload.id
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
        
        // Update referred users pagination
        if (action.payload.data.referred_users) {
          state.referredUsersPagination = {
            currentPage: action.payload.data.referred_users.current_page,
            perPage: action.payload.data.referred_users.per_page,
            totalItems: action.payload.data.referred_users.total,
            totalPages: action.payload.data.referred_users.last_page,
          };
        }
        
        // Update active plans pagination
        if (action.payload.data.active_plan) {
          state.activePlansPagination = {
            currentPage: action.payload.data.active_plan.current_page,
            perPage: action.payload.data.active_plan.per_page,
            totalItems: action.payload.data.active_plan.total,
            totalPages: action.payload.data.active_plan.last_page,
          };
        }
      }
    )
    .addCase(fetchMarketerDashboard.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to fetch dashboard data";
      state.data = null;
    });
},
});

export const { 
  clearDashboardData, 
  updateReferredUser, 
  setReferredUsersCurrentPage,
  setActivePlansCurrentPage 
} = marketerdashboardSlice.actions;

export const selectDashboardLoading = (state: { marketerDashboard: DashboardState }) => 
  state.marketerDashboard.loading;
export const selectDashboardError = (state: { marketerDashboard: DashboardState }) => 
  state.marketerDashboard.error;
export const selectDashboardData = (state: { marketerDashboard: DashboardState }) => 
  state.marketerDashboard.data;
export const selectReferredUsers = (state: { marketerDashboard: DashboardState }) => 
  state.marketerDashboard.data?.referred_users.data || [];
export const selectActivePlans = (state: { marketerDashboard: DashboardState }) =>
  state.marketerDashboard.data?.active_plan.data || [];
export const selectMarketerInfo = (state: { marketerDashboard: DashboardState }) =>
  state.marketerDashboard.data?.marketer || null;
export const selectDashboardTotals = (state: { marketerDashboard: DashboardState }) => ({
  totalReferredUsers: state.marketerDashboard.data?.total_referred_users || 0,
  totalPropertyPlans: state.marketerDashboard.data?.total_property_plans || 0,
  totalPaidAmount: state.marketerDashboard.data?.total_paid_amount || 0,
  totalAmount: state.marketerDashboard.data?.total_amount || 0,
  expectedPaymentCount: state.marketerDashboard.data?.expected_payment_count || 0,
});
export const selectReferredUsersPagination = (state: RootState) =>
  state.marketerdashboard.referredUsersPagination;

export const selectActivePlansPagination = (state: RootState) =>
  state.marketerdashboard.activePlansPagination;

export default marketerdashboardSlice.reducer;