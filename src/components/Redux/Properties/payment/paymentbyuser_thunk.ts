import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import api from "../../middleware";
import { RootState } from "../../store";
// import { Search } from "lucide-react";

export interface NameData {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
}

export interface PropertyData {
    id: number;
    name: string;
    display_image: string;
    price: number;
    slug: string;
}

export interface PaymentPlanData {
    id: number;
    total_amount: number;
    paid_amount: number;
    remaining_balance: number;
    next_payment_date: string;
}

export interface PaymentItem {
  id: number;
  property_id: number;
  user_id: number;
  amount_paid: number;
  payment_type: string;
  status: 0 | 1;
  reference: string;
  description: string;
  created_at: string;
  user: NameData;
  director: NameData;
  marketer: NameData | null;
  plan: PaymentPlanData;
  property: PropertyData;
}

export interface PaymentsList {
  current_page: number;
  data: PaymentItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface PaymentSummary {
  total: number;
  approved: number;
  pending: number;
  amount_total: number;
  amount_approved: number;
  amount_pending: number;
  list: PaymentsList;
}

export interface UserPaymentsResponse {
  success: boolean;
  data: {
    payments: PaymentSummary;
  };
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface FetchPaymentsArgs {
    userId: any;
    page?: number;
    Search?:any
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchUserPayments = createAsyncThunk<
  UserPaymentsResponse,
  FetchPaymentsArgs,
  { rejectValue: ErrorResponse; state: RootState }
>(
  "paymentsid/fetchUserPayments",
  async ({ userId, page = 1,Search=null }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      return rejectWithValue({
        message: "Authentication token missing. Please log in.",
      });
    }

    try {
      const response = await api.get<UserPaymentsResponse>(
        `${BASE_URL}/api/admin/payments`,
        {
          params: {
            user_id: userId,
            page: page,
            Search:Search
          },
          headers: {
            Authorization: `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response) {
        return rejectWithValue(axiosError.response.data);
      } else {
        return rejectWithValue({ message: "Network error or no response from server." });
      }
    }
  }
);