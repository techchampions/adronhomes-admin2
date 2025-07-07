import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { fetchSavedPropertyUsers, SavedPropertyUserResponse, PaginatedSavedPropertyUsers } from "./SavedPropertyUser_thunk";
import { RootState } from "./store";

interface SavedPropertyUserState {
  data: PaginatedSavedPropertyUsers | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

const initialState: SavedPropertyUserState = {
  data: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  },
};

const savedPropertyUserSlice = createSlice({
  name: "savedPropertyUser",
  initialState,
  reducers: {
    clearSavedPropertyUsers: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
      state.pagination = initialState.pagination;
    },
    setSavedPropertyUsersCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedPropertyUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSavedPropertyUsers.fulfilled,
        (state, action: PayloadAction<SavedPropertyUserResponse>) => {
          state.loading = false;
          state.data = action.payload.saved_property_user;

          // Update pagination
          if (action.payload.saved_property_user) {
            state.pagination = {
              currentPage: action.payload.saved_property_user.current_page,
              perPage: action.payload.saved_property_user.per_page,
              totalItems: action.payload.saved_property_user.total,
              totalPages: action.payload.saved_property_user.last_page,
            };
          }
        }
      )
      .addCase(fetchSavedPropertyUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch saved property users";
        state.data = null;
      });
  },
});

export const {
  clearSavedPropertyUsers,
  setSavedPropertyUsersCurrentPage,
} = savedPropertyUserSlice.actions;

// Selectors
export const selectSavedPropertyUsersLoading = (state: RootState) =>
  state.savedPropertyUser.loading;
export const selectSavedPropertyUsersError = (state: RootState) =>
  state.savedPropertyUser.error;
export const selectSavedPropertyUsersData = (state: RootState) =>
  state.savedPropertyUser.data;

export const selectSavedPropertyUsers = (state: RootState) =>
  state.savedPropertyUser.data?.data || [];

export const selectSavedPropertyUsersPagination = (state: RootState) =>
  state.savedPropertyUser.pagination;

export default savedPropertyUserSlice.reducer;