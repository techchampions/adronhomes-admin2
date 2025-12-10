// propertyThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

import { toast } from "react-toastify";
import { RootState } from "../../store";
interface Director {
  id: number;
  first_name: string;
  last_name: string;
}
interface PropertyType {
  id: number;
  name: string;
  created_at: string | null;
  updated_at: string | null;
}
// Define the Duration interface
interface Duration {
  id: number;
  price: number;
  citta_id: string; // Assuming this is a city code or identifier
  duration: number; // Assuming this is the length of the duration in years or months
  is_active: boolean;
}

// Define the LandSize interface
interface LandSize {
  id: number;
  size: string; // Size of the land (e.g., "450")
  durations: Duration[]; // Array of durations
}

// Define the main interface containing land sizes and total amount
// interface LandTransaction {
//   land_sizes: LandSize[];

// }


export interface Property {
  id: number;
  name: string;
  land_sizes:LandSize[]
  display_image: string;
  photos: string[];
  size: string;
  price: number;
  type: {
    id: number;
    name: string;
    created_at: string | null;
    updated_at: string | null;
  };
  no_of_bedroom: number | null;
  slug: string;
  features: string[];
  overview: string;
  description: string;
  street_address: string;
  country: string;
  state: string;
  lga: string;
  created_at: string;
  updated_at: string;
  area: string | null;
  property_map: string | null;
  property_video: string | null;
  virtual_tour: string | null;
  subscriber_form: string | null;
  status: string;
  initial_deposit: number;
  is_active: 0 | 1;
  property_duration_limit: number;
  payment_schedule: string[];
  category_id:any
  propertyFiles:any[]
  category: string;
  is_discount: boolean;
  discount_name: string | null;
  discount_percentage: number | null;
  discount_units: number | null;
  discount_start_date: string | null;
  discount_end_date: string | null;
  parking_space: number | null;
  number_of_bathroom: number | null;
  number_of_unit: number;
  property_agreement: string;
  payment_type: string;
  location_type: string;
  purpose: string[] | null;
  year_built: string | null;
  shape: string | null;
  topography: string | null;
  title_document_type: string | null;
  road_access: string | null;
  director_id: number | null;
  unit_available: number;
  unit_sold: number;
  property_view: number;
  property_requests: number;
  video_link: string | null;
  video_file: string | null;
  nearby_landmarks: string | null;
  gated_estate: string | null;
  fencing: string | null;
  contact_number: string | null;
  whatsapp_link: string | null;
  rent_duration: string | null;
  toilets: number | null;
  building_condition: string | null;
  fees_charges: string | null;
  is_featured: 0 | 1;
  total_amount: number;
  details: PropertyDetail[];
  property_files:any
  director:Director
  
}
export interface PropertyDetail {
  id: number;
  name: string;
  value: number;
  property_id: number;
  created_at: string;
  updated_at: string;
  type: string;
  purpose: string;
}

export interface SavedPropertyUser {
  id: number;
  property_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  saved_user: {
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
    gender: string | null;
    notification_enabled: 0 | 1;
    device_id: string;
    address: string;
    created_at: string;
    updated_at: string;
    personnel: string;
    contract_id: string | null;
    unique_customer_id: string | null;
  };
}

export interface PropertyDataResponse {
  status: string;
  message: string;
  data: {
    properties: Property[];
    saved_property_user: SavedPropertyUser[];
    similar_property_user: Property[];
  };
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchPropertyData = createAsyncThunk<
  PropertyDataResponse,
  { id: number },
  { rejectValue: ErrorResponse; state: RootState }
>(
  "property/fetchPropertyData",
  async ({ id }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    try {
      const response = await axios.get<PropertyDataResponse>(
        `${BASE_URL}/api/property/${id}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
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
        toast.error("Session expired. Please login again.");
      }

      if (axiosError.response) {
        const errorMessage =
          axiosError.response.data.message ||
          (axiosError.response.data.errors
            ? Object.values(axiosError.response.data.errors).flat().join(",")
            : "Failed to fetch property data");
        toast.error(errorMessage);
        return rejectWithValue(axiosError.response.data);
      } else if (axiosError.request) {
        const errorMessage =
          "No response from server. Please check your network connection.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage });
      }

      const errorMessage = "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);