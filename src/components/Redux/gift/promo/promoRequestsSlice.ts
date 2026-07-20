// Redux/gift/promo/promoRequestsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../middleware";
import { toast } from "react-toastify";

// Types
export interface PromoRequestUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  referral_link: string | null;
}

export interface PromoRequestProperty {
  id: number;
  name: string;
  total_amount: number;
  has_gifts: boolean;
  promotions: any[];
}

export interface PromoRequest {
  id: number;
  user_id: number;
  promo_id: number;
  property_id: number;
  user_note: string;
  status: "pending" | "approved" | "disapproved" |'picked';
  processed_at: string | null;
  created_at: string;
  updated_at: string;
  reward_group_id: number;
  user: PromoRequestUser;
  property: PromoRequestProperty;
  reward_group: any | null;
  promo: {
    name: string;
  };
  items: [
    {
      name: string;
      qty: number;
      item_price: number;
      item_id: string;
    },
  ];
}

export interface PromoRequestsStats {
  total: number;
  approved: number;
  disapproved: number;
  pending: number;
}

export interface PromoRequestsResponse {
  success: boolean;
  stats: PromoRequestsStats;
  promo: {
    id: any;
    name: string;
    is_active: number;
  };

  data: {
    current_page: number;
    data: PromoRequest[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: any[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

interface PromoRequestsState {
  requests: PromoRequest[];
  stats: PromoRequestsStats | null;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
  promo: {
    id: any;
    name: string;
    is_active: number | null;
  };

  currentRequest: PromoRequest | null;
  submitStatus: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: PromoRequestsState = {
  requests: [],
  stats: null,
  isLoading: false,
  error: null,
  success: false,
  pagination: {
    currentPage: 1,
    perPage: 20,
    total: 0,
    lastPage: 1,
  },
  currentRequest: null,
  submitStatus: "idle",
  promo: {
    id: 0,
    name: "",
    is_active: null,
  },
};

// API URLs
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PROMO_REQUESTS_URL = `${BASE_URL}/api/admin/promo`;

// Async Thunks

// Fetch promo requests by promo ID
export const fetchPromoRequests = createAsyncThunk(
  "promoRequests/fetchPromoRequests",
  async (
    params: {
      promoId: string | number;
      page?: number;
      per_page?: number;
      status?: string;
      search?: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const {
        promoId,
        page = 1,
        per_page = 20,
        status = "",
        search = "",
      } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
        ...(status && { status }),
        ...(search && { search }),
      });

      const response = await api.get(
        `${PROMO_REQUESTS_URL}/${promoId}/requests?${queryParams}`,
      );

      if (response.data && response.data.success) {
        return {
          success: true,
          stats: response.data.stats,
          promo: response.data.promo,
          data: response.data.data.data,
          pagination: {
            currentPage: response.data.data.current_page,
            perPage: response.data.data.per_page,
            total: response.data.data.total,
            lastPage: response.data.data.last_page,
          },
        };
      }

      return rejectWithValue("Failed to fetch promo requests");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch promo requests",
      );
    }
  },
);
// Add this new async thunk after the other thunks
export const setPromoRequestPickupDate = createAsyncThunk(
  "promoRequests/setPromoRequestPickupDate",
  async (
    { id, pickup_date }: { id: string | number; pickup_date: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(
        `${BASE_URL}/api/admin/promo/requests/pickup`,
        {
          id,
          pickup_date,
        },
      );

      if (response.data && response.data.success) {
        toast.success(response.data.message || "Pickup date set successfully");
        return response.data;
      }

      return rejectWithValue("Failed to set pickup date");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to set pickup date",
      );
    }
  },
);

// Also modify the approvePromoRequest thunk to not show success toast immediately
export const approvePromoRequest = createAsyncThunk(
  "promoRequests/approvePromoRequest",
  async (requestId: string | number, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${PROMO_REQUESTS_URL}/requests/${requestId}/approve`,
      );

      if (response.data && response.data.success) {
        // Remove toast.success from here - we'll show it after pickup date is set
        return response.data;
      }

      return rejectWithValue("Failed to approve promo request");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve promo request",
      );
    }
  },
);
// Approve promo request
// export const approvePromoRequest = createAsyncThunk(
//   'promoRequests/approvePromoRequest',
//   async (requestId: string | number, { rejectWithValue }) => {
//     try {
//       const response = await api.post(`${PROMO_REQUESTS_URL}/requests/${requestId}/approve`);

//       if (response.data && response.data.success) {
//         toast.success(response.data.message || 'Promo request approved successfully');
//         return response.data;
//       }

//       return rejectWithValue('Failed to approve promo request');
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to approve promo request');
//     }
//   }
// );

// Disapprove promo request
export const disapprovePromoRequest = createAsyncThunk(
  "promoRequests/disapprovePromoRequest",
  async (requestId: string | number, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `${PROMO_REQUESTS_URL}/requests/${requestId}/disapprove`,
      );

      if (response.data && response.data.success) {
        toast.success(
          response.data.message || "Promo request disapproved successfully",
        );
        return response.data;
      }

      return rejectWithValue("Failed to disapprove promo request");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to disapprove promo request",
      );
    }
  },
);

// Fetch single request by ID
export const fetchPromoRequestById = createAsyncThunk(
  "promoRequests/fetchPromoRequestById",
  async (requestId: string | number, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${PROMO_REQUESTS_URL}/requests/${requestId}`,
      );

      if (response.data && response.data.success) {
        return response.data.data;
      }

      return rejectWithValue("Failed to fetch promo request");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch promo request",
      );
    }
  },
);

