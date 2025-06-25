import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";
import { toast } from "react-toastify";

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
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
  country: string;
  state: string;
  lga: string;
  otp_verified_at: string;
  email_verified_at: string;
  profile_picture: string | null;
  gender: string | null;
  notification_enabled: number;
  device_id: string;
  address: string;
  created_at: string;
  updated_at: string;
  personnel: string;
  contract_id: number | null;
}

export interface ReferredUser {
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
  otp_verified_at: string | null;
  email_verified_at: string | null;
  profile_picture: string | null;
  gender: string | null;
  notification_enabled: number;
  device_id: string;
  address: string | null;
  created_at: string | null;
  updated_at: string | null;
  personnel: string;
  contract_id: string | null;
  property_plan_total: number;
  saved_property_total: number;
}

export interface PaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ReferredUsersData {
  current_page: number;
  data: ReferredUser[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLinks[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface PropertyPlan {
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
  user: User;
  contract_id: string | null;
  number_of_unit: number;
}

export interface PropertyPlansData {
  current_page: number;
  data: PropertyPlan[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLinks[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface UpcomingPaymentCustomer {
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
  otp_verified_at: string | null;
  email_verified_at: string | null;
  profile_picture: string | null;
  gender: string | null;
  notification_enabled: number;
  device_id: string;
  address: string | null;
  created_at: string;
  updated_at: string;
  personnel: string;
  contract_id: string | null;
  amount:any| null
  due_date:any|null
  }


export interface UpcomingPaymentCustomersData {
  current_page: number;
  data: UpcomingPaymentCustomer[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLinks[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface MarketerDashboardResponse {
  success: boolean;
  message: string;
  data: {
    marketer: {
      first_name: string;
      last_name: string;
      referral_code: string;
    };
    referred_users: ReferredUsersData;
    total_referred_users: number;
    total_property_plans: number;
    total_paid_amount: number;
    total_amount: number;
    expected_payment_count: number;
    active_plan: PropertyPlansData;
    upcoming_payment_customers: UpcomingPaymentCustomersData;
  };
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const fetchMarketerDashboard = createAsyncThunk<
  MarketerDashboardResponse, 
  { currentpage: number },   
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "dashboard/fetchMarketerDashboard",
  async ({ currentpage }, { rejectWithValue, getState }) => {
    const token = Cookies.get("token");

    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await axios.get<MarketerDashboardResponse>(
        `${BASE_URL}/api/marketers/dashboard`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
          params: {
            page: currentpage,
          },
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
            axiosError.response.data.message || "Failed to fetch dashboard data",
          errors: axiosError.response.data.errors,
        });
      } else if (axiosError.request) {
        return rejectWithValue({
          message: "No response from server. Please check your network connection.",
        });
      }

      return rejectWithValue({
        message: "An unexpected error occurred. Please try again.",
      });
    }
  }
);