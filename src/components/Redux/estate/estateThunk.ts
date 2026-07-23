// estateThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import api from "../middleware";
import { RootState } from "../store";

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface Estate {
  id: number;
  property_id?: number;
  estate_name: string;
  property_slug: string;
  total_member: number;
  is_operating: number;
  total_unread_messages: number;
  total_maintenance_requests: number;
  pending_maintenance_requests: string;
  total_security_codes_generated: number;
}

export interface EstateMetrics {
  total_estates: number;
  total_maintenance_requests: number;
  pending_maintenance_requests: number;
  total_security_codes_generated: number;
  total_unread_messages?: number;
}

export interface PaginatedData<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
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
  to: number;
  total: number;
}

export interface AllEstatesResponse {
  success: boolean;
  message: string;
  data: {
    metrics: EstateMetrics;
    estates: PaginatedData<Estate>;
  };
}

export interface EstateUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_picture: string | null;
  joined_at: string;
  private_unread_count: number;
  group_unread_count: number;
  unread_count: number;
}

export interface GroupConversation {
  id: number;
  estate_id: number;
  last_message: string;
  channel: string;
  created_at: string;
  updated_at: string;
}

export interface EstateUsersResponse {
  success: boolean;
  message: string;
  data: {
    estate_info: {
      id: number;
      property_id?: number;
      estate_name: string;
      property_slug: string;
      is_operating: number;
      total_unread_messages: number;
    };
    group_conversation: GroupConversation | null;
    metrics: {
      total_users: number;
      admin_total_unread: number;
      admin_group_unread: number;
      total_unread_messages: number;
    };
    users: PaginatedData<EstateUser>;
  };
}

export interface Payment {
  id: number;
  user_id: number;
  estate_id: number;
  description: string;
  payment_method: string;
  payment_type: string;
  reference: string;
  status: number;
  purpose: string;
  created_at: string;
  updated_at: string;
  chargeable_id: number;
  user_first_name: string;
  user_last_name: string;
  user_profile_picture: string | null;
}

export interface ChatMessage {
  id: number;
  sender: number;
  channel: string;
  receiver: number;
  message: string;
  type: string;
  created_at: string;
  updated_at: string;
  sender_first_name?: string;
  sender_last_name?: string;
  sender_profile_picture: string | null;
  receiver_first_name?: string;
  receiver_last_name?: string;
  receiver_profile_picture: string | null;
}

export interface CommunityMessage {
  id: number;
  channel: string;
  user_id: number;
  message: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

export interface CommunityConversation extends GroupConversation {
  estate_name?: string;
  estate_slug?: string;
  member_count?: number;
  unread_count?: number;
}

export interface ChatReplyRequest {
  estate_id: number;
  receiver_id: number;
  message: string;
}

export interface ChatReplyResponse {
  success: boolean;
  message: string;
  data: ChatMessage;
}

export interface SingleUserEstateInfo {
  client: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_picture: string | null;
  };
  estate: {
    id: number;
    property_id: number;
    property_slug: string;
    estate_name: string;
    total_member: number;
    is_operating: number;
    created_at: string;
    updated_at: string;
    total_unread_messages: number;
    unread_count: number;
  };
  payments: PaginatedData<Payment>;
  maintenance: PaginatedData<any>;
  chats: PaginatedData<ChatMessage>;
}

export interface SingleUserResponse {
  success: boolean;
  message: string;
  data: SingleUserEstateInfo;
}

export interface MarkAsReadResponse {
  success: boolean;
  message: string;
}

export interface CommunityMessagesResponse {
  success: boolean;
  message: string;
  data: {
    conversation: CommunityConversation;
    messages: PaginatedData<CommunityMessage>;
  };
}

export interface SendCommunityMessageResponse {
  success: boolean;
  message: string;
  data: {
    message: CommunityMessage;
    conversation: CommunityConversation;
  };
}

export interface CreateEstateCommunityResponse {
  success: Estate;
  message: string;
}

export interface AssignEstateUsersResponse {
  success: boolean;
  message: string;
  data: {
    estate_id: number;
    estate_name: string;
    summary: {
      total_processed: number;
      added: number;
      failed: number;
    };
    details: Record<string, string>;
  };
}

export interface MaintenanceRequest {
  id: number;
  user_id: number;
  estate_id: number;
  title: string;
  content: string;
  status: string;
  priority: string;
  attached: string | null;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_picture: string | null;
  estate_name: string;
}

