import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store"; // Assuming your store is in ../store.ts
import { toast } from "react-toastify"; // Assuming you are using react-toastify for notifications

// Define interfaces for the request and response
export interface UpdateContractPayload {
  unique_contract_id: any;
  contract_customer_id: any;
}

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
  contract_next_of_kin: string;
  contract_next_of_kin_address: string;
  contract_next_of_kin_phone: string;
  contract_next_of_kin_relationship: string;
  contract_management_document: string;
  contract_profile_picture: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateContractResponse {
  status: boolean;
  data: ContractData;
  message: string;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Get the base URL from environment variables
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async Thunk for updating a contract
export const updateContract = createAsyncThunk<
  UpdateContractResponse, // Return type of the fulfilled action
  { contractId: any; data: UpdateContractPayload }, // Arguments for the thunk
  {
    state: RootState; // Type for the Redux state (if you need to access it)
    rejectValue: ErrorResponse; // Type for the rejected value
  }
>(
  "contract/updateContract",
  async ({ contractId, data }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      // If no token, reject with an error
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await axios.post<UpdateContractResponse>(
        `${BASE_URL}/api/admin/update-contract/${contractId}`,
        data, // Request body
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno", // Make sure this is correct for your API
            device_id: "1010l0010l1", // Make sure this is correct for your API
          },
        }
      );
      // Show success toast
      toast.success(response.data.message || "Contract updated successfully!");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Handle 401 Unauthorized specifically to remove token
      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
        toast.error("Session expired. Please login again.");
      }

      // Extract and return meaningful error message
      if (axiosError.response) {
        toast.error(
          axiosError.response.data.message || "Failed to update contract."
        );
        return rejectWithValue({
          message:
            axiosError.response.data.message || "Failed to update contract.",
          errors: axiosError.response.data.errors,
        });
      } else if (axiosError.request) {
        // No response received
        toast.error(
          "No response from server. Please check your network connection."
        );
        return rejectWithValue({
          message:
            "No response from server. Please check your network connection.",
        });
      }

      // Catch all other errors
      toast.error("An unexpected error occurred. Please try again.");
      return rejectWithValue({
        message: "An unexpected error occurred. Please try again.",
      });
    }
  }
);

// Define the state for the contract slice
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

// Create the contract slice
const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    // You can add other synchronous reducers here if needed
    clearContractState: (state) => {
      state.contract = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateContract.fulfilled,
        (state, action: PayloadAction<UpdateContractResponse>) => {
          state.loading = false;
          state.contract = action.payload.data;
          state.error = null;
        }
      )
      .addCase(
        updateContract.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || "Failed to update contract.";
          state.contract = null; // Clear contract data on rejection, or keep old data based on UX
        }
      );
  },
});

export const { clearContractState } = contractSlice.actions;

export default contractSlice.reducer;