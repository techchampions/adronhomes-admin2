import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  Gift, 
  GiftStats,
  SingleGiftStats,
  createGift, 
  fetchGifts, 
  fetchGiftById, 
  updateGift, 
  deleteGift,
  // updateGiftStatus,
  assignGiftToProperty,
  bulkAssignMultipleGifts,
  getGiftStatistics,
  GiftMutationResponse,
  GiftsListResponse,
  SingleGiftResponse,
  fetchGiftRequests,
  grantGiftRequest,
  rejectGiftRequest,
  GiftRequest,
  GiftRequestsResponse,
  changeGiftState
} from './gift_thunk';

export interface GiftState {
  // Gift Requests
  giftRequests: GiftRequest[];
  giftRequestsLoading: boolean;
  giftRequestsPagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
  };
  giftPendingRequestsCount: number;
  
  // Gifts
  gifts: Gift[];
  currentGift: Gift | null;
  stats: GiftStats | null;
  singleGiftStats: SingleGiftStats | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  changingState: boolean; // Add this for state change loading
  error: string | null;
  successMessage: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
  };
  search: string;
  statusFilter: string;
}

const initialState: GiftState = {
  // Gift Requests initial state
  giftRequests: [],
  giftRequestsLoading: false,
  giftRequestsPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 20,
  },
  giftPendingRequestsCount: 0,
  
  // Gifts initial state
  gifts: [],
  currentGift: null,
  stats: null,
  singleGiftStats: null,
  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  changingState: false, // Initialize
  error: null,
  successMessage: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 20,
  },
  search: '',
  statusFilter: '',
};