const promoRequestsSlice = createSlice({
  name: "promoRequests",
  initialState,
  reducers: {
    resetPromoRequestsState: (state) => {
      state.requests = [];
      state.stats = null;
      state.isLoading = false;
      state.error = null;
      state.success = false;
      state.pagination = initialState.pagination;
      state.currentRequest = null;
      state.submitStatus = "idle";
    },

    clearPromoRequestsError: (state) => {
      state.error = null;
    },

    setPromoRequestsPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },

    setPromoRequestsStatusFilter: (state, action: PayloadAction<string>) => {
      state.pagination.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch promo requests
      .addCase(fetchPromoRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPromoRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload.data;
        state.promo = action.payload.promo;
        state.stats = action.payload.stats;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchPromoRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(
          (action.payload as string) || "Failed to fetch promo requests",
        );
      })

      // Approve promo request
      .addCase(approvePromoRequest.pending, (state) => {
        state.submitStatus = "loading";
        state.error = null;
      })
      .addCase(approvePromoRequest.fulfilled, (state, action) => {
        state.submitStatus = "succeeded";
        state.success = true;
        // Don't show toast here - will show after pickup date is set
        // Just update the state without showing success message
        const updatedRequest = action.payload.data;
        const index = state.requests.findIndex(
          (req) => req.id === updatedRequest.id,
        );
        if (index !== -1) {
          state.requests[index] = {
            ...state.requests[index],
            ...updatedRequest,
          };
        }
      })

      .addCase(approvePromoRequest.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.error = action.payload as string;
        toast.error(
          (action.payload as string) || "Failed to approve promo request",
        );
      })

      // Disapprove promo request
      .addCase(disapprovePromoRequest.pending, (state) => {
        state.submitStatus = "loading";
        state.error = null;
      })
      .addCase(disapprovePromoRequest.fulfilled, (state, action) => {
        state.submitStatus = "succeeded";
        state.success = true;
        // Update the request status in the list
        const updatedRequest = action.payload.data;
        const index = state.requests.findIndex(
          (req) => req.id === updatedRequest.id,
        );
        if (index !== -1) {
          state.requests[index] = {
            ...state.requests[index],
            ...updatedRequest,
            status: "rejected",
          };
        }
        // Update stats
        if (state.stats) {
          state.stats.disapproved += 1;
          if (updatedRequest.status === "pending") {
            state.stats.pending = Math.max(0, state.stats.pending - 1);
          }
        }
      })
      .addCase(disapprovePromoRequest.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.error = action.payload as string;
        toast.error(
          (action.payload as string) || "Failed to disapprove promo request",
        );
      })

      // Fetch single request
      .addCase(fetchPromoRequestById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPromoRequestById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRequest = action.payload;
        state.error = null;
      })
      .addCase(fetchPromoRequestById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        toast.error(
          (action.payload as string) || "Failed to fetch promo request",
        );
      })

      .addCase(setPromoRequestPickupDate.pending, (state) => {
        state.submitStatus = "loading";
        state.error = null;
      })
      .addCase(setPromoRequestPickupDate.fulfilled, (state, action) => {
        state.submitStatus = "succeeded";
        state.success = true;
        // Update the request status in the list if needed
        const updatedRequest = action.payload.data;
        if (updatedRequest) {
          const index = state.requests.findIndex(
            (req) => req.id === updatedRequest.id,
          );
          if (index !== -1) {
            state.requests[index] = {
              ...state.requests[index],
              ...updatedRequest,
              status: "granted",
            };
          }
          // Update stats
          if (state.stats) {
            state.stats.approved += 1;
            if (updatedRequest.status === "pending") {
              state.stats.pending = Math.max(0, state.stats.pending - 1);
            }
          }
        }
        toast.success(
          "Promo request approved and pickup date set successfully",
        );
      })
      .addCase(setPromoRequestPickupDate.rejected, (state, action) => {
        state.submitStatus = "failed";
        state.error = action.payload as string;
        toast.error((action.payload as string) || "Failed to set pickup date");
      });
  },
});

// Export actions
export const {
  resetPromoRequestsState,
  clearPromoRequestsError,
  setPromoRequestsPage,
  setPromoRequestsStatusFilter,
} = promoRequestsSlice.actions;

// Export selectors
export const selectPromoRequests = (state: {
  promoRequests: PromoRequestsState;
}) => state.promoRequests.requests;
export const selectPromoRequestsStats = (state: {
  promoRequests: PromoRequestsState;
}) => state.promoRequests.stats;
export const selectPromoRequestsPromo = (state: {
  promoRequests: PromoRequestsState;
}) => state.promoRequests.promo;
export const selectPromoRequestsLoading = (state: {
  promoRequests: PromoRequestsState;
}) => state.promoRequests.isLoading;
export const selectPromoRequestsError = (state: {
  promoRequests: PromoRequestsState;
}) => state.promoRequests.error;
export const selectPromoRequestsPagination = (state: {
  promoRequests: PromoRequestsState;
}) => state.promoRequests.pagination;
export const selectPromoRequestsSubmitStatus = (state: {
  promoRequests: PromoRequestsState;
}) => state.promoRequests.submitStatus;
export const selectCurrentPromoRequest = (state: {
  promoRequests: PromoRequestsState;
}) => state.promoRequests.currentRequest;

export default promoRequestsSlice.reducer;
