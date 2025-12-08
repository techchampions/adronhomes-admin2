import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchProperties,
  PropertiesResponse,
  PropertiesState,
} from "./properties_Thunk";

const initialState: PropertiesState = {
  drafted: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
      totalPages: 1,
    },
    search: "",
  },
  published: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
      totalPages: 1,
    },
    search: "",
  },
  sold: {
    data: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      perPage: 10,
      totalItems: 0,
      totalPages: 1,
    },
    search: "",
  },
  stats: {
    totalProperties: 0,
    total_published: 0,
    total_drafted: 0,
    totalSold: 0,
  },
  loading: false,
  error: null,
};

const propertiesSlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    setPropertiesPage: (
      state,
      action: PayloadAction<{
        type: "drafted" | "published" | "sold";
        page: number;
      }>
    ) => {
      const { type, page } = action.payload;
      state[type].pagination.currentPage = page;
    },
    setPropertiesSearch: (
      state,
      action: PayloadAction<{
        type: "drafted" | "published" | "sold";
        search: string;
      }>
    ) => {
      const { type, search } = action.payload;
      state[type].search = search;
      state[type].pagination.currentPage = 1;
    },
    clearPropertiesSearch: (
      state,
      action: PayloadAction<"drafted" | "published" | "sold">
    ) => {
      const type = action.payload;
      state[type].search = "";
      state[type].pagination.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.drafted.loading = true;
        state.published.loading = true;
        state.sold.loading = true;
      })
      .addCase(
        fetchProperties.fulfilled,
        (state, action: PayloadAction<PropertiesResponse>) => {
          state.loading = false;
          state.drafted.loading = false;
          state.published.loading = false;
          state.sold.loading = false;
          
          state.drafted.data = action.payload.drafted_properties.data;
          state.published.data = action.payload.published_properties.data;
          state.sold.data = action.payload.sold_properties.data;

          state.drafted.pagination = {
            currentPage: action.payload.drafted_properties.current_page,
            perPage: action.payload.drafted_properties.per_page,
            totalItems: action.payload.drafted_properties.total,
            totalPages: action.payload.drafted_properties.last_page,
          };

          state.published.pagination = {
            currentPage: action.payload.published_properties.current_page,
            perPage: action.payload.published_properties.per_page,
            totalItems: action.payload.published_properties.total,
            totalPages: action.payload.published_properties.last_page,
          };

          state.sold.pagination = {
            currentPage: action.payload.sold_properties.current_page,
            perPage: action.payload.sold_properties.per_page,
            totalItems: action.payload.sold_properties.total,
            totalPages: action.payload.sold_properties.last_page,
          };

          state.stats = {
            totalProperties: action.payload.total_properties,
            totalSold: action.payload.total_sold,
            total_published: action.payload.total_published,
            total_drafted: action.payload.total_drafted,
          };
        }
      )
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.drafted.loading = false;
        state.published.loading = false;
        state.sold.loading = false;
        state.error = action.payload || {
          message: "Failed to fetch properties",
        };
      });
  },
});

export const { setPropertiesPage, setPropertiesSearch, clearPropertiesSearch } = propertiesSlice.actions;
export default propertiesSlice.reducer;

export const selectPropertiesPagination = (state: {
  properties: PropertiesState;
}) => state.properties.drafted.pagination;

export const selectPublishedPropertiesPagination = (state: {
  properties: PropertiesState;
}) => state.properties.published.pagination;
export const selectSoldPropertiesPagination = (state: {
  properties: PropertiesState;
}) => state.properties.sold.pagination;
