import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { personnels, PersonnelsResponse } from "./personnel_thunk";

export interface Personnel {
  id: number;
  email: string;
  phone_number: string;
  referral_code: string;
  name: string | null;
  first_name: string;
  last_name: string;
  role: number;
  country: string | null;
  state: string | null;
  lga: string | null;
  otp_verified_at: string | null;
  email_verified_at: string | null;
  profile_picture: string | null;
  gender: string | null;
  notification_enabled: number;
  device_id: string;
  address: string | null;
  created_at: string;
  updated_at: string;
  personnel: string;
  contract_id: string | null;
}

interface Pagination {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

interface PersonnelsState {
  data: {
    current_page: number;
    data: Personnel[];
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
  } | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  pagination: Pagination;
  search: string;
}

const initialState: PersonnelsState = {
  data: null,
  loading: false,
  error: null,
  success: false,
  pagination: {
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  },
  search: '',
};

const personnelsSlice = createSlice({
  name: "personnels",
  initialState,
  reducers: {
    resetPersonnelsState: () => initialState,

    setCurrentPage: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.current_page = action.payload;
      }
      state.pagination.currentPage = action.payload;
    },

    setPersonnelSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      // state.pagination.currentPage = 1; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(personnels.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        personnels.fulfilled,
        (state, action: PayloadAction<PersonnelsResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.data = action.payload.data;

          state.pagination = {
            currentPage: action.payload.data.current_page,
            perPage: action.payload.data.per_page,
            totalItems: action.payload.data.total,
            totalPages: action.payload.data.last_page,
          };
        }
      )
      .addCase(personnels.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch personnels";
        state.success = false;
      });
  },
});

// Export actions and reducer
export const {
  resetPersonnelsState,
  setCurrentPage,
  setPersonnelSearch,
} = personnelsSlice.actions;

export default personnelsSlice.reducer;

// Selector
export const selectPersonnelPagination = (state: { getpersonnel: PersonnelsState }) =>
  state.getpersonnel.pagination;