const giftSlice = createSlice({
  name: 'gifts',
  initialState,
  reducers: {
    clearGiftError: (state) => {
      state.error = null;
    },
    clearGiftSuccess: (state) => {
      state.successMessage = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.perPage = action.payload;
      state.pagination.currentPage = 1;
    },
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.pagination.currentPage = 1;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      state.pagination.currentPage = 1;
    },
    clearCurrentGift: (state) => {
      state.currentGift = null;
      state.singleGiftStats = null;
    },
    clearGifts: (state) => {
      state.gifts = [];
      state.currentGift = null;
      state.stats = null;
      state.singleGiftStats = null;
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        perPage: 20,
      };
      state.search = '';
      state.statusFilter = '';
    },
    updateLocalGift: (state, action: PayloadAction<Gift>) => {
      const index = state.gifts.findIndex(gift => gift.id === action.payload.id);
      if (index !== -1) {
        state.gifts[index] = action.payload;
      }
      if (state.currentGift?.id === action.payload.id) {
        state.currentGift = action.payload;
      }
    },
    
    // Gift Requests specific reducers
    setGiftRequestsCurrentPage: (state, action: PayloadAction<number>) => {
      state.giftRequestsPagination.currentPage = action.payload;
    },
    setGiftRequestsPerPage: (state, action: PayloadAction<number>) => {
      state.giftRequestsPagination.perPage = action.payload;
      state.giftRequestsPagination.currentPage = 1;
    },
    clearGiftRequests: (state) => {
      state.giftRequests = [];
      state.giftRequestsPagination = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        perPage: 20,
      };
      state.giftPendingRequestsCount = 0;
    },
    updateGiftPendingRequestsCount: (state, action: PayloadAction<number>) => {
      state.giftPendingRequestsCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Gift
      .addCase(createGift.pending, (state) => {
        state.creating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createGift.fulfilled, (state, action: PayloadAction<GiftMutationResponse>) => {
        state.creating = false;
        state.successMessage = action.payload.message;
        state.gifts.unshift(action.payload.data);
      })
      .addCase(createGift.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload?.message || 'Failed to create gift';
      })

      // Fetch All Gifts
      .addCase(fetchGifts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGifts.fulfilled, (state, action: PayloadAction<GiftsListResponse>) => {
        state.loading = false;
        
        if (action.payload && action.payload.data && action.payload.data.gifts) {
          if (Array.isArray(action.payload.data.gifts.data)) {
            state.gifts = action.payload.data.gifts.data;
          } else {
            state.gifts = [];
          }
          
          if (action.payload.data.stats) {
            state.stats = action.payload.data.stats;
          }
          
          if (action.payload.data.gifts) {
            state.pagination = {
              currentPage: action.payload.data.gifts.current_page || 1,
              totalPages: action.payload.data.gifts.last_page || 1,
              totalItems: action.payload.data.gifts.total || 0,
              perPage: action.payload.data.gifts.per_page || 20,
            };
          }
        } else {
          state.gifts = [];
          state.stats = null;
        }
      })
      .addCase(fetchGifts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch gifts';
      })

      // Fetch Gift By ID
      .addCase(fetchGiftById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGiftById.fulfilled, (state, action: PayloadAction<SingleGiftResponse>) => {
        state.loading = false;
        if (action.payload?.data?.gift) {
          state.currentGift = action.payload.data.gift;
          state.singleGiftStats = action.payload.data.stats;
        }
      })
      .addCase(fetchGiftById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch gift details';
      })

      // Update Gift
      .addCase(updateGift.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateGift.fulfilled, (state, action: PayloadAction<GiftMutationResponse>) => {
        state.updating = false;
        state.successMessage = action.payload.message;
        const index = state.gifts.findIndex(gift => gift.id === action.payload.data.id);
        if (index !== -1) {
          state.gifts[index] = action.payload.data;
        }
        if (state.currentGift?.id === action.payload.data.id) {
          state.currentGift = action.payload.data;
        }
      })
      .addCase(updateGift.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload?.message || 'Failed to update gift';
      })

      // Delete Gift
      .addCase(deleteGift.pending, (state) => {
        state.deleting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteGift.fulfilled, (state, action) => {
        state.deleting = false;
        state.successMessage = action.payload.message;
        state.gifts = state.gifts.filter(gift => gift.id !== action.payload.id);
        if (state.currentGift?.id === action.payload.id) {
          state.currentGift = null;
          state.singleGiftStats = null;
        }
      })
      .addCase(deleteGift.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload?.message || 'Failed to delete gift';
      })

      // // Update Gift Status
      // .addCase(updateGiftStatus.pending, (state) => {
      //   state.updating = true;
      //   state.error = null;
      //   state.successMessage = null;
      // })
      // .addCase(updateGiftStatus.fulfilled, (state, action: PayloadAction<GiftMutationResponse>) => {
      //   state.updating = false;
      //   state.successMessage = action.payload.message;
      //   const index = state.gifts.findIndex(gift => gift.id === action.payload.data.id);
      //   if (index !== -1) {
      //     state.gifts[index] = action.payload.data;
      //   }
      //   if (state.currentGift?.id === action.payload.data.id) {
      //     state.currentGift = action.payload.data;
      //   }
      // })
      // .addCase(updateGiftStatus.rejected, (state, action) => {
      //   state.updating = false;
      //   state.error = action.payload?.message || 'Failed to update gift status';
      // })

      // Change Gift State (Active/Inactive)
      .addCase(changeGiftState.pending, (state) => {
        state.changingState = true;
        state.error = null;
      })
      .addCase(changeGiftState.fulfilled, (state, action) => {
        state.changingState = false;
        state.successMessage = action.payload.message;
        // Update the gift status in the list
        const updatedGift = action.payload.data;
        if (updatedGift) {
          const index = state.gifts.findIndex(gift => gift.id === updatedGift.id);
          if (index !== -1) {
            state.gifts[index] = updatedGift;
          }
          if (state.currentGift?.id === updatedGift.id) {
            state.currentGift = updatedGift;
          }
        }
      })
      .addCase(changeGiftState.rejected, (state, action) => {
        state.changingState = false;
        state.error = action.payload?.message || 'Failed to change gift state';
      })

      // Assign Gift to Property
      .addCase(assignGiftToProperty.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(assignGiftToProperty.fulfilled, (state, action) => {
        state.updating = false;
        state.successMessage = action.payload.message;
      })
      .addCase(assignGiftToProperty.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload?.message || 'Failed to assign gift to property';
      })

      // Bulk Assign Gifts
      .addCase(bulkAssignMultipleGifts.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(bulkAssignMultipleGifts.fulfilled, (state, action) => {
        state.updating = false;
        state.successMessage = action.payload.message;
      })
      .addCase(bulkAssignMultipleGifts.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload?.message || 'Failed to bulk assign gifts';
      })

      // Get Gift Statistics
      .addCase(getGiftStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGiftStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(getGiftStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch statistics';
      })

      // Fetch Gift Requests
      .addCase(fetchGiftRequests.pending, (state) => {
        state.giftRequestsLoading = true;
        state.error = null;
      })
      .addCase(fetchGiftRequests.fulfilled, (state, action: PayloadAction<GiftRequestsResponse>) => {
        state.giftRequestsLoading = false;
        state.giftRequests = action.payload.data.data || [];
        
        state.giftRequestsPagination = {
          currentPage: action.payload.data.current_page,
          totalPages: action.payload.data.last_page,
          totalItems: action.payload.data.total,
          perPage: action.payload.data.per_page,
        };
        
        const pendingCount = (action.payload.data.data || []).filter(
          (request: GiftRequest) => request.status === 'pending'
        ).length;
        state.giftPendingRequestsCount = pendingCount;
      })
      .addCase(fetchGiftRequests.rejected, (state, action) => {
        state.giftRequestsLoading = false;
        state.error = action.payload?.message || 'Failed to fetch gift requests';
      })

      // Grant Gift Request
      .addCase(grantGiftRequest.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(grantGiftRequest.fulfilled, (state, action) => {
        state.updating = false;
        state.successMessage = action.payload.message;
        
        const requestId = action.meta.arg.requestId;
        const requestIndex = state.giftRequests.findIndex(r => r.id === requestId);
        if (requestIndex !== -1) {
          state.giftRequests[requestIndex].status = 'granted';
          state.giftRequests[requestIndex].processed_at = new Date().toISOString();
        }
        
        if (state.giftPendingRequestsCount > 0) {
          state.giftPendingRequestsCount--;
        }
        
        if (state.currentGift && state.currentGift.id === action.meta.arg.giftId) {
          state.currentGift.remaining_quantity--;
          state.currentGift.claimed_count++;
        }
      })
      .addCase(grantGiftRequest.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload?.message || 'Failed to grant gift request';
      })

      // Reject Gift Request
      .addCase(rejectGiftRequest.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(rejectGiftRequest.fulfilled, (state, action) => {
        state.updating = false;
        state.successMessage = action.payload.message;
        
        const requestId = action.meta.arg.requestId;
        const requestIndex = state.giftRequests.findIndex(r => r.id === requestId);
        if (requestIndex !== -1) {
          state.giftRequests[requestIndex].status = 'rejected';
          state.giftRequests[requestIndex].processed_at = new Date().toISOString();
        }
        
        if (state.giftPendingRequestsCount > 0) {
          state.giftPendingRequestsCount--;
        }
      })
      .addCase(rejectGiftRequest.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload?.message || 'Failed to reject gift request';
      });
  },
});

