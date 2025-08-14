import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";
import { SinglePaymentListResponse } from "./fetchPaymentListById_slice";
import api from "../middleware";

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaymentItem {
  id: number;
  property_id: number | null;
  user_id: number;
  property_plan_id: number | null;
  order_id: number | null;
  amount_paid: number;
  purpose: string;
  payment_type: string;
  status: number; // 0 = pending, 1 = approved, 2 = rejected
  reference: string;
  is_coupon: number;
  created_at: string;
  updated_at: string;
  proof_of_payment: string | null;
  bank_name: string | null;
  description: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface PaymentListData {
  current_page: number;
  data: PaymentItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
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
  list: PaymentListData;
}

export interface PaymentsResponse {
  success: boolean;
  data: {
    payments: PaymentSummary;
  };
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const payments = createAsyncThunk<
  PaymentsResponse,
  void,
  { rejectValue: ErrorResponse; state: RootState }
>(
  "payments/fetch",
  async (_, { rejectWithValue, getState }) => {
    const token = Cookies.get('token');
    const state = getState();
    const currentPage = state.payments?.pagination?.currentPage || 1; 
    
    if (!token) {
      return rejectWithValue({
        message: "Authentication required. Please login again.",
      });
    }

    try {
      const response = await api.get<PaymentsResponse>(
        `${BASE_URL}/api/admin/payments`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "identifier": "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            "device_id": "1010l0010l1",
          },
          params: {
            page: currentPage,
            per_page: 50 // Match the API's default pagination size
          }
        }
      );

      // Validate response structure
      if (!response.data?.data?.payments) {
        return rejectWithValue({
          message: "Invalid response structure from server",
        });
      }

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove('token');
        return rejectWithValue({
          message: "Session expired. Please login again.",
        });
      }

      if (axiosError.response) {
        return rejectWithValue({
          message: axiosError.response.data.message || "Failed to fetch payments",
          errors: axiosError.response.data.errors,
        });
      }

      if (axiosError.request) {
        return rejectWithValue({
          message: "Network error. Please check your internet connection.",
        });
      }

      return rejectWithValue({
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  }
);



export const fetchPaymentById = createAsyncThunk<
  SinglePaymentResponse,
  number, // payment ID as parameter
  { rejectValue: ErrorResponse; state: RootState }
>(
  "payments/fetchPaymentById",
  async (paymentId, { rejectWithValue }) => {
    const token = Cookies.get('token');
    
    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await api.get<SinglePaymentResponse>(
        `${BASE_URL}/api/admin/payment/${paymentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          }
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove('token');
      }

      if (axiosError.response) {
        return rejectWithValue({
          message: axiosError.response.data.message || "Failed to fetch payment data",
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
export interface User {
  id: number;
  email_verified_at: string;
  last_name: string;
  first_name: string;
  profile_picture: string | null;
}

export interface User {
  id: number;
  email_verified_at: string;
  last_name: string;
  first_name: string;
  profile_picture: string | null;
}

// This interface seems to be for a single payment detail, not a list item.
// It's not directly used in the fetchPaymentListById thunk's return type,
// but it's good to keep if used elsewhere.
interface SinglePaymentResponse {
  status: string;
  message: string;
  data: {
    id: number;
    property_id: number | null;
    user_id: number;
    property_plan_id: number | null;
    order_id: number | null;
    amount_paid: number;
    purpose: string;
    payment_type: string;
    status: number;
    reference: string;
    is_coupon: number;
    created_at: string;
    updated_at: string;
    proof_of_payment: string;
    property: any | null; // Replace 'any' with proper type if available
    plan: any | null;     // Replace 'any' with proper type if available
    bank_name:string
    user:User
  };
}


export const fetchPaymentListById = createAsyncThunk<
  SinglePaymentListResponse,
  { paymentId: number; currentPage?: number },
  { rejectValue: ErrorResponse; state: RootState }
>(
  "payments/fetchPaymentListById",
  async ({ paymentId, currentPage = 1 }, { rejectWithValue }) => {
    const token = Cookies.get('token');

    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await api.get<SinglePaymentListResponse>(
        `${BASE_URL}/api/admin/payment-list/${paymentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
          params: {
            page: currentPage
          }
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove('token');
      }

      if (axiosError.response) {
        return rejectWithValue({
          message: axiosError.response.data.message || "Failed to fetch payment data",
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


interface UpdatePaymentstatusCredentials {
  status: number;
}

export interface UpdatePaymentstatusResponse {
  message: string;
  payment: {
    id: number;
    property_id: number | null;
    user_id: number;
    property_plan_id: number | null;
    order_id: number | null;
    amount_paid: number;
    purpose: string;
    payment_type: string;
    status: number;
    reference: string;
    is_coupon: number;
    created_at: string;
    updated_at: string;
    proof_of_payment: string;
      bank_name:string
  };
}

export const UpdatePaymentstatus = createAsyncThunk<
  UpdatePaymentstatusResponse,
  { paymentId: any; credentials: UpdatePaymentstatusCredentials },
  { rejectValue: ErrorResponse; state: RootState }
>(
  "payments/updatePaymentStatus",
  async ({ paymentId, credentials }, { rejectWithValue }) => {
    const token = Cookies.get('token');
    
    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await api.post<UpdatePaymentstatusResponse>(
        `${BASE_URL}/api/admin/update-payment/${paymentId}`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          }
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove('token');
      }

      if (axiosError.response) {
        return rejectWithValue({
          message: axiosError.response.data.message || "Failed to update payment status",
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