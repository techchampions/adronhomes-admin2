import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "../store";
import api from "../middleware";

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
  wallet_amount: number;
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
  unique_customer_id: any;
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
  unique_customer_id: any;
}

// Interface for Citta Contract Paginated Response
export interface CittaContract {
  current_page: number;
  data: ContractData[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}


export interface ContractData {
  id: number;
  customerName: string;
  customerCode: string;
  dateOfBirth: string;
  userId: number;
  propertyId: number | null;
  contractId: string;
  customerAddress: string;
  contractDate: string;
  propertyEstate: string;
  propertyName: string;
  customerTown: string;
  customerState: string;
  customerEmail: string;
  customerPhone: string;
  customerSMSPhone: string;
  customerTitle: string;
  customerGender: "Male" | "Female" | "Other";
  customerMarital: "Single" | "Married" | "Divorced" | "Widowed" | string;
  fullPayment: "Y" | "N";
  fullPaymentDate: string | null;
  quantity: string;
  propertyCost: string;
  propertyDiscount: string;
  propertyNetValue: string;
  propertyTenor: number;
  firstPaymentDate: string;
  lastPaymentDate: string;
  propertyBranch: string;
  currentbalance: string;
  created_at: string;
  updated_at: string;
}

export interface WalletAmount {
  id: number;
  account_name: string;
  account_number: string;
  account_bank: string;
  account_balance: number;
  user_id: number;
  is_deactivated: number;
  is_generated: number;
  created_at: string;
  updated_at: string;
}

// Interface for the overall API response
export interface CustomerByIdResponse {
  citta_contract: CittaContract;
  wallet_amount: WalletAmount;
  status: string;
  message: string;
  total_paid: string;
  pending_paid: number;
  active_property: number;
  viewed_property: number;
  saved_property: number;
  owned_property: number;
  customer: Customer;
  limit_active_plan: PlanData[];
  limit_completed_property: PlanData[];
  active_plan: PaginatedPlans;
  completed_property: PaginatedPlans;
  unique_customer_id: any;
}

const savedUsername = localStorage.getItem("username") || "";

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
  cittaContractPagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
  username: string;
  cittaContractLoading: boolean;
  cittaContractError: ErrorResponse | null;
}

