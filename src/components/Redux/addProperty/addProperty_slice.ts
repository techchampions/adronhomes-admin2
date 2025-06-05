import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "../store";

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
  type: number;
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
  message: string;
  data: {
    property: {
      name: string;
      display_image: string;
      size: string;
      price: string;
      is_active: string;
      type: {
        id: number;
        name: string;
        created_at: string | null;
        updated_at: string | null;
      };
      features: string;
      overview: string;
      description: string;
      street_address: string;
      virtual_tour: string;
      initial_deposit: string;
      property_duration_limit: string;
      payment_schedule: string;
      category: string;
      status: string;
      is_discount: boolean;
      location_type: string;
      purpose: string;
      payment_type: string;
      photos: string[];
      slug: string;
      is_sold: number;
      updated_at: string;
      created_at: string;
      id: number;
      total_amount: number;
    };
  };
}
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createProperty = createAsyncThunk<
  AddPropertySuccessResponse,
  { credentials: FormData },
  { rejectValue: ErrorResponse; state: RootState }
>(
  "property/create",
  async ({ credentials }, { rejectWithValue }) => {
    const token = Cookies.get('token');
    
    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "Authentication required. Please login.",
      });
    }

    try {
      const response = await axios.post<AddPropertySuccessResponse>(
        `${BASE_URL}/api/admin/create-property`,
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

interface PropertyState {
  loading: boolean;
  success: boolean;
  error: string | null;
  validationErrors: Record<string, string[]> | null;
  propertyId: any | null;
}
const initialState: PropertyState = {
  loading: false,
  success: false,
  error: null,
  validationErrors: null,
  propertyId: null,
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    resetPropertyState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.validationErrors = null;
      state.propertyId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProperty.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.validationErrors = null;
        state.propertyId = null;
      })
      .addCase(createProperty.fulfilled, (state, action: PayloadAction<AddPropertySuccessResponse>) => {
        state.loading = false;
        state.success = true;
        state.propertyId = action.payload.data.property.id; // Fixed this line
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || "Failed to create property.";
        state.validationErrors = action.payload?.errors || null;
        state.propertyId = null;
      });
  },
});

export const { resetPropertyState } = propertySlice.actions;

export default propertySlice.reducer;