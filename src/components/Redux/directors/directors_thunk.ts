import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";
import api from "../middleware";

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

interface Personnel {
  id: number;
  first_name: string;
  last_name: string;
}

interface PersonnelsResponse {
  success: boolean;
  data: Personnel[];
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const directors = createAsyncThunk<
  PersonnelsResponse,           
  void, // No parameters expected for this thunk
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "directors/fetch",
  async (_, { rejectWithValue, getState }) => {
    const token = Cookies.get("token");
    const state = getState();

    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await api.get<PersonnelsResponse>(
        `${BASE_URL}/api/admin/directors`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
        return rejectWithValue({
          message:
            axiosError.response.data.message || "Failed to fetch personnels data",
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