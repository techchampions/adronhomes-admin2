// job_details_slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApplicationsData, fetchJobDetails, Job, JobDetailsResponse } from "./Single_job_Thunk";


interface Pagination {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

interface JobDetailsState {
  jobList: Job | null;
  applications: ApplicationsData | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  pagination: Pagination;
  totalCareerViews: number | null;
  totalApplications: number | null;
}

const initialState: JobDetailsState = {
  jobList: null,
  applications: null,
  loading: false,
  error: null,
  success: false,
  pagination: {
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  },
  totalCareerViews: null,
  totalApplications: null,
};

const jobDetailsSlice = createSlice({
  name: "singlejobDetails",
  initialState,
  reducers: {
    resetJobDetailsState: () => initialState,
    setCurrentPage: (state, action: PayloadAction<number>) => {
      if (state.applications) {
        state.applications.current_page = action.payload;
      }
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        fetchJobDetails.fulfilled,
        (state, action: PayloadAction<JobDetailsResponse>) => {
          state.loading = false;
          state.success = action.payload.success;
          state.jobList = action.payload.job_list;
          state.applications = action.payload.applications;
          state.totalCareerViews = action.payload.total_career_views;
          state.totalApplications = action.payload.total_applications;
          
          // Update pagination
          state.pagination = {
            currentPage: action.payload.applications.current_page,
            perPage: action.payload.applications.per_page,
            totalItems: action.payload.applications.total,
            totalPages: action.payload.applications.last_page,
          };
        }
      )
      .addCase(fetchJobDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch job details";
        state.success = false;
      });
  },
});

// Export actions
export const { resetJobDetailsState, setCurrentPage } = jobDetailsSlice.actions;

// Export selectors
export const selectJobDetails = (state: { singlejobDetails: JobDetailsState }) =>
  state.singlejobDetails.jobList;
  
export const selectApplications = (state: { singlejobDetails: JobDetailsState }) =>
  state.singlejobDetails.applications?.data;

export const selectApplicationsPagination = (state: { singlejobDetails: JobDetailsState }) =>
  state.singlejobDetails.pagination;

export const selectTotalCareerViews = (state: { singlejobDetails: JobDetailsState }) =>
  state.singlejobDetails.totalCareerViews;

export const selectTotalApplications = (state: { singlejobDetails: JobDetailsState }) =>
  state.singlejobDetails.totalApplications;

export const selectJobDetailsLoading=(state:{singlejobDetails:JobDetailsState})=> state.singlejobDetails.loading;
//  selectJobDetailsError

export default jobDetailsSlice.reducer;