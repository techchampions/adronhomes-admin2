// estateSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  fetchCommunityMessages,
  fetchAllEstates,
  fetchEstateUsers,
  fetchEstateMaintenances,
  fetchEstateSecurityCodes,
  fetchEstateUtilityPayments,
  fetchSingleUserEstateInfo,
  markCommunityMessagesAsRead,
  markEstateChatAsRead,
  sendCommunityMessage,
  sendChatReply,
  updateMaintenanceStatus,
  AllEstatesResponse,
  CommunityMessagesResponse,
  EstateUsersResponse,
  SendCommunityMessageResponse,
  SingleUserResponse,
  ChatReplyResponse,
  Estate,
  EstateUser,
  SingleUserEstateInfo,
  CommunityMessage,
  CommunityConversation,
  PaginatedData,
  MaintenanceRequest,
  SecurityCode,
  UtilityPayment,
  EstatePaginatedResponse,
} from "./estateThunk";

const defaultPagination = {
  currentPage: 1,
  perPage: 10,
  totalItems: 0,
  totalPages: 1,
};

interface EstateState {
  // All estates data
  allEstates: {
    data: Estate[];
    metrics: {
      total_estates: number;
      total_maintenance_requests: number;
      pending_maintenance_requests: number;
      total_security_codes_generated: number;
      total_unread_messages?: number;
    } | null;
    pagination: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
    };
  };

  // Estate users data
  estateUsers: {
    data: EstateUser[];
    estateInfo: {
      id: number;
      property_id?: number;
      estate_name: string;
      property_slug: string;
      is_operating: number;
      total_unread_messages: number;
    } | null;
    groupConversation: CommunityConversation | null;
    metrics: {
      total_users: number;
      admin_total_unread: number;
      admin_group_unread: number;
      total_unread_messages: number;
    } | null;
    pagination: {
      currentPage: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
    };
  };

  // Single user estate info
  singleUserInfo: SingleUserEstateInfo | null;

  communityMessages: {
    conversation: CommunityConversation | null;
    messages: PaginatedData<CommunityMessage> | null;
  };

  maintenanceRequests: {
    data: MaintenanceRequest[];
    stats: Record<string, any> | null;
    pagination: typeof defaultPagination;
  };

  securityCodes: {
    data: SecurityCode[];
    stats: Record<string, any> | null;
    pagination: typeof defaultPagination;
  };

  utilityPayments: {
    data: UtilityPayment[];
    stats: Record<string, any> | null;
    pagination: typeof defaultPagination;
  };

  // Chat reply
  chatReply: ChatReplyResponse["data"] | null;

  // Loading states
  loading: {
    allEstates: boolean;
    estateUsers: boolean;
    singleUserInfo: boolean;
    chatReply: boolean;
    communityMessages: boolean;
    communityMessageSend: boolean;
    maintenanceRequests: boolean;
    securityCodes: boolean;
    utilityPayments: boolean;
    maintenanceUpdate: boolean;
  };

  // Error states
  error: {
    allEstates: string | null;
    estateUsers: string | null;
    singleUserInfo: string | null;
    chatReply: string | null;
    communityMessages: string | null;
    communityMessageSend: string | null;
    maintenanceRequests: string | null;
    securityCodes: string | null;
    utilityPayments: string | null;
    maintenanceUpdate: string | null;
  };
}

const initialState: EstateState = {
  allEstates: {
    data: [],
    metrics: null,
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
      totalPages: 1,
    },
  },
  estateUsers: {
    data: [],
    estateInfo: null,
    groupConversation: null,
    metrics: null,
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
      totalPages: 1,
    },
  },
  singleUserInfo: null,
  communityMessages: {
    conversation: null,
    messages: null,
  },
  maintenanceRequests: {
    data: [],
    stats: null,
    pagination: defaultPagination,
  },
  securityCodes: {
    data: [],
    stats: null,
    pagination: defaultPagination,
  },
  utilityPayments: {
    data: [],
    stats: null,
    pagination: defaultPagination,
  },
  chatReply: null,
  loading: {
    allEstates: false,
    estateUsers: false,
    singleUserInfo: false,
    chatReply: false,
    communityMessages: false,
    communityMessageSend: false,
    maintenanceRequests: false,
    securityCodes: false,
    utilityPayments: false,
    maintenanceUpdate: false,
  },
  error: {
    allEstates: null,
    estateUsers: null,
    singleUserInfo: null,
    chatReply: null,
    communityMessages: null,
    communityMessageSend: null,
    maintenanceRequests: null,
    securityCodes: null,
    utilityPayments: null,
    maintenanceUpdate: null,
  },
};

