// features/properties/propertiesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  fetchProperties,
  PropertiesResponse,
  PropertiesState,
} from "./properties_Thunk";

const initialState: PropertiesState = {
  data: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  },
  stats: {
    totalProperties: 0,
    liveProperties: 0,
    activePlans: 0,
    totalSold: 0,
  },
};

const propertiesSlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    setPropertiesPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProperties.fulfilled,
        (state, action: PayloadAction<PropertiesResponse>) => {
          state.loading = false;
          state.data = action.payload.data.data;
          state.pagination = {
            currentPage: action.payload.data.current_page,
            perPage: action.payload.data.per_page,
            totalItems: action.payload.data.total,
            totalPages: action.payload.data.last_page,
          };
          state.stats = {
            totalProperties: action.payload.total_properties,
            liveProperties: action.payload.live_properties,
            activePlans: action.payload.active_plans,
            totalSold: action.payload.total_sold,
          };
        }
      )
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to fetch properties",
        };
      });
  },
});


export const { setPropertiesPage} = propertiesSlice.actions;

export default propertiesSlice.reducer;
export const selectPropertiesagination = (state: {
  properties: PropertiesState;
}) => state.properties.pagination;