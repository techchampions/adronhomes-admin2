import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface otpCredentials {
  email: string;
}

export interface SendotpSuccessResponse {
  success: boolean;
  message: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export const Sendotp = createAsyncThunk<
  SendotpSuccessResponse,
  otpCredentials,
  { rejectValue: ErrorResponse }
>(
  "/api/resend-otp",
  async (credentials: otpCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<SendotpSuccessResponse>(
        `${BASE_URL}/api/forget-password`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
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
      }
      return rejectWithValue({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      });
    }
  }
);

export interface OtpPasswordData {
  otp: any;
  password: any;
  password_confirmation: any;
}

export const OtpPasswordResetData = createAsyncThunk<
  SendotpSuccessResponse,
  OtpPasswordData,
  { rejectValue: ErrorResponse }
>(
  "/api/verify-otp",
  async (credentials: OtpPasswordData, { rejectWithValue }) => {
    try {
      const response = await axios.post<SendotpSuccessResponse>(
        `${BASE_URL}/api/change-password`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
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
      }
      return rejectWithValue({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      });
    }
  }
);