export interface SecurityCode {
  id: number;
  estate_id: number;
  name: string;
  code: string;
  expired_at: string;
  limit: number;
  total_used: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  created_by_first_name: string;
  created_by_last_name: string;
  created_by_email: string;
  estate_name: string;
}

export interface UtilityPayment {
  id: number;
  user_id: number;
  estate_id: number;
  description: string;
  payment_method: string;
  payment_type: string;
  reference: string;
  status: number;
  purpose: string;
  created_at: string;
  updated_at: string;
  chargeable_id: number;
  amount: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_picture: string | null;
  estate_name: string;
}

export interface EstatePaginatedResponse<T> {
  success: boolean;
  data: PaginatedData<T>;
  stats: Record<string, any>;
  filters: any[];
}

export interface EstateMutationResponse {
  success: boolean;
  message: string;
}

export interface UpdateMaintenanceResponse {
  success: boolean;
  message: string;
}

export interface ExportEstateSecurityCodesResponse {
  success: boolean;
  message: string;
  count: number;
  status_filter: string;
  date_range: {
    start: string;
    end: string;
  };
  file_name: string;
  url: string;
  download_url: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
  const token = Cookies.get("token");

  if (!token) {
    return null;
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

const buildAuthError = () => ({
  message: "No authentication token found. Please login again.",
});

export const deleteEstate = createAsyncThunk<
  EstateMutationResponse,
  { estateId: number },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>("estate/deleteEstate", async ({ estateId }, { rejectWithValue }) => {
  const headers = getAuthHeaders();

  if (!headers) {
    return rejectWithValue(buildAuthError());
  }

  try {
    const response = await api.delete<EstateMutationResponse>(
      `${BASE_URL}/api/admin/estates/delete/${estateId}`,
      { headers },
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;

    if (axiosError.response?.status === 401) {
      Cookies.remove("token");
    }

    if (axiosError.response) {
      return rejectWithValue({
        message: axiosError.response.data.message || "Failed to delete estate",
        errors: axiosError.response.data.errors,
      });
    } else if (axiosError.request) {
      return rejectWithValue({
        message: "No response from server. Please check your network connection.",
      });
    }

    return rejectWithValue({
      message: "An unexpected error occurred. Please try again.",
    });
  }
});

export const removeUserFromEstate = createAsyncThunk<
  EstateMutationResponse,
  { userId: number },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>("estate/removeUserFromEstate", async ({ userId }, { rejectWithValue }) => {
  const headers = getAuthHeaders();

  if (!headers) {
    return rejectWithValue(buildAuthError());
  }

  try {
    const response = await api.delete<EstateMutationResponse>(
      `${BASE_URL}/api/admin/estates/user-delete/${userId}`,
      { headers },
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
          axiosError.response.data.message || "Failed to remove user from estate",
        errors: axiosError.response.data.errors,
      });
    } else if (axiosError.request) {
      return rejectWithValue({
        message: "No response from server. Please check your network connection.",
      });
    }

    return rejectWithValue({
      message: "An unexpected error occurred. Please try again.",
    });
  }
});

export const fetchEstateMaintenances = createAsyncThunk<
  EstatePaginatedResponse<MaintenanceRequest>,
  {
    estateId?: number;
    status?: string;
    priority?: string;
    search?: string;
    date_from?: string;
    date_to?: string;
    user_id?: number;
    per_page?: number;
    page?: number;
  },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "estate/fetchEstateMaintenances",
  async (
    { estateId, status, priority, search, date_from, date_to, user_id, per_page = 10, page = 1 },
    { rejectWithValue },
  ) => {
    const headers = getAuthHeaders();

    if (!headers) {
      return rejectWithValue(buildAuthError());
    }

    try {
      const response = await api.get<EstatePaginatedResponse<MaintenanceRequest>>(
        `${BASE_URL}/api/admin/estates/maintenances`,
        {
          headers,
          params: {
            estate_id: estateId,
            status,
            priority,
            search,
            date_from,
            date_to,
            user_id,
            per_page,
            page,
          },
        },
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue({
        message:
          axiosError.response?.data.message ||
          "Failed to fetch maintenance requests",
        errors: axiosError.response?.data.errors,
      });
    }
  },
);

export const updateMaintenanceStatus = createAsyncThunk<
  UpdateMaintenanceResponse,
  { maintenanceId: number; status: string },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "estate/updateMaintenanceStatus",
  async ({ maintenanceId, status }, { rejectWithValue }) => {
    const headers = getAuthHeaders();

    if (!headers) {
      return rejectWithValue(buildAuthError());
    }

    try {
      const response = await api.post<UpdateMaintenanceResponse>(
        `${BASE_URL}/api/admin/estates/update-maintenance`,
        {
          maintenance_id: maintenanceId,
          status,
        },
        {
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
      }

      return rejectWithValue({
        message:
          axiosError.response?.data.message ||
          "Failed to update maintenance request",
        errors: axiosError.response?.data.errors,
      });
    }
  },
);

export const fetchEstateSecurityCodes = createAsyncThunk<
  EstatePaginatedResponse<SecurityCode>,
  { estateId?: number; page?: number; per_page?: number },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "estate/fetchEstateSecurityCodes",
  async ({ estateId, page = 1, per_page = 10 }, { rejectWithValue }) => {
    const headers = getAuthHeaders();

    if (!headers) {
      return rejectWithValue(buildAuthError());
    }

    try {
      const response = await api.get<EstatePaginatedResponse<SecurityCode>>(
        `${BASE_URL}/api/admin/estates/security-codes`,
        {
          headers,
          params: {
            estate_id: estateId,
            page,
            per_page,
          },
        },
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue({
        message:
          axiosError.response?.data.message || "Failed to fetch security codes",
        errors: axiosError.response?.data.errors,
      });
    }
  },
);

export const exportEstateSecurityCodes = createAsyncThunk<
  ExportEstateSecurityCodesResponse,
  { start_date: string; end_date: string; status?: string },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "estate/exportEstateSecurityCodes",
  async ({ start_date, end_date, status = "active" }, { rejectWithValue }) => {
    const headers = getAuthHeaders();

    if (!headers) {
      return rejectWithValue(buildAuthError());
    }

    try {
      const response = await api.post<ExportEstateSecurityCodesResponse>(
        `${BASE_URL}/api/admin/estates/security-codes/export`,
        null,
        {
          headers,
          params: {
            start_date,
            end_date,
            status,
          },
        },
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
      }

      return rejectWithValue({
        message:
          axiosError.response?.data.message || "Failed to export security codes",
        errors: axiosError.response?.data.errors,
      });
    }
  },
);

