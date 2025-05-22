import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";


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
  profile_picture: string;
  gender: string;
  notification_enabled: number;
  device_id: string;
  address: string;
  created_at: string;
  updated_at: string;
  personnel: string;
}


export interface UserResponse {
  user?: User;
  message?: string;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}


const BASE_URL = import.meta.env.VITE_API_BASE_URL;



export const getUser = createAsyncThunk<
  UserResponse,
  void,
  { rejectValue: ErrorResponse }
>(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    // Check for token in cookies first
    const token = Cookies.get('token');
    
    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await axios.get<UserResponse>(
        `${BASE_URL}/api/user-profile`,
        {

          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        // Token is invalid or expired - clear it
        Cookies.remove('token');
      }

      if (axiosError.response) {
        return rejectWithValue({
          message: axiosError.response.data.message || "Failed to fetch user",
          errors: axiosError.response.data.errors,
        });
      } else if (axiosError.request) {
        return rejectWithValue({
          message: "No response from server. Please check your network connection.",
        });
      } else {
        return rejectWithValue({
          message: "An unexpected error occurred. Please try again.",
        });
      }
    }
  }
);