import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";

interface PropertyDocument {
  name: string;
  url: string;
  type: string;
}
interface PropertyFormData {
  // Basic Information
  name: string; // "Emirates Park and Gardens Phase 2 (Ocean View...)"
  display_image: File[];
  photos: File[]; // Array of files
  size: string; // "540 sqm"
  price: string; // "700000"
  type: string; // "1" (property type ID)
  no_of_bedroom: string; // "3"
  features: string[]; // ["Gym", "247 Electricity", "Light", "Cinema", "Swimming Pool", "Resort"]
  
  // Description & Location
  overview: string; // "Welcome to Emirates Park and Gardens Phase 2,..."
  description: string; // Full description
  street_address: string; // "Badagry, Lagos. Nigeria"
  country: string; // "Nigeria"
  state: string; // "Ogun"
  lga: string; // "Ikeja"
  area: string; // "540 sqm" (duplicate of size?)
  property_map: string; // Google Maps URL
  property_video: string; // YouTube URL
  virtual_tour: string; // Virtual tour URL
  status: string; // (empty in screenshot)
  
  // Pricing & Payment
  initial_deposit: string; // "100000" (note typo in field name)
  property_duration_limit: string; // "3" (months/years?)
  payment_schedule: string[]; // ["weekly", "daily"]
  category: string; // "single"
  
  // Discount Information
  is_discount: string; // "1" (boolean as string)
  discount_name: string; // "lleva"
  discount_percentage: string; // "20"
  discount_units: string; // "10"
  discount_start_date: string; // ISO date string
  discount_end_date: string; // ISO date string
  
  // Additional Details
  parking_space: string; // (contains date string, might be incorrect)
  number_of_bathroom: string; // "3"
  number_of_unit: string; // "3"
  property_agreement: File[]; // Contract files
  is_active: string; // "0" (boolean as string)
  details: string[]; // (empty array)
  
  // Key-Value Pairs (for additional metadata)
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

export const createProperty = createAsyncThunk<
  AddPropertySuccessResponse,
  { credentials: PropertyFormData },
  { rejectValue: ErrorResponse; state: RootState }
>(
  "properties/create",
  async ({ credentials }, { rejectWithValue }) => {
    const token = Cookies.get('token');
    
    if (!token) {
      return rejectWithValue({
        message: "Authentication required. Please login.",
      });
    }

    try {
      const response = await axios.post<AddPropertySuccessResponse>(
        `${BASE_URL}api/admin/create-property`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "identifier": "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            "device_id": "1010l0010l1",
          }
        }
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove('token');
      }

      if (axiosError.response) {
        return rejectWithValue(axiosError.response.data);
      }
      
      return rejectWithValue({
        message: axiosError.request 
          ? "No response from server. Please check your network connection."
          : "An unexpected error occurred. Please try again.",
      });
    }
  }
);