const toPagination = <T,>(pagination: PaginatedData<T>) => ({
  currentPage: pagination.current_page,
  perPage: pagination.per_page,
  totalItems: pagination.total,
  totalPages: pagination.last_page,
});

const estateSlice = createSlice({
  name: "estate",
  initialState,
  reducers: {
    clearEstateData: (state) => {
      state.allEstates = initialState.allEstates;
      state.estateUsers = initialState.estateUsers;
      state.singleUserInfo = null;
      state.communityMessages = initialState.communityMessages;
      state.maintenanceRequests = initialState.maintenanceRequests;
      state.securityCodes = initialState.securityCodes;
      state.utilityPayments = initialState.utilityPayments;
      state.chatReply = null;
      state.loading = initialState.loading;
      state.error = initialState.error;
    },
    clearSingleUserInfo: (state) => {
      state.singleUserInfo = null;
    },
    clearChatReply: (state) => {
      state.chatReply = null;
      state.error.chatReply = null;
    },
    setAllEstatesCurrentPage: (state, action: PayloadAction<number>) => {
      state.allEstates.pagination.currentPage = action.payload;
    },
    setEstateUsersCurrentPage: (state, action: PayloadAction<number>) => {
      state.estateUsers.pagination.currentPage = action.payload;
    },
    setMaintenanceRequestsCurrentPage: (
      state,
      action: PayloadAction<number>,
    ) => {
      state.maintenanceRequests.pagination.currentPage = action.payload;
    },
    setSecurityCodesCurrentPage: (state, action: PayloadAction<number>) => {
      state.securityCodes.pagination.currentPage = action.payload;
    },
    setUtilityPaymentsCurrentPage: (state, action: PayloadAction<number>) => {
      state.utilityPayments.pagination.currentPage = action.payload;
    },
    updateEstateUser: (state, action: PayloadAction<EstateUser>) => {
      const index = state.estateUsers.data.findIndex(
        (user) => user.id === action.payload.id,
      );
      if (index !== -1) {
        state.estateUsers.data[index] = action.payload;
      }
    },
    updateSingleUserInfo: (
      state,
      action: PayloadAction<Partial<SingleUserEstateInfo>>,
    ) => {
      if (state.singleUserInfo) {
        state.singleUserInfo = {
          ...state.singleUserInfo,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all estates
      .addCase(fetchAllEstates.pending, (state) => {
        state.loading.allEstates = true;
        state.error.allEstates = null;
      })
      .addCase(
        fetchAllEstates.fulfilled,
        (state, action: PayloadAction<AllEstatesResponse>) => {
          state.loading.allEstates = false;
          state.allEstates.data = action.payload.data.estates.data;
          state.allEstates.metrics = action.payload.data.metrics;
          state.allEstates.pagination = {
            currentPage: action.payload.data.estates.current_page,
            perPage: action.payload.data.estates.per_page,
            totalItems: action.payload.data.estates.total,
            totalPages: action.payload.data.estates.last_page,
          };
        },
      )
      .addCase(fetchAllEstates.rejected, (state, action) => {
        state.loading.allEstates = false;
        state.error.allEstates =
          action.payload?.message || "Failed to fetch estates";
        state.allEstates.data = [];
        state.allEstates.metrics = null;
      })

      // Fetch estate users
      .addCase(fetchEstateUsers.pending, (state) => {
        state.loading.estateUsers = true;
        state.error.estateUsers = null;
      })
      .addCase(
        fetchEstateUsers.fulfilled,
        (state, action: PayloadAction<EstateUsersResponse>) => {
          state.loading.estateUsers = false;
          state.estateUsers.data = action.payload.data.users.data;
          state.estateUsers.estateInfo = action.payload.data.estate_info;
          state.estateUsers.groupConversation =
            action.payload.data.group_conversation;
          state.estateUsers.metrics = action.payload.data.metrics;
          state.estateUsers.pagination = {
            currentPage: action.payload.data.users.current_page,
            perPage: action.payload.data.users.per_page,
            totalItems: action.payload.data.users.total,
            totalPages: action.payload.data.users.last_page,
          };
        },
      )
      .addCase(fetchEstateUsers.rejected, (state, action) => {
        state.loading.estateUsers = false;
        state.error.estateUsers =
          action.payload?.message || "Failed to fetch estate users";
        state.estateUsers.data = [];
        state.estateUsers.estateInfo = null;
        state.estateUsers.groupConversation = null;
        state.estateUsers.metrics = null;
      })

      // Fetch single user estate info
      .addCase(fetchSingleUserEstateInfo.pending, (state) => {
        state.loading.singleUserInfo = true;
        state.error.singleUserInfo = null;
      })
      .addCase(
        fetchSingleUserEstateInfo.fulfilled,
        (state, action: PayloadAction<SingleUserResponse>) => {
          state.loading.singleUserInfo = false;
          state.singleUserInfo = action.payload.data;
        },
      )
      .addCase(fetchSingleUserEstateInfo.rejected, (state, action) => {
        state.loading.singleUserInfo = false;
        state.error.singleUserInfo =
          action.payload?.message || "Failed to fetch user estate info";
        state.singleUserInfo = null;
      })

      // Send chat reply
      .addCase(sendChatReply.pending, (state) => {
        state.loading.chatReply = true;
        state.error.chatReply = null;
      })
      .addCase(
        sendChatReply.fulfilled,
        (state, action: PayloadAction<ChatReplyResponse>) => {
          state.loading.chatReply = false;
          state.chatReply = action.payload.data;

          // If we have single user info and the chat is for that user, add to chat list
          if (state.singleUserInfo) {
            state.singleUserInfo.chats.data = [
              action.payload.data,
              ...state.singleUserInfo.chats.data,
            ];
            state.singleUserInfo.chats.total += 1;
          }
        },
      )
      .addCase(sendChatReply.rejected, (state, action) => {
        state.loading.chatReply = false;
        state.error.chatReply =
          action.payload?.message || "Failed to send chat reply";
      })
      .addCase(markEstateChatAsRead.fulfilled, (state, action) => {
        const channel = action.meta.arg.channel;

        if (state.singleUserInfo?.chats.data.some((chat) => chat.channel === channel)) {
          state.singleUserInfo.estate.unread_count = 0;
        }
      })
      .addCase(fetchCommunityMessages.pending, (state) => {
        state.loading.communityMessages = true;
        state.error.communityMessages = null;
      })
      .addCase(
        fetchCommunityMessages.fulfilled,
        (state, action: PayloadAction<CommunityMessagesResponse>) => {
          state.loading.communityMessages = false;
          state.communityMessages.conversation = action.payload.data.conversation;
          state.communityMessages.messages = action.payload.data.messages;
        },
      )
      .addCase(fetchCommunityMessages.rejected, (state, action) => {
        state.loading.communityMessages = false;
        state.error.communityMessages =
          action.payload?.message || "Failed to fetch community messages";
      })
      .addCase(sendCommunityMessage.pending, (state) => {
        state.loading.communityMessageSend = true;
        state.error.communityMessageSend = null;
      })
      .addCase(
        sendCommunityMessage.fulfilled,
        (state, action: PayloadAction<SendCommunityMessageResponse>) => {
          state.loading.communityMessageSend = false;
          state.communityMessages.conversation = action.payload.data.conversation;

          if (state.communityMessages.messages) {
            state.communityMessages.messages.data = [
              action.payload.data.message,
              ...state.communityMessages.messages.data,
            ];
            state.communityMessages.messages.total += 1;
          }
        },
      )
      .addCase(sendCommunityMessage.rejected, (state, action) => {
        state.loading.communityMessageSend = false;
        state.error.communityMessageSend =
          action.payload?.message || "Failed to send community message";
      })
      .addCase(markCommunityMessagesAsRead.fulfilled, (state, action) => {
        const channel = action.meta.arg.channel;

        if (state.communityMessages.conversation?.channel === channel) {
          state.communityMessages.conversation.unread_count = 0;
        }

        if (state.estateUsers.groupConversation?.channel === channel) {
          state.estateUsers.metrics = state.estateUsers.metrics
            ? {
                ...state.estateUsers.metrics,
                admin_group_unread: 0,
              }
            : state.estateUsers.metrics;
        }
      })
      .addCase(fetchEstateMaintenances.pending, (state) => {
        state.loading.maintenanceRequests = true;
        state.error.maintenanceRequests = null;
      })
      .addCase(
        fetchEstateMaintenances.fulfilled,
        (
          state,
          action: PayloadAction<EstatePaginatedResponse<MaintenanceRequest>>,
        ) => {
          state.loading.maintenanceRequests = false;
          state.maintenanceRequests.data = action.payload.data.data;
          state.maintenanceRequests.stats = action.payload.stats;
          state.maintenanceRequests.pagination = toPagination(action.payload.data);
        },
      )
      .addCase(fetchEstateMaintenances.rejected, (state, action) => {
        state.loading.maintenanceRequests = false;
        state.error.maintenanceRequests =
          action.payload?.message || "Failed to fetch maintenance requests";
      })
      .addCase(updateMaintenanceStatus.pending, (state) => {
        state.loading.maintenanceUpdate = true;
        state.error.maintenanceUpdate = null;
      })
      .addCase(updateMaintenanceStatus.fulfilled, (state, action) => {
        state.loading.maintenanceUpdate = false;
        const { maintenanceId, status } = action.meta.arg;
        const request = state.maintenanceRequests.data.find(
          (item) => item.id === maintenanceId,
        );

        if (request) {
          request.status = status;
          request.updated_at = new Date().toISOString();
        }
      })
      .addCase(updateMaintenanceStatus.rejected, (state, action) => {
        state.loading.maintenanceUpdate = false;
        state.error.maintenanceUpdate =
          action.payload?.message || "Failed to update maintenance request";
      })
      .addCase(fetchEstateSecurityCodes.pending, (state) => {
        state.loading.securityCodes = true;
        state.error.securityCodes = null;
      })
      .addCase(
        fetchEstateSecurityCodes.fulfilled,
        (state, action: PayloadAction<EstatePaginatedResponse<SecurityCode>>) => {
          state.loading.securityCodes = false;
          state.securityCodes.data = action.payload.data.data;
          state.securityCodes.stats = action.payload.stats;
          state.securityCodes.pagination = toPagination(action.payload.data);
        },
      )
      .addCase(fetchEstateSecurityCodes.rejected, (state, action) => {
        state.loading.securityCodes = false;
        state.error.securityCodes =
          action.payload?.message || "Failed to fetch security codes";
      })
      .addCase(fetchEstateUtilityPayments.pending, (state) => {
        state.loading.utilityPayments = true;
        state.error.utilityPayments = null;
      })
      .addCase(
        fetchEstateUtilityPayments.fulfilled,
        (state, action: PayloadAction<EstatePaginatedResponse<UtilityPayment>>) => {
          state.loading.utilityPayments = false;
          state.utilityPayments.data = action.payload.data.data;
          state.utilityPayments.stats = action.payload.stats;
          state.utilityPayments.pagination = toPagination(action.payload.data);
        },
      )
      .addCase(fetchEstateUtilityPayments.rejected, (state, action) => {
        state.loading.utilityPayments = false;
        state.error.utilityPayments =
          action.payload?.message || "Failed to fetch utility payments";
      });
  },
});

export const {
  clearEstateData,
  clearSingleUserInfo,
  clearChatReply,
  setAllEstatesCurrentPage,
  setEstateUsersCurrentPage,
  setMaintenanceRequestsCurrentPage,
  setSecurityCodesCurrentPage,
  setUtilityPaymentsCurrentPage,
  updateEstateUser,
  updateSingleUserInfo,
} = estateSlice.actions;

// Selectors
export const selectAllEstatesLoading = (state: RootState) =>
  state.estate.loading.allEstates;
export const selectAllEstatesError = (state: RootState) =>
  state.estate.error.allEstates;
export const selectAllEstatesData = (state: RootState) =>
  state.estate.allEstates.data;
export const selectAllEstatesMetrics = (state: RootState) =>
  state.estate.allEstates.metrics;
export const selectAllEstatesPagination = (state: RootState) =>
  state.estate.allEstates.pagination;

export const selectEstateUsersLoading = (state: RootState) =>
  state.estate.loading.estateUsers;
export const selectEstateUsersError = (state: RootState) =>
  state.estate.error.estateUsers;
export const selectEstateUsersData = (state: RootState) =>
  state.estate.estateUsers.data;
export const selectEstateUsersInfo = (state: RootState) =>
  state.estate.estateUsers.estateInfo;
export const selectEstateUsersMetrics = (state: RootState) =>
  state.estate.estateUsers.metrics;
export const selectEstateUsersPagination = (state: RootState) =>
  state.estate.estateUsers.pagination;
export const selectEstateGroupConversation = (state: RootState) =>
  state.estate.estateUsers.groupConversation;

export const selectSingleUserInfoLoading = (state: RootState) =>
  state.estate.loading.singleUserInfo;
export const selectSingleUserInfoError = (state: RootState) =>
  state.estate.error.singleUserInfo;
export const selectSingleUserInfo = (state: RootState) =>
  state.estate.singleUserInfo;

export const selectChatReplyLoading = (state: RootState) =>
  state.estate.loading.chatReply;
export const selectChatReplyError = (state: RootState) =>
  state.estate.error.chatReply;
export const selectChatReply = (state: RootState) => state.estate.chatReply;
export const selectCommunityMessages = (state: RootState) =>
  state.estate.communityMessages;
export const selectCommunityMessagesLoading = (state: RootState) =>
  state.estate.loading.communityMessages;
export const selectCommunityMessagesError = (state: RootState) =>
  state.estate.error.communityMessages;
export const selectCommunityMessageSendLoading = (state: RootState) =>
  state.estate.loading.communityMessageSend;
export const selectCommunityMessageSendError = (state: RootState) =>
  state.estate.error.communityMessageSend;
export const selectMaintenanceRequestsData = (state: RootState) =>
  state.estate.maintenanceRequests.data;
export const selectMaintenanceRequestsStats = (state: RootState) =>
  state.estate.maintenanceRequests.stats;
export const selectMaintenanceRequestsPagination = (state: RootState) =>
  state.estate.maintenanceRequests.pagination;
export const selectMaintenanceRequestsLoading = (state: RootState) =>
  state.estate.loading.maintenanceRequests;
export const selectMaintenanceRequestsError = (state: RootState) =>
  state.estate.error.maintenanceRequests;
export const selectMaintenanceUpdateLoading = (state: RootState) =>
  state.estate.loading.maintenanceUpdate;
export const selectMaintenanceUpdateError = (state: RootState) =>
  state.estate.error.maintenanceUpdate;
export const selectSecurityCodesData = (state: RootState) =>
  state.estate.securityCodes.data;
export const selectSecurityCodesStats = (state: RootState) =>
  state.estate.securityCodes.stats;
export const selectSecurityCodesPagination = (state: RootState) =>
  state.estate.securityCodes.pagination;
export const selectSecurityCodesLoading = (state: RootState) =>
  state.estate.loading.securityCodes;
export const selectSecurityCodesError = (state: RootState) =>
  state.estate.error.securityCodes;
export const selectUtilityPaymentsData = (state: RootState) =>
  state.estate.utilityPayments.data;
export const selectUtilityPaymentsStats = (state: RootState) =>
  state.estate.utilityPayments.stats;
export const selectUtilityPaymentsPagination = (state: RootState) =>
  state.estate.utilityPayments.pagination;
export const selectUtilityPaymentsLoading = (state: RootState) =>
  state.estate.loading.utilityPayments;
export const selectUtilityPaymentsError = (state: RootState) =>
  state.estate.error.utilityPayments;

export default estateSlice.reducer;