export const fetchEstateUtilityPayments = createAsyncThunk<
  EstatePaginatedResponse<UtilityPayment>,
  { estateId?: number; page?: number; per_page?: number },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "estate/fetchEstateUtilityPayments",
  async ({ estateId, page = 1, per_page = 10 }, { rejectWithValue }) => {
    const headers = getAuthHeaders();

    if (!headers) {
      return rejectWithValue(buildAuthError());
    }

    try {
      const response = await api.get<EstatePaginatedResponse<UtilityPayment>>(
        `${BASE_URL}/api/admin/estates/utility-payments`,
        {
          headers,
          params: {
            estate_id: estateId,
            page,
            per_page,
          },
        },
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue({
        message:
          axiosError.response?.data.message ||
          "Failed to fetch utility payments",
        errors: axiosError.response?.data.errors,
      });
    }
  },
);

export const createEstatePersonnel = createAsyncThunk<
  EstateMutationResponse,
  { estateId: number; credentials: FormData },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "estate/createEstatePersonnel",
  async ({ estateId, credentials }, { rejectWithValue }) => {
    const headers = getAuthHeaders();

    if (!headers) {
      return rejectWithValue(buildAuthError());
    }

    try {
      const response = await api.post<EstateMutationResponse>(
        `${BASE_URL}/api/admin/create-personnel`,
        credentials,
        {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
          params: {
            estate_id: estateId,
          },
        },
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      return rejectWithValue({
        message:
          axiosError.response?.data.message ||
          "Failed to create estate personnel",
        errors: axiosError.response?.data.errors,
      });
    }
  },
);

