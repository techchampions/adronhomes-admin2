// contracts_thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store"; // Assuming your store is at ../store
import { toast } from "react-toastify";

// Define interfaces for the API response
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface PropertyDetail {
  id: number;
  name: string;
  type: number;
  features: string[]; // Added features array as it's present in the new response
  price: number;
  size: string;
  display_image: string;
  lga: string;
  state: string;
  total_amount: number;
}

export interface Marketer {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Contract {
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
  monthly_duration: string;
  payment_type: string;
  end_date: string | null;
  start_date: string | null;
  payment_method: string | null;
  repayment_schedule: string;
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
  contract_id: string;
  number_of_unit: number;
  initial_payment_percentage: number;
  marketer: Marketer | null; // Added marketer object
  property: PropertyDetail;
}

export interface ContractPaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ContractListData {
  current_page: number;
  data: Contract[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: ContractPaginationLinks[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface ContractsResponse {
  success: boolean;
  total_contracts: number;
  total_invoice: number;
  total_paid_contract: number;
  total_unpaid_contract: number;
  contract_list: ContractListData;
}

// Base URL for your API
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://adron.microf10.sg-host.com"; // Fallback for VITE_API_BASE_URL

/**
 * Async Thunk to fetch contract listings.
 * It fetches contracts with pagination and handles authentication.
 */
export const fetchContracts = createAsyncThunk<
  ContractsResponse, // Return type of the fulfilled action
  { page?: number }, // Argument type for the thunk (optional page number)
  {
    state: RootState; // Type for getState
    rejectValue: ErrorResponse; // Type for rejectWithValue
  }
>(
  "contracts/fetch",
  async ({ page = 1 }, { rejectWithValue }) => {
    const token = Cookies.get("token"); // Get authentication token from cookies

    // Check if authentication token exists
    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await axios.get<ContractsResponse>(
        `${BASE_URL}/api/admin/contracts`, // API endpoint for contracts
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Authorization header
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno", // Custom header
            device_id: "1010l0010l1", // Custom header
          },
          params: {
            page: page, // Pass the current page for pagination
          },
        }
      );
      return response.data; // Return the data from the successful response
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>; // Cast error to AxiosError

      // Handle 401 Unauthorized error: remove token and notify user
      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
        toast.error("Session expired. Please login again.");
      }

      // If there's a response from the server, use its error message
      if (axiosError.response) {
        const errorMessage =
          axiosError.response.data.message ||
          "Failed to fetch contracts data"; // Default error message
        toast.error(errorMessage); // Display error toast
        return rejectWithValue(axiosError.response.data); // Reject with the server's error data
      } else if (axiosError.request) {
        // If no response was received (e.g., network error)
        const errorMessage =
          "No response from server. Please check your network connection.";
        toast.error(errorMessage); // Display error toast
        return rejectWithValue({
          message: errorMessage,
        });
      }

      // Handle any other unexpected errors
      const errorMessage = "An unexpected error occurred. Please try again.";
      toast.error(errorMessage); // Display error toast
      return rejectWithValue({
        message: errorMessage,
      });
    }
  }
);
