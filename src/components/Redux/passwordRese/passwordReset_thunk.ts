// passwordReset_thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import api from "../middleware";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ResetPasswordCredentials {
  password: string;
  password_confirmation: string;
  token?: string; // If you need a token for password reset
}

export interface ResetPasswordSuccessResponse {
  success: boolean;
  message: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export const resetPassword = createAsyncThunk<
  ResetPasswordSuccessResponse,
  ResetPasswordCredentials,
  { rejectValue: ErrorResponse }
>(
  "passwordReset/resetPassword",
  async (credentials, { rejectWithValue }) => {
    try {
      const url = `${BASE_URL}/api/update-profile`;

      const response = await api.post(url, credentials, {
        headers: {
          "Content-Type": "application/json",
          identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
          device_id: "1010l0010l1",
        },
      });

      return {
        success: true, // <-- add this so slice works
        message: response.data.message, // <-- from your API
      };
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response) {
        return rejectWithValue({
          success: false,
          message: axiosError.response.data.message,
        });
      }

      return rejectWithValue({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      });
    }
  }
);
