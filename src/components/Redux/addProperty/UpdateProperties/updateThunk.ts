import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "../../store";


interface PropertyDocument {
  name: string;
  url: string;
  type: string;
}

interface PropertyFormData {
  name: string;
  display_image: File[];
  photos: File[];
  size: string;
  price: string;
  type: string;
  no_of_bedroom: string;
  features: string[];
  overview: string;
  description: string;
  street_address: string;
  country: string;
  state: string;
  lga: string;
  area: string;
  property_map: string;
  property_video: string;
  virtual_tour: string;
  status: string;
  initial_deposit: string;
  property_duration_limit: string;
  payment_schedule: string[];
  category: string;
  is_discount: string;
  discount_name: string;
  discount_percentage: string;
  discount_units: string;
  discount_start_date: string;
  discount_end_date: string;
  parking_space: string;
  number_of_bathroom: string;
  number_of_unit: string;
  property_agreement: File[];
  is_active: string;
  details: string[];
  keyValuePairs: Array<{
    key: string;
    value: string;
    description: string;
  }>;
}

export interface AddPropertySuccessResponse {
  status: "success";
  success: true;
  propertyId: string;
  message?: string;
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const UpdateProperty = createAsyncThunk<
  AddPropertySuccessResponse,
  { UpdateId:any,credentials: FormData },
  { rejectValue: ErrorResponse; state: RootState }
>(
  "property/UpdateProperty",
  async ({UpdateId, credentials }, { rejectWithValue }) => {
    const token = Cookies.get('token');
    
    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "Authentication required. Please login.",
      });
    }

    try {
      const response = await axios.post<AddPropertySuccessResponse>(
        `${BASE_URL}/api/admin/edit-property/${UpdateId}`,
        credentials,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
             identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          }
        }
      );
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove('token');
        toast.error("Session expired. Please login again.");
      }

      if (axiosError.response) {
        const errorMessage = axiosError.response.data.message || 
          (axiosError.response.data.errors 
            ? Object.values(axiosError.response.data.errors).flat().join(', ')
            : "Failed to create property");
        
        toast.error(errorMessage);
        return rejectWithValue(axiosError.response.data);
      }
      
      const errorMessage = axiosError.request 
        ? "No response from server. Please check your network connection."
        : "An unexpected error occurred. Please try again.";
      
      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
      });
    }
  }
);

