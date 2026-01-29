import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchMarketerDashboardpersonnel,
  MarketerDashboardResponse,
  PropertyPlan,
  UpcomingPayment,
} from "./marketer_personnel_thunk";;
import { RootState } from "../store";

interface DashboardState {
  data: MarketerDashboardResponse["data"] | null;
  loading: boolean;
  error: string | null;

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
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
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
};

const marketerdashboardSlice = createSlice({
  name: "marketerdashboardpersonnel",
  initialState,
  reducers: {
    clearDashboardData: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
      state.completedPlansPagination = initialState.completedPlansPagination;
      state.activePlansPagination = initialState.activePlansPagination;
      state.upcomingPaymentsPagination =
        initialState.upcomingPaymentsPagination;
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

    updateUpcomingPayment: (
      state,
      action: PayloadAction<UpcomingPayment>
    ) => {
      if (state.data?.upcoming_payment_customers.data) {
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketerDashboardpersonnel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMarketerDashboardpersonnel.fulfilled,
        (state, action: PayloadAction<MarketerDashboardResponse>) => {
          state.loading = false;
          state.data = action.payload.data;

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
        }
      )
      .addCase(fetchMarketerDashboardpersonnel.rejected, (state, action) => {
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
  updateCompletedPropertyPlan,
  updateActivePropertyPlan,
} = marketerdashboardSlice.actions;

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

export const selectUpcomingPayments = (state: RootState) =>
  state.marketerdashboard.data?.upcoming_payment_customers?.data || [];
export const selectMarketerInfo = (state: RootState) =>
  state.marketerdashboard.data?.marketer || null;
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

export default marketerdashboardSlice.reducer;