export const createEstateCommunity = createAsyncThunk<
  CreateEstateCommunityResponse,
  { propertyId: number },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "estate/createEstateCommunity",
  async ({ propertyId }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    const formData = new FormData();
    formData.append("property_id", String(propertyId));

    try {
      const response = await api.post<CreateEstateCommunityResponse>(
        `${BASE_URL}/api/admin/estates/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
            axiosError.response.data.message ||
            "Failed to create estate community",
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
  },
);

export const assignUsersToEstate = createAsyncThunk<
  AssignEstateUsersResponse,
  { estateId: number; propertySlug?: string; emails: string[] },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "estate/assignUsersToEstate",
  async ({ estateId, propertySlug, emails }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    const payload = {
      estate_id: estateId,
      ...(propertySlug && { property_slug: propertySlug }),
      users: emails,
    };

    try {
      const response = await api.post<AssignEstateUsersResponse>(
        `${BASE_URL}/api/admin/estates/assign-users`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
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
            axiosError.response.data.message ||
            "Failed to add clients to estate",
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
  },
);

// Fetch all estates with metrics
export const fetchAllEstates = createAsyncThunk<
  AllEstatesResponse,
  { page?: number },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>("estate/fetchAllEstates", async ({ page = 1 }, { rejectWithValue }) => {
  const token = Cookies.get("token");

  if (!token) {
    return rejectWithValue({
      message: "No authentication token found. Please login again.",
    });
  }

  try {
    const response = await api.get<AllEstatesResponse>(
      `${BASE_URL}/api/admin/estates`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
        },
      },
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
          axiosError.response.data.message || "Failed to fetch estates data",
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

// Fetch users in a particular estate
export const fetchEstateUsers = createAsyncThunk<
  EstateUsersResponse,
  { estateId: number; page?: number },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "estate/fetchEstateUsers",
  async ({ estateId, page = 1 }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await api.get<EstateUsersResponse>(
        `${BASE_URL}/api/admin/estates/${estateId}/clients`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
          },
        },
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
            axiosError.response.data.message || "Failed to fetch estate users",
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
  },
);

// Fetch a single user's estate information
export const fetchSingleUserEstateInfo = createAsyncThunk<
  SingleUserResponse,
  { estateId: number; userId: number; page?: number },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "estate/fetchSingleUserEstateInfo",
  async ({ estateId, userId, page = 1 }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await api.get<SingleUserResponse>(
        `${BASE_URL}/api/admin/estates/${estateId}/clients/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
          },
        },
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
            axiosError.response.data.message ||
            "Failed to fetch user estate info",
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
  },
);

// Send chat reply to user
export const sendChatReply = createAsyncThunk<
  ChatReplyResponse,
  ChatReplyRequest,
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>("estate/sendChatReply", async (chatData, { rejectWithValue }) => {
  const token = Cookies.get("token");

  if (!token) {
    return rejectWithValue({
      message: "No authentication token found. Please login again.",
    });
  }

  try {
    const response = await api.post<ChatReplyResponse>(
      `${BASE_URL}/api/admin/estates/chat/reply`,
      {
        estate_id: chatData.estate_id,
        receiver_id: chatData.receiver_id,
        message: chatData.message,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
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
          axiosError.response.data.message || "Failed to send chat reply",
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

export const markEstateChatAsRead = createAsyncThunk<
  MarkAsReadResponse,
  { channel: string },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>("estate/markEstateChatAsRead", async ({ channel }, { rejectWithValue }) => {
  const token = Cookies.get("token");

  if (!token) {
    return rejectWithValue({
      message: "No authentication token found. Please login again.",
    });
  }

  try {
    const response = await api.post<MarkAsReadResponse>(
      `${BASE_URL}/api/mark-as-read/${encodeURIComponent(channel)}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
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
          axiosError.response.data.message || "Failed to mark messages as read",
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

export const fetchCommunityMessages = createAsyncThunk<
  CommunityMessagesResponse,
  { channel: string; page?: number },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "estate/fetchCommunityMessages",
  async ({ channel, page = 1 }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await api.get<CommunityMessagesResponse>(
        `${BASE_URL}/api/community/messages/${encodeURIComponent(channel)}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: {
            page,
          },
        },
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
            axiosError.response.data.message ||
            "Failed to fetch community messages",
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
  },
);

export const sendCommunityMessage = createAsyncThunk<
  SendCommunityMessageResponse,
  { estateId: number; message: string },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "estate/sendCommunityMessage",
  async ({ estateId, message }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await api.post<SendCommunityMessageResponse>(
        `${BASE_URL}/api/${estateId}/community/send`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
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
            axiosError.response.data.message ||
            "Failed to send community message",
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
  },
);

export const markCommunityMessagesAsRead = createAsyncThunk<
  MarkAsReadResponse,
  { channel: string },
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "estate/markCommunityMessagesAsRead",
  async ({ channel }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const response = await api.post<MarkAsReadResponse>(
        `${BASE_URL}/community/mark-read/${encodeURIComponent(channel)}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
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
            axiosError.response.data.message ||
            "Failed to mark community messages as read",
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
  },
);
