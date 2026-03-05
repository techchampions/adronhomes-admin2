import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import api from "../middleware";
// import api from "../../middleware";

interface ImpersonateResponse {
  success: boolean;
  message: string;
  token: string;
  data: {
    id: number;
    email: string;
    phone_number: string;
    referral_code: string;
    name: string | null;
    first_name: string;
    last_name: string;
    role: number;
    country: string;
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
    unique_customer_id: string;
    date_of_birth: string | null;
    created_origin: string;
  };
}

interface ErrorResponse {
  message: string;
  status?: number;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const impersonateUser = createAsyncThunk<
  ImpersonateResponse,
  number,
  { rejectValue: ErrorResponse }
>("adminImpersonate/fetch", async (userId, { rejectWithValue }) => {
  const token = Cookies.get("token");

  if (!token) {
    return rejectWithValue({
      message: "Authentication required. Please login.",
    });
  }

  try {
    const response = await api.post<ImpersonateResponse>(
      `${BASE_URL}/api/admin/impersonate/${userId}`,
      {}, // Empty body for POST request
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
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
    }

    if (axiosError.response) {
      return rejectWithValue(axiosError.response.data);
    }

    if (axiosError.request) {
      return rejectWithValue({
        message: "No response from server. Please check your network connection.",
      });
    }

    return rejectWithValue({
      message: "An unexpected error occurred. Please try again.",
    });
  }
});