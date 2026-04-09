import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchMarketerDashboard,
  MarketerDashboardResponse,
  PropertyPlan,
  UpcomingPayment,
} from "./Dashboard_thunk";
import { RootState } from "../store";

// Add click tracking interface
interface ClickTracking {
  total_clicks_today: number;
  total_clicks_this_week: number;
  total_clicks_month: number;
  total_clicks: number;
}

interface DashboardState {
  data: MarketerDashboardResponse["data"] | null;
  loading: boolean;
  error: string | null;

  // Add click tracking to state
  clickTracking: ClickTracking;

  completedPlansPagination: {
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
  upcomingPaymentsPagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
  pendingPlansPagination: {  // Add pending plans pagination
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
  clickTracking: {
    total_clicks_today: 0,
    total_clicks_this_week: 0,
    total_clicks_month: 0,
    total_clicks: 0,
  },
  completedPlansPagination: {
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
  upcomingPaymentsPagination: {
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  },
  pendingPlansPagination: {  // Initialize pending plans pagination
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  },
};

const marketerdashboardSlice = createSlice({
  name: "marketerdashboard",
  initialState,
  reducers: {
    clearDashboardData: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
      state.clickTracking = initialState.clickTracking;
      state.completedPlansPagination = initialState.completedPlansPagination;
      state.activePlansPagination = initialState.activePlansPagination;
      state.upcomingPaymentsPagination =
        initialState.upcomingPaymentsPagination;
      state.pendingPlansPagination = initialState.pendingPlansPagination;
    },

    setCompletedPlansCurrentPage: (state, action: PayloadAction<number>) => {
      state.completedPlansPagination.currentPage = action.payload;
    },
    setActivePlansCurrentPage: (state, action: PayloadAction<number>) => {
      state.activePlansPagination.currentPage = action.payload;
    },
    setUpcomingPaymentsCurrentPage: (state, action: PayloadAction<number>) => {
      state.upcomingPaymentsPagination.currentPage = action.payload;
    },
    setPendingPlansCurrentPage: (state, action: PayloadAction<number>) => {
      state.pendingPlansPagination.currentPage = action.payload;
    },

    updateUpcomingPayment: (
      state,
      action: PayloadAction<UpcomingPayment>
    ) => {
      if (state.data?.upcoming_payment_customers?.data) {
        const index = state.data.upcoming_payment_customers.data.findIndex(
          (payment) => payment.id === action.payload.id
        );
        if (index !== -1) {
          state.data.upcoming_payment_customers.data[index] = action.payload;
        }
      }
    },

    updateCompletedPropertyPlan: (
      state,
      action: PayloadAction<PropertyPlan>
    ) => {
      if (state.data?.completed_property_plans?.data) {
        const index = state.data.completed_property_plans.data.findIndex(
          (plan) => plan.id === action.payload.id
        );
        if (index !== -1) {
          state.data.completed_property_plans.data[index] = action.payload;
        }
      }
    },

    updateActivePropertyPlan: (state, action: PayloadAction<PropertyPlan>) => {
      if (state.data?.active_property_plans?.data) {
        const index = state.data.active_property_plans.data.findIndex(
          (plan) => plan.id === action.payload.id
        );
        if (index !== -1) {
          state.data.active_property_plans.data[index] = action.payload;
        }
      }
    },

    updatePendingPropertyPlan: (state, action: PayloadAction<PropertyPlan>) => {
      if (state.data?.pending_property_plans?.data) {
        const index = state.data.pending_property_plans.data.findIndex(
          (plan) => plan.id === action.payload.id
        );
        if (index !== -1) {
          state.data.pending_property_plans.data[index] = action.payload;
        }
      }
    },

    // Add action to update click tracking
    updateClickTracking: (state, action: PayloadAction<Partial<ClickTracking>>) => {
      state.clickTracking = { ...state.clickTracking, ...action.payload };
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

          // Update click tracking from API response
          state.clickTracking = {
            total_clicks_today: action.payload.data.total_clicks_today || 0,
            total_clicks_this_week: action.payload.data.total_clicks_this_week || 0,
            total_clicks_month: action.payload.data.total_clicks_month || 0,
            total_clicks: action.payload.data.total_clicks || 0,
          };

          // Update completed property plans pagination
          if (action.payload.data.completed_property_plans) {
            state.completedPlansPagination = {
              currentPage:
                action.payload.data.completed_property_plans.current_page,
              perPage: action.payload.data.completed_property_plans.per_page,
              totalItems: action.payload.data.completed_property_plans.total,
              totalPages:
                action.payload.data.completed_property_plans.last_page,
            };
          }

          // Update active property plans pagination
          if (action.payload.data.active_property_plans) {
            state.activePlansPagination = {
              currentPage:
                action.payload.data.active_property_plans.current_page,
              perPage: action.payload.data.active_property_plans.per_page,
              totalItems: action.payload.data.active_property_plans.total,
              totalPages: action.payload.data.active_property_plans.last_page,
            };
          }

          // Update upcoming payments pagination
          if (action.payload.data.upcoming_payment_customers) {
            state.upcomingPaymentsPagination = {
              currentPage:
                action.payload.data.upcoming_payment_customers.current_page,
              perPage: action.payload.data.upcoming_payment_customers.per_page,
              totalItems: action.payload.data.upcoming_payment_customers.total,
              totalPages:
                action.payload.data.upcoming_payment_customers.last_page,
            };
          }

          // Update pending property plans pagination
          if (action.payload.data.pending_property_plans) {
            state.pendingPlansPagination = {
              currentPage:
                action.payload.data.pending_property_plans.current_page,
              perPage: action.payload.data.pending_property_plans.per_page,
              totalItems: action.payload.data.pending_property_plans.total,
              totalPages: action.payload.data.pending_property_plans.last_page,
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
  updateUpcomingPayment,
  setCompletedPlansCurrentPage,
  setActivePlansCurrentPage,
  setUpcomingPaymentsCurrentPage,
  setPendingPlansCurrentPage,
  updateCompletedPropertyPlan,
  updateActivePropertyPlan,
  updatePendingPropertyPlan,
  updateClickTracking,
} = marketerdashboardSlice.actions;

// Selectors
export const selectDashboardLoading = (state: RootState) =>
  state.marketerdashboard.loading;
export const selectDashboardError = (state: RootState) =>
  state.marketerdashboard.error;
export const selectDashboardData = (state: RootState) =>
  state.marketerdashboard.data;

export const selectCompletedPropertyPlans = (state: RootState) =>
  state.marketerdashboard.data?.completed_property_plans?.data || [];
export const selectActivePropertyPlans = (state: RootState) =>
  state.marketerdashboard.data?.active_property_plans?.data || [];
export const selectPendingPropertyPlans = (state: RootState) =>
  state.marketerdashboard.data?.pending_property_plans?.data || [];

export const selectUpcomingPayments = (state: RootState) =>
  state.marketerdashboard.data?.upcoming_payment_customers?.data || [];
export const selectMarketerInfo = (state: RootState) =>
  state.marketerdashboard.data?.marketer || null;

// Click tracking selectors
export const selectClickTracking = (state: RootState) =>
  state.marketerdashboard.clickTracking;
export const selectTotalClicksToday = (state: RootState) =>
  state.marketerdashboard.clickTracking.total_clicks_today;
export const selectTotalClicksThisWeek = (state: RootState) =>
  state.marketerdashboard.clickTracking.total_clicks_this_week;
export const selectTotalClicksMonth = (state: RootState) =>
  state.marketerdashboard.clickTracking.total_clicks_month;
export const selectTotalClicks = (state: RootState) =>
  state.marketerdashboard.clickTracking.total_clicks;

export const selectDashboardTotals = (state: RootState) => ({
  totalPaidAmount: state.marketerdashboard.data?.total_paid_amount || 0,
  totalCompletedPropertyPlans:
    state.marketerdashboard.data?.total_completed_property_plans || 0,
  totalActivePropertyPlans:
    state.marketerdashboard.data?.total_active_property_plans || 0,
  upcomingPaymentCount:
    state.marketerdashboard.data?.upcoming_payment_count || 0,
});

export const selectCompletedPlansPagination = (state: RootState) =>
  state.marketerdashboard.completedPlansPagination;
export const selectActivePlansPagination = (state: RootState) =>
  state.marketerdashboard.activePlansPagination;
export const selectUpcomingPaymentsPagination = (state: RootState) =>
  state.marketerdashboard.upcomingPaymentsPagination;
export const selectPendingPlansPagination = (state: RootState) =>
  state.marketerdashboard.pendingPlansPagination;

export default marketerdashboardSlice.reducer;