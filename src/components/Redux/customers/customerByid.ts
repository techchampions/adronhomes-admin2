import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "../store"; // Assuming you have a RootState defined in your store

// --- Interfaces for the new response structure ---

// Interface for Property within ActivePlan and CompletedProperty
export interface PropertyInPlan {
  id: number;
  name: string;
  type: number;
  features: string[]; // Changed to string array as per new response
  price: number;
  size: string;
  display_image: string;
  lga: string;
  state: string;
  total_amount: number;
}

// Interface for individual plan data (common for active and completed)
export interface PlanData {
  id: number;
  property_id: number;
  user_id: number;
  property_type: number;
  total_amount: number;
  paid_amount: number;
  remaining_balance: number;
  status: number;
  payment_percentage: number;
  payment_completed_at: string | null;
  created_at: string;
  updated_at: string;
  monthly_duration: string | null;
  payment_type: string;
  end_date: string | null;
  start_date: string | null;
  payment_method: string | null;
  repayment_schedule: string | null;
  next_payment_date: string | null;
  marketer_id: number;
  infrastructure_percentage: number;
  infrastructure_amount: number;
  other_percentage: number;
  other_amount: number;
  remaining_infrastructure_balance: number;
  remaining_other_balance: number;
  paid_infrastructure_amount: number;
  paid_other_amount: number;
  contract_id: string | null;
  number_of_unit: number;
  property: PropertyInPlan; 
}

// Interface for Pagination Links
interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Interface for Paginated Response
export interface PaginatedPlans {
  current_page: number;
  data: PlanData[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

// Interface for the Customer
export interface Customer {
  id: number;
  email: string;
  phone_number: string;
  referral_code: string;
  name: string | null;
  first_name: string;
  last_name: string;
  role: number;
  country: string | null;
  state: string | null;
  lga: string | null;
  otp_verified_at: string;
  email_verified_at: string;
  profile_picture: string | null;
  gender: string | null;
  notification_enabled: number;
  device_id: string;
  address: string | null;
  created_at: string;
  updated_at: string;
  personnel: string;
  contract_id: string | null;
}

// Interface for the overall API response
export interface CustomerByIdResponse {
  status: string;
  message: string;
  total_paid: string;
  pending_paid: number; // Changed to number as per new response
  active_property: number;
  viewed_property: number;
  saved_property: number;
  owned_property: number;
  customer: Customer;
  limit_active_plan: PlanData[]; // Now an array of PlanData
  limit_completed_property: PlanData[]; // Now an array of PlanData
  active_plan: PaginatedPlans; // Now includes pagination
  completed_property: PaginatedPlans; // Now includes pagination
}

// Error Response Interface
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// State Interface for the Redux Slice
interface CustomerByIdState {
  loading: boolean;
  data: CustomerByIdResponse | null;
  error: ErrorResponse | null;
  activePlanPagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };

  completedPropertyPagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

const initialState: CustomerByIdState = {
  loading: false,
  data: null,
  error: null,
  activePlanPagination: {
    currentPage: 1,
    perPage: 20, // Default or initial value
    totalItems: 0,
    totalPages: 1,
  },
  completedPropertyPagination: {
    currentPage: 1,
    perPage: 20, // Default or initial value
    totalItems: 0,
    totalPages: 1,
  },
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Async Thunk for fetching customer by ID ---
export const fetchCustomerById = createAsyncThunk<
  CustomerByIdResponse,
  { customerId: number; activePage?: number; completedPage?: number }, // Added optional page parameters
  { rejectValue: ErrorResponse; state: RootState }
>(
  "customer/fetchCustomerById",
  async ({ customerId, activePage = 1, completedPage = 1 }, { rejectWithValue }) => {
    const token = Cookies.get('token');

    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "Authentication required. Please login.",
      });
    }

    try {
      // Modify the URL to include pagination parameters for active_plan and completed_property
      const response = await axios.get<CustomerByIdResponse>(
        `${BASE_URL}/api/admin/customer/${customerId}?active_page=${activePage}&completed_page=${completedPage}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'identifier': "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            'device_id': "1010l0010l1",
          }
        }
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove('token');
        toast.error("Session expired. Please login again.");
      }

      if (axiosError.response) {
        const errorMessage = axiosError.response.data.message ||
          (axiosError.response.data.errors
            ? Object.values(axiosError.response.data.errors).flat().join(', ')
            : "Failed to fetch customer data");

        toast.error(errorMessage);
        return rejectWithValue(axiosError.response.data);
      }

      const errorMessage = axiosError.request
        ? "No response from server. Please check your network connection."
        : "An unexpected error occurred. Please try again.";

      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
      });
    }
  }
);

// --- Customer By Id Slice ---
const customerByIdSlice = createSlice({
  name: "customerById",
  initialState,
  reducers: {
    resetCustomerByIdState: (state) => {
      state.loading = false;
      state.data = null;
      state.error = null;
      state.activePlanPagination = initialState.activePlanPagination;
      state.completedPropertyPagination = initialState.completedPropertyPagination;
    },
    setActivePlanCurrentPage: (state, action: PayloadAction<number>) => {
      state.activePlanPagination.currentPage = action.payload;
    },
    setCompletedPropertyCurrentPage: (state, action: PayloadAction<number>) => {
      state.completedPropertyPagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action: PayloadAction<CustomerByIdResponse>) => {
        state.loading = false;
        state.data = action.payload;
        // Update pagination for active plans
        state.activePlanPagination = {
          currentPage: action.payload.active_plan.current_page,
          perPage: action.payload.active_plan.per_page,
          totalItems: action.payload.active_plan.total,
          totalPages: action.payload.active_plan.last_page,
        };
        // Update pagination for completed properties
        state.completedPropertyPagination = {
          currentPage: action.payload.completed_property.current_page,
          perPage: action.payload.completed_property.per_page,
          totalItems: action.payload.completed_property.total,
          totalPages: action.payload.completed_property.last_page,
        };
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "An unknown error occurred" };
      });
  },
});

export const {
  resetCustomerByIdState,
  setActivePlanCurrentPage,
  setCompletedPropertyCurrentPage,
} = customerByIdSlice.actions;

export default customerByIdSlice.reducer;

// --- Selectors ---
export const selectCustomerByIdData = (state: RootState) => state.customerById.data;
export const selectCustomerByIdLoading = (state: RootState) => state.customerById.loading;
export const selectCustomerByIdError = (state: RootState) => state.customerById.error;
export const selectActivePlanPagination = (state: RootState) => state.customerById.activePlanPagination;
export const selectCompletedPropertyPagination = (state: RootState) => state.customerById.completedPropertyPagination;
export const selectCustomerActivePlans = (state: RootState) => state.customerById.data?.active_plan.data || [];
export const selectCustomerCompletedProperties = (state: RootState) => state.customerById.data?.completed_property.data || [];