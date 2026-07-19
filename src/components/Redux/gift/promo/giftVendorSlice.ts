import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../middleware";

export interface GiftVendor {
  id: number;
  name: string;
  email: string;
  phone: string;
  lga: string;
  state: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface GiftVendorRequest {
  id: number;
  user_id: number;
  promo_id: number;
  property_id: number;
  user_note: string;
  status: string;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
  vendor_id: number;
  promo?: {
    id: number;
    name: string;
    is_active?: number;
  } | null;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    phone_number?: string;
    referral_link?: string | null;
  } | null;
  gift?: any;
}

export interface GiftVendorDetail extends GiftVendor {
  gift_requests: GiftVendorRequest[];
}

export interface GiftVendorPayload {
  name: string;
  phone: string;
  email: string;
  lga: string;
  address: string;
  state: string;
}

interface GiftVendorState {
  vendors: GiftVendor[];
  selectedVendor: GiftVendorDetail | null;
  loading: boolean;
  detailLoading: boolean;
  downloadLoading: boolean;
  submitStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
}

const initialState: GiftVendorState = {
  vendors: [],
  selectedVendor: null,
  loading: false,
  detailLoading: false,
  downloadLoading: false,
  submitStatus: "idle",
  error: null,
  pagination: {
    currentPage: 1,
    perPage: 20,
    total: 0,
    lastPage: 1,
  },
};

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GIFT_VENDOR_URL = `${BASE_URL}/api/admin/gift-vendors`;

export const fetchGiftVendors = createAsyncThunk(
  "giftVendors/fetchGiftVendors",
  async (params: { page?: number; per_page?: number } = {}, { rejectWithValue }) => {
    try {
      const { page = 1, per_page = 20 } = params;
      const response = await api.get(GIFT_VENDOR_URL, {
        params: { page, per_page },
      });

      if (response.data?.success) {
        return response.data;
      }

      return rejectWithValue(response.data?.message || "Failed to fetch vendors");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vendors",
      );
    }
  },
);

export const createGiftVendor = createAsyncThunk(
  "giftVendors/createGiftVendor",
  async (payload: GiftVendorPayload, { rejectWithValue }) => {
    try {
      const response = await api.post(GIFT_VENDOR_URL, payload);

      if (response.data?.success) {
        return response.data;
      }

      return rejectWithValue(response.data?.message || "Failed to create vendor");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create vendor",
      );
    }
  },
);

export const updateGiftVendor = createAsyncThunk(
  "giftVendors/updateGiftVendor",
  async (
    { vendorId, payload }: { vendorId: number; payload: GiftVendorPayload },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(`${GIFT_VENDOR_URL}/${vendorId}`, payload);

      if (response.data?.success) {
        return response.data;
      }

      return rejectWithValue(response.data?.message || "Failed to update vendor");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update vendor",
      );
    }
  },
);

