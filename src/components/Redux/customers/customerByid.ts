import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RootState } from "../store";

// Interface for the active plan
export interface ActivePlan {
  id: number;
  property_id: number;
  user_id: number;
  property_type: number;
  total_amount: number;
  paid_amount: number;
  remaining_balance: number;
  status: number;
  payment_percentage: number;
  payment_completed_at: string | null;
  created_at: string;
  updated_at: string;
  monthly_duration: string | null;
  payment_type: string;
  end_date: string | null;
  start_date: string | null;
  payment_method: string | null;
  repayment_schedule: string | null;
  next_payment_date: string | null;
  marketer_id: number;
  infrastructure_percentage: number;
  infrastructure_amount: number;
  other_percentage: number;
  other_amount: number;
  remaining_infrastructure_balance: number;
  remaining_other_balance: number;
  paid_infrastructure_amount: number;
  paid_other_amount: number;
}

// Interface for property photos and features
interface PropertyPhoto {
  id?: number;
  url: string;
}

interface PropertyFeature {
  name: string;
}

// Interface for the property
export interface Property {
  id: number;
  name: string;
  display_image: string;
  photos: PropertyPhoto[];
  size: string;
  price: number;
  type: number;
  no_of_bedroom: number;
  slug: string;
  features: PropertyFeature[];
  overview: string;
  description: string;
  street_address: string;
  country: string;
  state: string;
  lga: string;
  created_at: string;
  updated_at: string;
  area: string;
  property_map: string;
  property_video: string;
  virtual_tour: string;
  subscriber_form: string | null;
  status: string;
  initial_deposit: number;
  is_sold: number;
  is_active: number;
  property_duration_limit: number;
  payment_schedule: string[];
  category: string;
  is_discount: boolean;
  discount_name: string;
  discount_percentage: number;
  discount_units: number;
  discount_start_date: string;
  discount_end_date: string;
  parking_space: string;
  number_of_bathroom: number;
  number_of_unit: number;
  property_agreement: string | null;
  payment_type: string | null;
  location_type: string | null;
  purpose: string | null;
  year_built: string | null;
  shape: string | null;
  topography: string | null;
  title_document_type: string | null;
  road_access: string | null;
  director_id: string | null;
  total_amount: number;
}

// Interface for listed property
export interface ListedProperty {
  id: number;
  user_id: number;
  property_id: number;
  created_at: string;
  updated_at: string;
  type: number;
  status: number;
  plan_id: number;
  marketer_id: string;
  property: Property;
}

// Interface for the customer
export interface Customer {
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
  gender: string;
  notification_enabled: number;
  device_id: string;
  address: string;
  created_at: string;
  updated_at: string;
  personnel: string;
  contract_id: string | null;
}

// Interface for the API response
export interface CustomerByIdResponse {
  status: string;
  message: string;
  total_paid: string;
  pending_paid: string;
  active_property: number;
  viewed_property: number;
  saved_property: number;
  owned_property: number;
  customer: Customer;
  active_plan: ActivePlan[];
  list_property: ListedProperty[];
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

interface CustomerByIdState {
  loading: boolean;
  data: CustomerByIdResponse | null;
  error: ErrorResponse | null;
}

const initialState: CustomerByIdState = {
  loading: false,
  data: null,
  error: null,
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchCustomerById = createAsyncThunk<
  CustomerByIdResponse,
  any,
  { rejectValue: ErrorResponse; state: RootState }
>(
  "customer/fetchCustomerById",
  async (customerId, { rejectWithValue }) => {
    const token = Cookies.get('token');
    
    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "Authentication required. Please login.",
      });
    }

    try {
      const response = await axios.get<CustomerByIdResponse>(
        `${BASE_URL}/api/admin/customer/${customerId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'identifier': "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            'device_id': "1010l0010l1",
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
            : "Failed to fetch customer data");
        
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

const customerByIdSlice = createSlice({
  name: "customerById",
  initialState,
  reducers: {
    resetCustomerByIdState: (state) => {
      state.loading = false;
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action: PayloadAction<CustomerByIdResponse>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "An unknown error occurred" };
      });
  },
});

export const { resetCustomerByIdState } = customerByIdSlice.actions;
export default customerByIdSlice.reducer;