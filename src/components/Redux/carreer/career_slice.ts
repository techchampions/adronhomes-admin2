// career_slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchCareers, CareerResponse, Career, CareerData } from "./career_thunk";

interface Pagination {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

interface CareersState {
  data: CareerData | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  pagination: Pagination;
  name: string | null;
  totalCareer: number | null;
  totalCareerViews: string | null;
  totalApplications: string | null;
    search: string;
}

const initialState: CareersState = {
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
  name: null,
  totalCareer: null,
  totalCareerViews: null,
  totalApplications: null,
};

const careersSlice = createSlice({
  name: "careers",
  initialState,
  reducers: {
    resetCareersState: () => initialState,
    setCurrentPage: (state, action: PayloadAction<number>) => {
      if (state.data) {
        state.data.current_page = action.payload;
      }
      state.pagination.currentPage = action.payload;
    },
     setCareerSearch: (state, action: PayloadAction<string>) => {
  state.search = action.payload;
  state.pagination.currentPage = 1;
},

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCareers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        fetchCareers.fulfilled,
        (state, action: PayloadAction<CareerResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.data = action.payload.data;
          state.name = action.payload.name;
          state.totalCareer = action.payload.total_career;
          state.totalCareerViews = action.payload.total_career_views;
          state.totalApplications = action.payload.total_applications;
          
          // Update pagination
          state.pagination = {
            currentPage: action.payload.data.current_page,
            perPage: action.payload.data.per_page,
            totalItems: action.payload.data.total,
            totalPages: action.payload.data.last_page,
          };
        }
      )
      .addCase(fetchCareers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch careers";
        state.success = false;
      });
  },
});

// Export actions
export const { resetCareersState, setCurrentPage,setCareerSearch } = careersSlice.actions;

// Export selectors
export const selectCareerPagination = (state: { getcareers: CareersState }) =>
  state.getcareers.pagination;

export const selectCareerData = (state: { getcareers: CareersState }) =>
  state.getcareers.data?.data;

export const selectTotalCareer = (state: { getcareers: CareersState }) =>
  state.getcareers.totalCareer;

export const selectTotalCareerViews = (state: { getcareers: CareersState }) =>
  state.getcareers.totalCareerViews;

export const selectTotalApplications = (state: { getcareers: CareersState }) =>
  state.getcareers.totalApplications;

export default careersSlice.reducer;