export const deleteGiftVendor = createAsyncThunk(
  "giftVendors/deleteGiftVendor",
  async (vendorId: number, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${GIFT_VENDOR_URL}/${vendorId}`);

      if (response.data?.success) {
        return { ...response.data, vendorId };
      }

      return rejectWithValue(response.data?.message || "Failed to delete vendor");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete vendor",
      );
    }
  },
);

export const downloadVendorGiftRequests = createAsyncThunk(
  "giftVendors/downloadVendorGiftRequests",
  async (
    {
      vendorId,
      startDate,
      endDate,
    }: { vendorId: number; startDate?: string; endDate?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.get(
        `${BASE_URL}/api/admin/gift-vendors/${vendorId}/pdf/download`,
        {
          params: {
            start_date: startDate,
            end_date: endDate,
          },
        },
      );

      if (response.data?.success) {
        return response.data;
      }

      return rejectWithValue(response.data?.message || "Failed to download report");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to download report",
      );
    }
  },
);

export const fetchGiftVendorById = createAsyncThunk(
  "giftVendors/fetchGiftVendorById",
  async (vendorId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`${GIFT_VENDOR_URL}/${vendorId}`);

      if (response.data?.success) {
        return response.data;
      }

      return rejectWithValue(response.data?.message || "Failed to fetch vendor");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch vendor",
      );
    }
  },
);

const giftVendorSlice = createSlice({
  name: "giftVendors",
  initialState,
  reducers: {
    setGiftVendorsPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    clearSelectedGiftVendor: (state) => {
      state.selectedVendor = null;
    },
    resetGiftVendorSubmitStatus: (state) => {
      state.submitStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGiftVendors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGiftVendors.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload.data;
        state.vendors = data?.data || [];
        state.pagination = {
          currentPage: data?.current_page || 1,
          perPage: data?.per_page || 20,
          total: data?.total || 0,
          lastPage: data?.last_page || 1,
        };
      })
      .addCase(fetchGiftVendors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createGiftVendor.pending, (state) => {
        state.submitStatus = "loading";
        state.error = null;
      })
      .addCase(createGiftVendor.fulfilled, (state, action) => {
        state.submitStatus = "succeeded";
        const vendor = action.payload.data as GiftVendor;
        state.vendors = [vendor, ...state.vendors];
        state.pagination.total += 1;
      })
      .addCase(createGiftVendor.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateGiftVendor.pending, (state) => {
        state.submitStatus = "loading";
        state.error = null;
      })
      .addCase(updateGiftVendor.fulfilled, (state, action) => {
        state.submitStatus = "succeeded";
        const vendor = action.payload.data as GiftVendor;
        const index = state.vendors.findIndex((item) => item.id === vendor.id);
        if (index !== -1) {
          state.vendors[index] = vendor;
        }
        if (state.selectedVendor?.id === vendor.id) {
          state.selectedVendor = {
            ...state.selectedVendor,
            ...vendor,
          };
        }
      })
      .addCase(updateGiftVendor.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteGiftVendor.pending, (state) => {
        state.submitStatus = "loading";
        state.error = null;
      })
      .addCase(deleteGiftVendor.fulfilled, (state, action) => {
        state.submitStatus = "succeeded";
        state.vendors = state.vendors.filter(
          (vendor) => vendor.id !== action.payload.vendorId,
        );
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.selectedVendor?.id === action.payload.vendorId) {
          state.selectedVendor = null;
        }
      })
      .addCase(deleteGiftVendor.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.error = action.payload as string;
      })
      .addCase(downloadVendorGiftRequests.pending, (state) => {
        state.downloadLoading = true;
        state.error = null;
      })
      .addCase(downloadVendorGiftRequests.fulfilled, (state) => {
        state.downloadLoading = false;
      })
      .addCase(downloadVendorGiftRequests.rejected, (state, action) => {
        state.downloadLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchGiftVendorById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchGiftVendorById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedVendor = action.payload.data;
      })
      .addCase(fetchGiftVendorById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setGiftVendorsPage,
  clearSelectedGiftVendor,
  resetGiftVendorSubmitStatus,
} = giftVendorSlice.actions;

export const selectGiftVendors = (state: { giftVendors: GiftVendorState }) =>
  state.giftVendors.vendors;
export const selectGiftVendorPagination = (state: { giftVendors: GiftVendorState }) =>
  state.giftVendors.pagination;
export const selectGiftVendorsLoading = (state: { giftVendors: GiftVendorState }) =>
  state.giftVendors.loading;
export const selectGiftVendorDetailLoading = (state: {
  giftVendors: GiftVendorState;
}) => state.giftVendors.detailLoading;
export const selectGiftVendorDownloadLoading = (state: {
  giftVendors: GiftVendorState;
}) => state.giftVendors.downloadLoading;
export const selectGiftVendorSubmitStatus = (state: {
  giftVendors: GiftVendorState;
}) => state.giftVendors.submitStatus;
export const selectGiftVendorError = (state: { giftVendors: GiftVendorState }) =>
  state.giftVendors.error;
export const selectSelectedGiftVendor = (state: { giftVendors: GiftVendorState }) =>
  state.giftVendors.selectedVendor;

export default giftVendorSlice.reducer;
