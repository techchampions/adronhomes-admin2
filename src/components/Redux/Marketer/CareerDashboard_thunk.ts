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
  property_plan_total?: number;
  saved_property_total?: number;
}

export interface Payment {
  id: number;
  property_id: number;
  plan_id: number;
  status: number;
  amount: number;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyPlan {
  id: number;
  user_id: number;
  payment_percentage: number;
  repayment_schedule: string;
  next_payment_date: string;
  total_amount: number;
  paid_amount: number;
  remaining_balance: number;
  status: number;
  monthly_duration: string;
  user: User;
}

export interface UpcomingPayment {
  id: number;
  property_id: number;
  plan_id: number;
  status: number;
  amount: number;
  due_date: string;
  created_at: string;
  updated_at: string;
  property_plan: PropertyPlan;
}

export interface PaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedData<T> {
  current_page: number;
  data: T[];
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
    total_referred_users: number;
    total_completed_property_plans: number;
    total_active_property_plans: number;
    upcoming_payment_count: number;
    upcoming_payment_customers: PaginatedData<UpcomingPayment>;
    marketer: {
      first_name: string;
      last_name: string;
      referral_code: string;
    };
    referred_users: PaginatedData<User>;
  };
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchMarketerDashboard = createAsyncThunk<
  MarketerDashboardResponse,
  { currentPage?: number; referredUsersPage?: number },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "marketerDashboard/fetchMarketerDashboard",
  async ({ currentPage = 1, referredUsersPage = 1 }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await axios.get<MarketerDashboardResponse>(
        `${BASE_URL}/api/marketers/customers`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
          params: {
            page: currentPage,
            referred_users_page: referredUsersPage,
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