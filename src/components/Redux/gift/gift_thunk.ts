import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import api from "../middleware";

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}


export interface GiftRequest {
  id: number;
  user_id: number;
  gift_id: number;
  property_id: number;
  user_note: string | null;
  status: 'pending' | 'granted' | 'rejected';
  processed_at: string;
  created_at: string;
  updated_at: string;
  user: null | any;
  gift: {
    id: number;
    name: string;
    type: string;
    remaining_quantity: number;
  };
  property: {
    id: number;
    name: string;
    total_amount: number;
  };
}

export interface GiftRequestsResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: GiftRequest[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
  };
}

// Gift interface matching the actual API response
export interface Gift {
  id: number;
  name: string;
  type: string;
  estimated_value: number;
  measurement_unit: string;
  total_quantity: number;
  quantity_per_property: number;
  remaining_quantity: number;
  claimed_count: number;
  start_date: string;
  end_date: string;
  status: string;
  description: string;
  redemption_instructions: string;
  terms_and_conditions: string;
  display_image: string | null;
  metadata: {
    brand: string;
    warranty_period: string;
    installation_included: boolean;
  };
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  properties?: Array<{
    name: string;
    total_amount: number;
    pivot: {
      gift_id: number;
      property_id: number;
      fulfillment_status: string;
      assigned_at: string;
      created_at: string;
      updated_at: string;
    };
  }>;
}

// Stats interface from API
export interface GiftStats {
  total: number;
  pending: number;
  active: number;
  request: number;
}

// Single gift stats
export interface SingleGiftStats {
  total_property_assigned: number;
  total_fulfilled: number;
  total_unfulfilled: number;
  total_value: number;
}

// Create gift request
export interface CreateGiftRequest {
  name: string;
  type: string;
  estimated_value: number | string;
  total_quantity: number;
  quantity_per_property: number;
  measurement_unit: string;
  start_date: string;
  end_date: string;
  description: string;
  redemption_instructions: string;
  terms_and_conditions: string;
  status: string;
  metadata: {
    brand: string;
    warranty_period: string;
    installation_included: string;
  };
  display_image?: File | null;
}

// API Response for list of gifts
export interface GiftsListResponse {
  success: boolean;
  message: string;
  data: {
    stats: GiftStats;
    gifts: {
      current_page: number;
      data: Gift[];
      first_page_url: string;
      from: number | null;
      last_page: number;
      last_page_url: string;
      links: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
      next_page_url: string | null;
      path: string;
      per_page: number;
      prev_page_url: string | null;
      to: number | null;
      total: number;
    };
  };
}

// API Response for single gift
export interface SingleGiftResponse {
  success: boolean;
  message: string;
  data: {
    stats: SingleGiftStats;
    gift: Gift;
  };
}

// Create/Update response
export interface GiftMutationResponse {
  success: boolean;
  message: string;
  data: Gift;
}

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = "https://adron.microf10.sg-host.com"; // Fallback for local development

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = Cookies.get("token");
  if (!token) throw new Error("No authentication token found");
  return {
    Authorization: `Bearer ${token}`,
    identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
    device_id: "1010l0010l1",
  };
};

// Type guard to check if value is metadata object
function isMetadataObject(value: any): value is CreateGiftRequest['metadata'] {
  return value && typeof value === 'object' && !(value instanceof File) && ('brand' in value || 'warranty_period' in value);
}

// Helper function to safely append form data
function appendFormData(formData: FormData, key: string, value: any): void {
  if (value === undefined || value === null) return;
  
  // Handle metadata object
  if (key === "metadata" && isMetadataObject(value)) {
    if (value.brand) formData.append("metadata[brand]", value.brand);
    if (value.warranty_period) formData.append("metadata[warranty_period]", value.warranty_period);
    if (value.installation_included) formData.append("metadata[installation_included]", value.installation_included);
    return;
  }
  
  // Handle file
  if (value instanceof File) {
    formData.append(key, value);
    return;
  }
  
  // Handle primitive values (string, number, boolean)
  if (typeof value !== "object") {
    formData.append(key, value.toString());
    return;
  }
}

// ============================================
// CREATE GIFT
// ============================================
export const createGift = createAsyncThunk<
  GiftMutationResponse,
  CreateGiftRequest,
  { rejectValue: ErrorResponse }
