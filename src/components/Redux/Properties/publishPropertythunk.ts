import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";
import api from "../middleware";



export interface PublishDraftSuccessResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    display_image: string;
    photos: string[];
    size: string;
    price: number;
    type: number;
    no_of_bedroom: number;
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
    area: string;
    property_map: string;
    property_video: string;
    virtual_tour: string;
    subscriber_form: null;
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
    property_agreement: string;
    payment_type: string;
    location_type: string;
    purpose: null;
    year_built: null;
    shape: null;
    topography: null;
    title_document_type: null;
    road_access: null;
    director_id: number;
    unit_available: number;
    unit_sold: number;
    property_view: number;
    property_requests: number;
    video_link: null;
    video_file: null;
    nearby_landmarks: null;
    gated_estate: string;
    fencing: null;
    contact_number: null;
    whatsapp_link: null;
    rent_duration: null;
    toilets: null;
    building_condition: null;
    fees_charges: null;
    is_featured: number;
    total_amount: number;
  };
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const publishDraft = createAsyncThunk<
  PublishDraftSuccessResponse,
  number, // The property ID
  { rejectValue: ErrorResponse; state: RootState }
>(
  "properties/publish-draft",
  async (propertyId, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      return rejectWithValue({
        message: "Authentication required. Please login.",
      });
    }

    try {
      const response = await api.get<PublishDraftSuccessResponse>(
        `${BASE_URL}/api/admin/publish-draft/${propertyId}`,
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