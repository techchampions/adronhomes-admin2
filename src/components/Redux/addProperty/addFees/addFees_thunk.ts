import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../../store";
import api from "../../middleware";


export interface add_property_detailPropertySuccessResponse {
  status: string;
  message: string;
  data?: any; 
}



export interface add_property_detailFormData {
  property_id: string;
  name: any;
  value: any;
   type: any;
}


export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const add_property_detail = createAsyncThunk<
  add_property_detailPropertySuccessResponse,
  { credentials: add_property_detailFormData },
  { rejectValue: ErrorResponse; state: RootState }
>(
  "properties/add-property-detail",
  async ({ credentials }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      return rejectWithValue({
        message: "Authentication required. Please login.",
      });
    }

    
    if (import.meta.env.DEV) {
      console.log("Submitting property detail:", credentials);
      console.log("Using token:", token);
    }

    try {
      const response = await api.post<add_property_detailPropertySuccessResponse>(
        `${BASE_URL}/api/admin/add-property-detail`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "identifier": "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            "device_id": "1010l0010l1",
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
        const data = axiosError.response.data;
        return rejectWithValue({
          message: data.message,
          errors: data.errors,
        });
      }

      if (axiosError.request && !axiosError.response) {
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