>("gifts/create", async (giftData, { rejectWithValue }) => {
  try {
    const headers = getAuthHeaders();
    const formData = new FormData();
    
    // Safely append all form data
    Object.entries(giftData).forEach(([key, value]) => {
      appendFormData(formData, key, value);
    });

    const response = await api.post<GiftMutationResponse>(
      `${BASE_URL}/api/admin/gifts`,
      formData,
      { headers: { ...headers, "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      return rejectWithValue({ message: "Session expired. Please login again." });
    }
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to create gift",
      errors: error.response?.data?.errors,
    });
  }
});

// ============================================
// FETCH ALL GIFTS
// ============================================
export const fetchGifts = createAsyncThunk<
  GiftsListResponse,
  { page?: number; per_page?: number; search?: string; status?: string },
  { rejectValue: ErrorResponse }
>("gifts/fetchAll", async ({ page = 1, per_page = 20, search = "", status = "" }, { rejectWithValue }) => {
  try {
    const headers = getAuthHeaders();
    const params: any = { page, per_page };
    if (search) params.search = search;
    if (status) params.status = status;

    const response = await api.get<GiftsListResponse>(
      `${BASE_URL}/api/admin/gifts`,
      { headers, params }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      return rejectWithValue({ message: "Session expired. Please login again." });
    }
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to fetch gifts",
    });
  }
});

// ============================================
// FETCH SINGLE GIFT BY ID
// ============================================
export const fetchGiftById = createAsyncThunk<
  SingleGiftResponse,
  number,
  { rejectValue: ErrorResponse }
>("gifts/fetchById", async (id, { rejectWithValue }) => {
  try {
    const headers = getAuthHeaders();
    const response = await api.get<SingleGiftResponse>(
      `${BASE_URL}/api/admin/gifts/${id}`,
      { headers }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      return rejectWithValue({ message: "Session expired. Please login again." });
    }
    if (error.response?.status === 404) {
      return rejectWithValue({ message: "Gift not found" });
    }
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to fetch gift details",
    });
  }
});

// ============================================
// UPDATE GIFT (PUT Request)
// ============================================
export const updateGift = createAsyncThunk<
  GiftMutationResponse,
  { id: number; data: Partial<CreateGiftRequest> },
  { rejectValue: ErrorResponse }
>("gifts/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const headers = getAuthHeaders();
    const hasFile = data.display_image instanceof File;

    if (hasFile) {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append("_method", "PUT");
      
      // Safely append all form data
      Object.entries(data).forEach(([key, value]) => {
        appendFormData(formData, key, value);
      });

      const response = await api.post<GiftMutationResponse>(
        `${BASE_URL}/api/admin/gifts/${id}`,
        formData,
        { headers: { ...headers, "Content-Type": "multipart/form-data" } }
      );
      return response.data;
    } else {
      // Use regular PUT for JSON
      const response = await api.put<GiftMutationResponse>(
        `${BASE_URL}/api/admin/gifts/${id}`,
        data,
        { headers: { ...headers, "Content-Type": "application/json" } }
      );
      return response.data;
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      return rejectWithValue({ message: "Session expired. Please login again." });
    }
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to update gift",
      errors: error.response?.data?.errors,
    });
  }
});

// ============================================
// DELETE GIFT
// ============================================
export const deleteGift = createAsyncThunk<
  { success: boolean; message: string; id: number },
  number,
  { rejectValue: ErrorResponse }
>("gifts/delete", async (id, { rejectWithValue }) => {
  try {
    const headers = getAuthHeaders();
    const response = await api.delete<{ success: boolean; message: string }>(
      `${BASE_URL}/api/admin/gifts/${id}`,
      
      { headers }
    );
    return { ...response.data, id };
  } catch (error: any) {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      return rejectWithValue({ message: "Session expired. Please login again." });
    }
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to delete gift",
    });
  }
});

// ============================================
// UPDATE GIFT STATUS (Patch Request)
// ============================================
export const updateGiftStatus = createAsyncThunk<
  GiftMutationResponse,
  { id: number; status: string },
  { rejectValue: ErrorResponse }
>("gifts/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    const headers = getAuthHeaders();
    const response = await api.patch<GiftMutationResponse>(
      `${BASE_URL}/api/admin/gifts/${id}/status`,
      { status },
      { headers: { ...headers, "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      return rejectWithValue({ message: "Session expired. Please login again." });
    }
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to update gift status",
    });
  }
});

