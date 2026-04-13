import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import api from "../middleware";

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Contract interface
export interface Contract {
  id: number;
  customerName: string;
  customerCode: string;
  dateOfBirth: string;
  userId: number;
  propertyId: null | any;
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
  customerGender: string;
  customerMarital: string;
  fullPayment: string;
  fullPaymentDate: null | string;
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
  marketer1: string;
  marketer1Percent: string;
  marketer2: string;
  marketer2Percent: string;
  marketer3: string;
  marketer3Percent: string;
}

// Payment interface
export interface ContractPayment {
  id: number;
  contract_id: number;
  erp_contract_id: string;
  user_id: number;
  amount_paid: number;
  payment_type: string; // "virtual_wallet" or "interswitch"
  status: number;
  reference: string;
  created_at: string;
  updated_at: string;
  contract: Contract | null;
}

// Stats interface
export interface PaymentsStats {
  total: number;
  pending: number;
  completed: number;
}

// Contracts list interface
export interface ContractsList {
  current_page: number;
  data: ContractPayment[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

// Updated response structure
export interface PaymentsResponse {
  success: boolean;
  message: string;
  data: {
    stats: PaymentsStats;
    contracts: ContractsList;
  };
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchContractPayments = createAsyncThunk<
  PaymentsResponse,
  { page?: number; per_page?: number; search?: string; type?: string | null }, // Changed from payment_type to type
  { rejectValue: ErrorResponse }
>(
  "contractPayments/fetch",
  async ({ page = 1, per_page = 20, search = "", type = null }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const params: any = { page, per_page };
      if (search) params.search = search;
      if (type) params.type = type; // Send 'type' parameter (either 'virtual_wallet' or 'interswitch')

      const response = await api.get<PaymentsResponse>(
        `${BASE_URL}/api/admin/all-contract-payments`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
          params,
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
      }

      if (axiosError.response) {
        return rejectWithValue({
          message:
            axiosError.response.data.message ||
            "Failed to fetch contract payments",
          errors: axiosError.response.data.errors,
        });
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
  }
);