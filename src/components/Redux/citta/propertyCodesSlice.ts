// propertyCodesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import api from "../middleware";

// Types
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface PropertyCode {
  id: number;
  property_code: string;
  property_name: string;
  created_at: string;
  updated_at: string;
}

export interface PropertyCodesResponse {
  success: boolean;
  property_codes: PropertyCode[];
}

interface PropertyCodesState {
  loading: boolean;
  error: string | null;
  success: boolean;
  propertyCodes: PropertyCode[];
}

const initialState: PropertyCodesState = {
  loading: false,
  error: null,
  success: false,
  propertyCodes: [],
};

// 🔥 Thunk for fetching property codes
export const fetchPropertyCodes = createAsyncThunk<
  PropertyCodesResponse,
  void,
  { rejectValue: ErrorResponse }
>("propertyCodes/fetchPropertyCodes", async (_, { rejectWithValue }) => {
  const token = Cookies.get("token");

  if (!token) {
    return rejectWithValue({
      message: "No authentication token found. Please login again.",
    });
  }

  try {
    const response = await api.get<PropertyCodesResponse>(
      "https://adron.microf10.sg-host.com/api/erp-properties",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
          device_id: "1010l0010l1",
        },
      }
    );

    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;

    if (axiosError.response?.status === 401) {
      Cookies.remove("token");
      toast.error("Session expired. Please login again.");
    }

    if (axiosError.response) {
      return rejectWithValue({
        message:
          axiosError.response.data.message || "Failed to fetch property codes",
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

// 🔥 Slice
const propertyCodesSlice = createSlice({
  name: "propertyCodes",
  initialState,
  reducers: {
    resetPropertyCodesState: () => initialState,
    setPropertyCodes: (state, action: PayloadAction<PropertyCode[]>) => {
      state.propertyCodes = action.payload;
    },
    clearPropertyCodes: (state) => {
      state.propertyCodes = [];
    },
    resetSuccess: (state) => {
    state.success = false;
  },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertyCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        fetchPropertyCodes.fulfilled,
        (state, action: PayloadAction<PropertyCodesResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.propertyCodes = action.payload.property_codes;
          state.error = null;

          if (
            action.payload.success &&
            action.payload.property_codes.length > 0
          ) {
            // toast.success("Property codes loaded successfully");
          } else if (action.payload.property_codes.length === 0) {
            toast.info("No property codes found");
          }
        }
      )
      .addCase(fetchPropertyCodes.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error =
          action.payload && "message" in action.payload
            ? action.payload.message
            : action.error.message || "Failed to fetch property codes";

        if (state.error) {
          toast.error(state.error);
        }
      });
  },
});

// Selectors
export const selectPropertyCodes = (state: {
  propertyCodes: PropertyCodesState;
}) => state.propertyCodes.propertyCodes;

export const selectPropertyCodesLoading = (state: {
  propertyCodes: PropertyCodesState;
}) => state.propertyCodes.loading;

export const selectPropertyCodesError = (state: {
  propertyCodes: PropertyCodesState;
}) => state.propertyCodes.error;

export const selectPropertyCodesSuccess = (state: {
  propertyCodes: PropertyCodesState;
}) => state.propertyCodes.success;


export const selectPropertyCodesForDropdown = (state: {
  propertyCodes: PropertyCodesState;
}) =>
  state.propertyCodes.propertyCodes.map((property) => ({
    value: property.property_code,
    label: `${property.property_code} - ${property.property_name}`,
    id: property.id,
    fullData: property,
  }));

// Exports
export const {
  resetPropertyCodesState,
  setPropertyCodes,
  clearPropertyCodes,
} = propertyCodesSlice.actions;
export default propertyCodesSlice.reducer;
