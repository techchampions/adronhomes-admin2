import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";
import { toast } from "react-toastify";
import api from "../middleware";

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface PropertyDetail {
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
  contract_id: string | null;
  unique_customer_id:any|null
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
  contract_id: string | null;
  number_of_unit: number;
  initial_payment_percentage: number;
  marketer: Marketer | null;
  property: PropertyDetail;
  user: User;
  contract:singleContract
}

export interface singleContract {
  id: number;
  plan_id: number;
  status: number;
  property_id: number;
  user_id: number;
  unique_contract_id: string | null;
  contract_customer_id: string | null;
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
  contract_main_marketer: string;
  contract_marketer_1: number;
  contract_marketer_2: number;
  contract_employer: string;
  contract_occupation: string;
  contract_employer_address: string;
  contract_next_of_kin: string | null;
  contract_next_of_kin_address: string;
  contract_next_of_kin_phone: string;
  contract_next_of_kin_relationship: string;
  contract_profile_picture_2: string | null;
  contract_profile_picture: string;
  created_at: string; 
  updated_at: string; 
  means_of_ids: any; 
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


const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://adron.microf10.sg-host.com";

export const fetchContracts = createAsyncThunk<
  ContractsResponse,
  { 
    page?: number; 
    status?: number | null; 
    search?: string | null;
    per_page?: number;
    contract?: number | null; // New parameter for contract type
  },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "contracts/fetch",
  async ({ page = 1, status = null, search = null, per_page = 10, contract = null }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const params: Record<string, any> = {
        page,
        per_page,
      };

      if (status !== null) {
        params.status = status;
      }

      if (search) {
        params.search = search;
      }

      if (contract !== null) {
        params.contract = contract;
      }

      const response = await api.get<ContractsResponse>(
        `${BASE_URL}/api/admin/contracts`,
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
        toast.error("Session expired. Please login again.");
      }

      if (axiosError.response) {
        const errorMessage =
          axiosError.response.data.message ||
          "Failed to fetch contracts data";
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