// ============================================
// ASSIGN GIFT TO PROPERTY
// ============================================
export const assignGiftToProperty = createAsyncThunk<
  { success: boolean; message: string; data: any },
  { giftId: number; propertyId: number },
  { rejectValue: ErrorResponse }
>("gifts/assignToProperty", async ({ giftId, propertyId }, { rejectWithValue }) => {
  try {
    const headers = getAuthHeaders();
    const response = await api.post(
      `${BASE_URL}/api/admin/gifts/${giftId}/assign`,
      { property_id: propertyId },
      { headers: { ...headers, "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      return rejectWithValue({ message: "Session expired. Please login again." });
    }
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to assign gift to property",
    });
  }
});

// ============================================
// BULK ASSIGN GIFTS TO PROPERTIES
// ============================================
// Add to gift_thunk.ts

// Bulk assign multiple gifts to multiple properties
export interface BulkAssignMultipleGiftsRequest {
  gift_ids: number[];
  property_ids: number[];
}

export const bulkAssignMultipleGifts = createAsyncThunk<
  { success: boolean; message: string; data: any },
  BulkAssignMultipleGiftsRequest,
  { rejectValue: ErrorResponse }
>("gifts/bulkAssignMultiple", async ({ gift_ids, property_ids }, { rejectWithValue }) => {
  try {
    const headers = getAuthHeaders();
    const response = await api.post(
      `${BASE_URL}/api/admin/gifts/bulk-assign`,
      { gift_ids, property_ids },
      { headers: { ...headers, "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      return rejectWithValue({ message: "Session expired. Please login again." });
    }
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to assign gifts to properties",
    });
  }
});

// ============================================
// GET GIFT STATISTICS
// ============================================
export const getGiftStatistics = createAsyncThunk<
  { success: boolean; message: string; data: GiftStats },
  void,
  { rejectValue: ErrorResponse }
>("gifts/getStatistics", async (_, { rejectWithValue }) => {
  try {
    const headers = getAuthHeaders();
    const response = await api.get(
      `${BASE_URL}/api/admin/gifts/statistics`,
      { headers }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      return rejectWithValue({ message: "Session expired. Please login again." });
    }
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to fetch gift statistics",
    });
  }
});



export const fetchGiftRequests = createAsyncThunk<
  GiftRequestsResponse,
  { gift_id?: number; property_id?: number; status?: string },
  { rejectValue: ErrorResponse }
>("gifts/fetchRequests", async ({ gift_id, property_id, status = "" }, { rejectWithValue }) => {
  try {
    const headers = getAuthHeaders();
    const params: any = {};
    if (gift_id) params.gift_id = gift_id;
    if (property_id) params.property_id = property_id;
    if (status) params.status = status;

    const response = await api.get<GiftRequestsResponse>(
      `${BASE_URL}/api/admin/gifts/requests`,
      { headers, params }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      return rejectWithValue({ message: "Session expired. Please login again." });
    }
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to fetch gift requests",
    });
  }
});

// Grant/Approve a gift request
export const grantGiftRequest = createAsyncThunk<
  { success: boolean; message: string; data: any },
  { requestId: number; giftId: number },
  { rejectValue: ErrorResponse }
>("gifts/grantRequest", async ({ requestId, giftId }, { rejectWithValue }) => {
  try {
    const headers = getAuthHeaders();
    const response = await api.post(
      `${BASE_URL}/api/admin/gifts/${giftId}/grant`,
      { request_id: requestId },
      { headers: { ...headers, "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      return rejectWithValue({ message: "Session expired. Please login again." });
    }
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to grant gift request",
    });
  }
});

// Reject a gift request
export const rejectGiftRequest = createAsyncThunk<
  { success: boolean; message: string; data: any },
  { requestId: number; giftId: number },
  { rejectValue: ErrorResponse }
>("gifts/rejectRequest", async ({ requestId, giftId }, { rejectWithValue }) => {
  try {
    const headers = getAuthHeaders();
    const response = await api.post(
      `${BASE_URL}/api/admin/gifts/${giftId}/reject`,
      { request_id: requestId },
      { headers: { ...headers, "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      return rejectWithValue({ message: "Session expired. Please login again." });
    }
    return rejectWithValue({
      message: error.response?.data?.message || "Failed to reject gift request",
    });
  }
});