const initialState: CustomerByIdState = {
  loading: false,
  data: null,
  error: null,
  activePlanPagination: {
    currentPage: 1,
    perPage: 20,
    totalItems: 0,
    totalPages: 1,
  },
  completedPropertyPagination: {
    currentPage: 1,
    perPage: 20,
    totalItems: 0,
    totalPages: 1,
  },
  cittaContractPagination: {
    currentPage: 1,
    perPage: 10, // Default per page for citta contracts
    totalItems: 0,
    totalPages: 1,
  },
  username: savedUsername,
  cittaContractLoading: false,
  cittaContractError: null,
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Async Thunk for fetching customer by ID ---
export const fetchCustomerById = createAsyncThunk<
  CustomerByIdResponse,
  {
    customerId: number;
    activePage?: number;
    completedPage?: number;
    cittaContractPage?: number; // New parameter for citta contracts pagination
  },
  { rejectValue: ErrorResponse; state: RootState }
>(
  "customer/fetchCustomerById",
  async (
    {
      customerId,
      activePage = 1,
      completedPage = 1,
      cittaContractPage = 1, // Default to page 1
    },
    { rejectWithValue },
  ) => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "Authentication required. Please login.",
      });
    }

    try {
      // Modify the URL to include pagination parameters for all sections
      const response = await api.get<CustomerByIdResponse>(
        `${BASE_URL}/api/admin/customer/${customerId}?active_page=${activePage}&completed_page=${completedPage}&citta_page=${cittaContractPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
        },
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
        toast.error("Session expired. Please login again.");
      }

      if (axiosError.response) {
        const errorMessage =
          axiosError.response.data.message ||
          (axiosError.response.data.errors
            ? Object.values(axiosError.response.data.errors).flat().join(", ")
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
  },
);

// --- Async Thunk for fetching only citta contracts (if needed separately) ---
export const fetchCittaContracts = createAsyncThunk<
  CittaContract,
  {
    customerId: number;
    page?: number;
    perPage?: number;
  },
  { rejectValue: ErrorResponse; state: RootState }
>(
  "customer/fetchCittaContracts",
  async ({ customerId, page = 1, perPage = 10 }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "Authentication required. Please login.",
      });
    }

    try {
      // If your API has a separate endpoint for citta contracts
      const response = await api.get<CittaContract>(
        `${BASE_URL}/api/admin/customer/${customerId}/citta-contracts?page=${page}&per_page=${perPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
        },
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
        toast.error("Session expired. Please login again.");
      }

      if (axiosError.response) {
        const errorMessage =
          axiosError.response.data.message ||
          (axiosError.response.data.errors
            ? Object.values(axiosError.response.data.errors).flat().join(", ")
            : "Failed to fetch citta contracts");

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
  },
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
      state.completedPropertyPagination =
        initialState.completedPropertyPagination;
      state.cittaContractPagination = initialState.cittaContractPagination;
      state.cittaContractLoading = false;
      state.cittaContractError = null;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      localStorage.removeItem("username");
      localStorage.setItem("username", action.payload);
      state.username = action.payload;
    },
    setActivePlanCurrentPage: (state, action: PayloadAction<number>) => {
      state.activePlanPagination.currentPage = action.payload;
    },
    setCompletedPropertyCurrentPage: (state, action: PayloadAction<number>) => {
      state.completedPropertyPagination.currentPage = action.payload;
    },
    setCittaContractCurrentPage: (state, action: PayloadAction<number>) => {
      state.cittaContractPagination.currentPage = action.payload;
    },
    setCittaContractPerPage: (state, action: PayloadAction<number>) => {
      state.cittaContractPagination.perPage = action.payload;
      state.cittaContractPagination.currentPage = 1; // Reset to first page when changing per page
    },
    resetCittaContractPagination: (state) => {
      state.cittaContractPagination = initialState.cittaContractPagination;
    },
    updateCittaContractData: (state, action: PayloadAction<CittaContract>) => {
      if (state.data) {
        state.data.citta_contract = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Main customer fetch
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCustomerById.fulfilled,
        (state, action: PayloadAction<CustomerByIdResponse>) => {
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

          // Update pagination for citta contracts
          state.cittaContractPagination = {
            currentPage: action.payload.citta_contract.current_page,
            perPage: action.payload.citta_contract.per_page,
            totalItems: action.payload.citta_contract.total,
            totalPages: action.payload.citta_contract.last_page,
          };
        },
      )
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "An unknown error occurred",
        };
      })

      // Separate citta contracts fetch
      .addCase(fetchCittaContracts.pending, (state) => {
        state.cittaContractLoading = true;
        state.cittaContractError = null;
      })
      .addCase(
        fetchCittaContracts.fulfilled,
        (state, action: PayloadAction<CittaContract>) => {
          state.cittaContractLoading = false;

          // Update citta contracts in main data if exists
          if (state.data) {
            state.data.citta_contract = action.payload;
          }

          // Update pagination for citta contracts
          state.cittaContractPagination = {
            currentPage: action.payload.current_page,
            perPage: action.payload.per_page,
            totalItems: action.payload.total,
            totalPages: action.payload.last_page,
          };
        },
      )
      .addCase(fetchCittaContracts.rejected, (state, action) => {
        state.cittaContractLoading = false;
        state.cittaContractError = action.payload || {
          message: "An unknown error occurred",
        };
      });
  },
});

export const {
  resetCustomerByIdState,
  setActivePlanCurrentPage,
  setCompletedPropertyCurrentPage,
  setCittaContractCurrentPage,
  setCittaContractPerPage,
  resetCittaContractPagination,
  updateCittaContractData,
  setUsername,
} = customerByIdSlice.actions;

export default customerByIdSlice.reducer;

// --- Selectors ---
export const selectCustomerByIdData = (state: RootState) =>
  state.customerById.data;
export const selectCustomerByIdLoading = (state: RootState) =>
  state.customerById.loading;
export const selectCustomerByIdError = (state: RootState) =>
  state.customerById.error;
export const selectActivePlanPagination = (state: RootState) =>
  state.customerById.activePlanPagination;
export const selectCompletedPropertyPagination = (state: RootState) =>
  state.customerById.completedPropertyPagination;
export const selectCittaContractPagination = (state: RootState) =>
  state.customerById.cittaContractPagination;
export const selectCittaContractLoading = (state: RootState) =>
  state.customerById.cittaContractLoading;
export const selectCittaContractError = (state: RootState) =>
  state.customerById.cittaContractError;
export const selectCustomerActivePlans = (state: RootState) =>
  state.customerById.data?.active_plan.data || [];
export const selectCustomerCompletedProperties = (state: RootState) =>
  state.customerById.data?.completed_property.data || [];
export const selectCustomerCittaContracts = (state: RootState) =>
  state.customerById.data?.citta_contract.data || [];
export const selectCustomerUsername = (state: RootState) =>
  state.customerById.username;
