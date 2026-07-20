import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import api from "../../middleware";

interface PropertyCategory {
  id: number;
  created_at: string | null;
  updated_at: string | null;
  category_name: string;
  category_description: string | null;
}

interface PropertyCategoriesResponse {
  success: boolean;
  propertyCategory: PropertyCategory[];
}

interface ErrorResponse {
  message: string;
  status?: number;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchPropertyCategories = createAsyncThunk<
  PropertyCategoriesResponse,
  void,
  { rejectValue: ErrorResponse }
>("propertyCategories/fetch", async (_, { rejectWithValue }) => {
  const token = Cookies.get("token");

  if (!token) {
    return rejectWithValue({
      message: "Authentication required. Please login.",
    });
  }

  try {
    const response = await api.get<PropertyCategoriesResponse>(
      `${BASE_URL}/api/admin/property_categories`,
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