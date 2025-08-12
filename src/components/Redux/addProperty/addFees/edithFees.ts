import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../../store";

// Define the response and form data interfaces
export interface EditPropertyDetailSuccessResponse {
  status: string;
  message: string;
  data: {
    id: number;
    name: string;
    value: string;
    property_id: number;
    created_at: string;
    updated_at: string;
    type: string;
    purpose: string;
  };
}

export interface EditPropertyDetailFormData {
  property_id: string;
  name: string;
  value: string;
  type: string;
  purpose: string;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create the async thunk
export const edit_property_detail = createAsyncThunk<
  EditPropertyDetailSuccessResponse,
  { detailId: number; formData: EditPropertyDetailFormData },
  { rejectValue: ErrorResponse; state: RootState }
>(
  "properties/editPropertyDetail",
  async ({ detailId, formData }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      return rejectWithValue({
        message: "Authentication required. Please login.",
      });
    }

    // Create FormData object from the provided data
    const form = new FormData();
    form.append("property_id", formData.property_id);
    form.append("name", formData.name);
    form.append("value", formData.value);
    form.append("type", formData.type);
    form.append("purpose", formData.purpose);

    try {
      const response = await axios.post<EditPropertyDetailSuccessResponse>(
        `${BASE_URL}/api/admin/edit-property-detail/${detailId}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
        return rejectWithValue({
          message: "Session expired. Please login again.",
        });
      }

      if (axiosError.response) {
        const data = axiosError.response.data;
        return rejectWithValue({
          message: data.message || "Failed to update property detail",
          errors: data.errors,
        });
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
  }
);