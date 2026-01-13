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

// Define the type for the parameter that determines which endpoint to use
type PersonnelType = 'directors' | 'marketers';

export const fetchPersonnel = createAsyncThunk<
  PersonnelsResponse,           
  PersonnelType, // Parameter to switch between directors and marketers
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "personnel/fetch",
  async (personnelType, { rejectWithValue, getState }) => {
    const token = Cookies.get("token");
    const state = getState();

    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    // Conditional condition to switch the endpoint
    const endpoint = personnelType === 'marketers' 
      ? 'admin/marketers' 
      : 'admin/directors';

    try {
      const response = await api.get<PersonnelsResponse>(
        `${BASE_URL}/api/${endpoint}`,
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
            axiosError.response.data.message || `Failed to fetch ${personnelType} data`,
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

// Alternatively, you could keep the original 'directors' thunk and add a separate one for marketers
// Or create a factory function to generate thunks for different personnel types

// Example factory approach:
export const createPersonnelThunk = (type: PersonnelType) => {
  return createAsyncThunk<
    PersonnelsResponse,
    void,
    {
      state: RootState;
      rejectValue: ErrorResponse;
    }
  >(
    `${type}/fetch`,
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
          `${BASE_URL}/api/admin/${type}`,
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
              axiosError.response.data.message || `Failed to fetch ${type} data`,
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
};

// Create specific thunks using the factory
export const directors = createPersonnelThunk('directors');
export const marketers = createPersonnelThunk('marketers');