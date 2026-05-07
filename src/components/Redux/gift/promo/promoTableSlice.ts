// Redux/gift/promo/promoTableSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

interface PromoTableState {
  promos: any[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
  };
  search: string;
  stats: {
    total_promotions: number;
    total_tiers: number;
    total_properties: number;
    active_promotions: number;
  };
}

const initialState: PromoTableState = {
  promos: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    perPage: 12,
    total: 0,
    lastPage: 1,
  },
  search: '',
  stats: {
    total_promotions: 0,
    total_tiers: 0,
    total_properties: 0,
    active_promotions: 0,
  },
};

const promoTableSlice = createSlice({
  name: 'promoTable',
  initialState,
  reducers: {
    setPromosLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPromosError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPromosData: (state, action: PayloadAction<{
      promos: any[];
      pagination: any;
      stats: any;
    }>) => {
      state.promos = action.payload.promos;
      state.pagination = action.payload.pagination;
      state.stats = action.payload.stats;
      state.loading = false;
      state.error = null;
    },
    setPromosPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setPromosSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.pagination.currentPage = 1;
    },
    resetPromosTable: (state) => {
      state.promos = [];
      state.pagination = initialState.pagination;
      state.search = '';
      state.stats = initialState.stats;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setPromosLoading,
  setPromosError,
  setPromosData,
  setPromosPage,
  setPromosSearch,
  resetPromosTable,
} = promoTableSlice.actions;

export const selectPromosPagination = (state: RootState) => state.promoTable.pagination;
export const selectPromosSearch = (state: RootState) => state.promoTable.search;
export const selectPromosStats = (state: RootState) => state.promoTable.stats;
export const selectPromosTableData = (state: RootState) => state.promoTable.promos;
export const selectPromosTableLoading = (state: RootState) => state.promoTable.loading;
export const selectPromosTableError = (state: RootState) => state.promoTable.error;

export default promoTableSlice.reducer;