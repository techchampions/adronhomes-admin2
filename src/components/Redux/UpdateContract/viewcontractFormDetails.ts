import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";
import { toast } from "react-toastify";

// Define interfaces for the response
export interface ContractData {
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
  contract_transaction_date: string;
  contract_purpose: string;
  contract_promo: string;
  contract_quantity: number;
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
  contract_processing_fee: number;
  contract_manual_discount: number;
  contract_termination_charge: number;
  contract_main_marketer: number;
  contract_marketer_1: number;
  contract_marketer_2: number;
  contract_employer: string;
  contract_occupation: string;
  contract_employer_address: string;
  contract_next_of_kin: string | null;
  contract_next_of_kin_address: string;
  contract_next_of_kin_phone: string;
  contract_next_of_kin_relationship: string;
  contract_management_document: string | null;
  contract_profile_picture: string;
  created_at: string;
  updated_at: string;
}

export interface GetContractResponse {
  success: boolean;
  contract: ContractData;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Get the base URL from environment variables
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async Thunk for fetching a single contract
export const getContract = createAsyncThunk<
  GetContractResponse,
  any, // contractId as argument
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "contract/getContract",
  async (contractId, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await axios.get<GetContractResponse>(
        `${BASE_URL}/api/admin/contract/${contractId}`,
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
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
        toast.error("Session expired. Please login again.");
      }

      if (axiosError.response) {
        toast.error(
          axiosError.response.data.message || "Failed to fetch contract."
        );
        return rejectWithValue({
          message: axiosError.response.data.message || "Failed to fetch contract.",
          errors: axiosError.response.data.errors,
        });
      } else if (axiosError.request) {
        toast.error(
          "No response from server. Please check your network connection."
        );
        return rejectWithValue({
          message: "No response from server. Please check your network connection.",
        });
      }

      toast.error("An unexpected error occurred. Please try again.");
      return rejectWithValue({
        message: "An unexpected error occurred. Please try again.",
      });
    }
  }
);

//  state for the contract slice
interface ContractState {
  contract: ContractData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ContractState = {
  contract: null,
  loading: false,
  error: null,
};

//  contract slice
const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    clearContractState: (state) => {
      state.contract = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getContract.fulfilled,
        (state, action: PayloadAction<GetContractResponse>) => {
          state.loading = false;
          state.contract = action.payload.contract;
          state.error = null;
        }
      )
      .addCase(
        getContract.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || "Failed to fetch contract.";
          state.contract = null;
        }
      );
  },
});

export const { clearContractState } = contractSlice.actions;

export default contractSlice.reducer;