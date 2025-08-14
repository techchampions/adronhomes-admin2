import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";
import api from "../middleware";

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
export interface Property {
  id: number;
  name: string;
  display_image: string;
  photos: string[];
  size: string;
  price: number;
  type: number;
  no_of_bedroom: number | null;
  slug: string;
  features: string[] | string;
  overview: string;
  description: string;
  street_address: string;
  country: string | null;
  state: string | null;
  lga: string | null;
  created_at: string | null;
  updated_at: string | null;
  area: string | null;
  property_map: string | null;
  property_video: string | null;
  virtual_tour: string | null;
  subscriber_form: string | null;
  status: string;
  initial_deposit: number;
  is_sold: number;
  is_active: number;
  property_duration_limit: number;
  payment_schedule: string[] | string | null;
  category: string;
  is_discount: boolean;
  discount_name: string | null;
  discount_percentage: number | null;
  discount_units: number | null;
  discount_start_date: string | null;
  discount_end_date: string | null;
  parking_space: string | null;
  number_of_bathroom: number | null;
  number_of_unit: number | null;
  property_agreement: string | null;
  payment_type: string | null;
  location_type: string | null;
  purpose: string | null;
  year_built: string | null;
  total_amount: number;
  unit_available: any;
  unit_sold: any;
  property_view: any;
  property_requests: any;
}

export interface PaginationData<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
export interface PropertiesResponse {
  status: string;
  message: string;
  total_properties: number;
    total_published: number,
    total_drafted: number,
  total_sold: number;
  drafted_properties: PaginationData<Property>;
  published_properties: PaginationData<Property>;
  sold_properties: PaginationData<Property>;
}
export interface PropertiesState {
  drafted: {
    data: Property[];
    loading: boolean;
    error: ErrorResponse | null;
    pagination: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
    };
  };
  published: {
    data: Property[];
    loading: boolean;
    error: ErrorResponse | null;
    pagination: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
    };
  };
  sold: {
    data: Property[];
    loading: boolean;
    error: ErrorResponse | null;
    pagination: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
    };
  };
  stats: {
    totalProperties: number;
    totalSold: number;
    total_published: number,
    total_drafted: number,
  };
  loading: boolean;
  error: ErrorResponse | null;
}
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchProperties = createAsyncThunk<
  PropertiesResponse,
  void,
  { rejectValue: ErrorResponse; state: RootState }
>("properties/fetch", async (_, { rejectWithValue, getState }) => {
  const token = Cookies.get("token");
  const state = getState() as RootState;
  const currentPage = state.properties?.published.pagination.currentPage || 1;
  const page = state.properties?.published.pagination.currentPage || 1;
  if (!token) {
    return rejectWithValue({
      message: "No authentication token found. Please login again.",
    });
  }

  try {
    const response = await api.get<PropertiesResponse>(
      `${BASE_URL}/api/admin/properties`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
          device_id: "1010l0010l1",
        },
        params: {
          page: currentPage,
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
          axiosError.response.data.message || "Failed to fetch properties data",
        errors: axiosError.response.data.errors,
      });
    } else if (axiosError.request) {
      return rejectWithValue({
        message:
          "No response from server. Please check your network connection.",
      });
    }
    return rejectWithValue({
      message: "An unexpected error occurred. Please try again.",
    });
  }
});
