import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import api from "../middleware";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginSuccessResponse {
  success: boolean;
  token?: string;
  user?: User;
  message: string;
  otpVerified?: boolean;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export const loginUser = createAsyncThunk<
  LoginSuccessResponse,
  LoginCredentials,
  { rejectValue: ErrorResponse }
>(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await api.post<LoginSuccessResponse>(
        `${BASE_URL}/api/login`,
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