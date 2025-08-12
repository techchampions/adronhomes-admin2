import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";
import { BASE_URL } from "../UpdateContract/viewcontractFormDetails";

export interface Career {
  id: number;
  name: string;
  email: string;
  phone: string;
  state: string;
  job_role: string;
  education: string;
  description: string;
  created_at: string;
  updated_at: string;
  application_type: number;
  job_id: number | null;
  cover_letter: string | null;
  resume: string | null;
}

export interface CareerResponse {
  success: boolean;
  career: Career;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}


export const fetchCareerById = createAsyncThunk<
  CareerResponse,
  number, // The ID of the career application
  { rejectValue: ErrorResponse; state: RootState }
>("career/fetchById", async (id, { rejectWithValue, getState }) => {
  const token = Cookies.get("token");

  if (!token) {
    return rejectWithValue({
      message: "No authentication token found. Please login again.",
    });
  }

  try {
    const response = await axios.get<CareerResponse>(
      `${BASE_URL}/api/hr/career-view/${id}`,
      {
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
      return rejectWithValue(
        axiosError.response.data || {
          message: "Failed to fetch career data",
        }
      );
    } else if (axiosError.request) {
      return rejectWithValue({
        message:
          "No response from server. Please check your network connection.",
      });
    }
    return rejectWithValue({
      message: "An unexpected error occurred.",
    });
  }
});
