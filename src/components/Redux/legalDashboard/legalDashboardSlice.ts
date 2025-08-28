// legalDashboardSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import api from "../middleware";

export interface Property {
  id: number;
  name: string;
  type: number;
  features: string[];
  price: number;
  size: string;
  display_image: string;
  lga: string;
  state: string;
  total_amount: number;
}

export interface User {
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
  contract_id: string;
  unique_customer_id: string;
}

export interface Contract {
  id: number;
  plan_id: number;
  status: number;
  property_id: number;
  user_id: number;
  unique_contract_id: string;
  contract_customer_id: string;
  contract_business_type: string;
  contract_subscriber_name_1: string;
  contract_subscriber_name_2: string;
  contract_subscriber_name_3: string;
  contract_additional_name: string;
  contract_transaction_date: string | null;
  contract_purpose: string | null;
  contract_promo: string | null;
  contract_quantity: number | null;
  contract_gender: string;
  contract_marital_status: string;
  contract_date_of_birth: string;
  contract_nationality: string;
  contract_residential_address: string;
  contract_town: string;
  contract_state: string;
  contract_country: string;
  contract_sms: string;
  contract_email: string;
  contract_processing_fee: number | null;
  contract_manual_discount: number | null;
  contract_termination_charge: number | null;
  contract_main_marketer: string | null;
  contract_marketer_1: string | null;
  contract_marketer_2: string | null;
  contract_employer: string;
  contract_occupation: string;
  contract_employer_address: string;
  contract_next_of_kin: string;
  contract_next_of_kin_address: string;
  contract_next_of_kin_phone: string | null;
  contract_next_of_kin_relationship: string;
  contract_profile_picture_2: string | null;
  contract_profile_picture: string;
  created_at: string;
  updated_at: string;
  means_of_ids: string;

}

export interface ContractItem {
  unique_contract_id: any;
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
  payment_method: string;
  repayment_schedule: string | null;
  next_payment_date: string | null;
  marketer_id: number | null;
  infrastructure_percentage: number;
  infrastructure_amount: number;
  other_percentage: number;
  other_amount: number;
  remaining_infrastructure_balance: number;
  remaining_other_balance: number;
  paid_infrastructure_amount: number;
  paid_other_amount: number;
  contract_id: number;
  number_of_unit: number;
  initial_payment_percentage: number;
  is_a_contract: number;
  is_allocated: number;
  uploaded_legal: number;
  marketer: any | null;
  property: Property;
  user: User;
  contract: Contract;
}

export interface ContractList {
  current_page: number;
  data: ContractItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: { url: string | null; label: string; active: boolean }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface LegalDashboardResponse {
  success: boolean;
  total_contracts: number;
  total_uploaded_contract: number;
  contract_list: ContractList;
  total_new_contract:number;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// State interface for the slice
interface LegalDashboardState {
  totalContracts: number | null;
  totalUploadedContracts: number | null;
  contractList: ContractItem[] | null;
  loading: boolean;
  error: string | null;
  total_new_contract:number | null;
}

// Initial state
const initialState: LegalDashboardState = {
  totalContracts: null,
  totalUploadedContracts: null,
  contractList: null,
  loading: false,
  error: null,
  total_new_contract: null,
};
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
interface LegalDashboardState {
  totalContracts: number | null;
  totalUploadedContracts: number | null;
  contractList: ContractItem[] | null;
  loading: boolean;
  error: string | null;
    total_new_contract:number | null;
}



// Common function to handle API requests
const fetchContracts = async (endpoint: string, rejectWithValue: any) => {
  const token = Cookies.get("token");

  if (!token) {
    return rejectWithValue({
      message: "No authentication token found. Please login again.",
    });
  }

  try {
    const response = await api.get<LegalDashboardResponse>(
      `${BASE_URL}${endpoint}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
          device_id: "1010l0010l1",
        },
      }
    );
    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;

    if (axiosError.response?.status === 401) {
      Cookies.remove("token");
      toast.error("Session expired. Please login again.");
    }

    if (axiosError.response) {
      return rejectWithValue(
        axiosError.response.data || {
          message: "Failed to fetch legal dashboard data",
        }
      );
    } else if (axiosError.request) {
      return rejectWithValue({
        message:
          "No response from server. Please check your network connection.",
      });
    }

    return rejectWithValue({
      message: "An unexpected error occurred. Please try again.",
    });
  }
};

// Thunk for new contracts (no query params)
export const fetchNewContracts = createAsyncThunk<
  LegalDashboardResponse,
  void,
  {
    rejectValue: ErrorResponse;
  }
>("legalDashboard/fetchNew", async (_, { rejectWithValue }) => {
  return fetchContracts("/api/legal/dashboard", rejectWithValue);
});

// Thunk for uploaded contracts (with legal=1 query param)
export const fetchUploadedContracts = createAsyncThunk<
  LegalDashboardResponse,
  void,
  {
    rejectValue: ErrorResponse;
  }
>("legalDashboard/fetchUploaded", async (_, { rejectWithValue }) => {
  return fetchContracts("/api/legal/dashboard?legal=1", rejectWithValue);
});

// Slice to manage the state
const legalDashboardSlice = createSlice({
  name: "legalDashboard",
  initialState,
  reducers: {
    clearLegalDashboard: (state) => {
      state.totalContracts = null;
      state.totalUploadedContracts = null;
          state.total_new_contract = null;
      state.contractList = null;
      state.error = null;
    },
    resetLegalDashboardState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // New contracts
      .addCase(fetchNewContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchNewContracts.fulfilled,
        (state, action: PayloadAction<LegalDashboardResponse>) => {
          state.loading = false;
          state.totalContracts = action.payload.total_contracts;
            state.total_new_contract = action.payload.total_new_contract;
          state.totalUploadedContracts = action.payload.total_uploaded_contract;
          state.contractList = action.payload.contract_list.data;
          state.error = null;
        }
      )
      .addCase(fetchNewContracts.rejected, (state, action) => {
        state.loading = false;
        state.totalContracts = null;
        state.total_new_contract = null;
          state.totalUploadedContracts = null;
        state.contractList = null;
        state.error =
          action.payload && "message" in action.payload
            ? action.payload.message
            : action.error.message || "Failed to fetch new contracts data";
      })
      // Uploaded contracts
      .addCase(fetchUploadedContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUploadedContracts.fulfilled,
        (state, action: PayloadAction<LegalDashboardResponse>) => {
          state.loading = false;
          state.totalContracts = action.payload.total_contracts;
          state.totalUploadedContracts = action.payload.total_uploaded_contract;
          state.total_new_contract = action.payload.total_new_contract;
          state.contractList = action.payload.contract_list.data;
          state.error = null;
        }
      )
      .addCase(fetchUploadedContracts.rejected, (state, action) => {
        state.loading = false;
        state.totalContracts = null;
        state.totalUploadedContracts = null;
        state.contractList = null;
          state.total_new_contract = null;
        state.error =
          action.payload && "message" in action.payload
            ? action.payload.message
            : action.error.message || "Failed to fetch uploaded contracts data";
      });
  },
});

// Exports
export const { clearLegalDashboard, resetLegalDashboardState } =
  legalDashboardSlice.actions;
export default legalDashboardSlice.reducer;