// Export actions
export const { 
  clearGiftError,
  clearGiftSuccess,
  setCurrentPage,
  setPerPage,
  setSearchFilter,
  setStatusFilter,
  clearCurrentGift,
  clearGifts,
  updateLocalGift,
  setGiftRequestsCurrentPage,
  setGiftRequestsPerPage,
  clearGiftRequests,
  updateGiftPendingRequestsCount
} = giftSlice.actions;

export default giftSlice.reducer;

// Selectors
export const selectAllGifts = (state: { gifts: GiftState }) => state.gifts.gifts;
export const selectCurrentGift = (state: { gifts: GiftState }) => state.gifts.currentGift;
export const selectGiftStats = (state: { gifts: GiftState }) => state.gifts.stats;
export const selectSingleGiftStats = (state: { gifts: GiftState }) => state.gifts.singleGiftStats;
export const selectGiftsLoading = (state: { gifts: GiftState }) => state.gifts.loading;
export const selectGiftsCreating = (state: { gifts: GiftState }) => state.gifts.creating;
export const selectGiftsUpdating = (state: { gifts: GiftState }) => state.gifts.updating;
export const selectGiftsDeleting = (state: { gifts: GiftState }) => state.gifts.deleting;
export const selectGiftsChangingState = (state: { gifts: GiftState }) => state.gifts.changingState;
export const selectGiftsError = (state: { gifts: GiftState }) => state.gifts.error;
export const selectGiftsSuccess = (state: { gifts: GiftState }) => state.gifts.successMessage;
export const selectGiftsPagination = (state: { gifts: GiftState }) => state.gifts.pagination;
export const selectGiftsSearch = (state: { gifts: GiftState }) => state.gifts.search;
export const selectGiftsStatusFilter = (state: { gifts: GiftState }) => state.gifts.statusFilter;

// Gift Requests Selectors
export const selectGiftRequests = (state: { gifts: GiftState }) => state.gifts.giftRequests;
export const selectGiftRequestsLoading = (state: { gifts: GiftState }) => state.gifts.giftRequestsLoading;
export const selectGiftRequestsPagination = (state: { gifts: GiftState }) => state.gifts.giftRequestsPagination;
export const selectGiftPendingRequestsCount = (state: { gifts: GiftState }) => state.gifts.giftPendingRequestsCount;