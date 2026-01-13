import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { directors, marketers, ErrorResponse } from "./directors_thunk"; // Import both thunks

interface Personnel {
  id: number;
  first_name: string;
  last_name: string;
}

interface PersonnelsState {
  directors: {
    data: Personnel[];
    loading: boolean;
    error: ErrorResponse | null;
    success: boolean;
  };
  marketers: {
    data: Personnel[];
    loading: boolean;
    error: ErrorResponse | null;
    success: boolean;
  };
  currentType: 'directors' | 'marketers';
}

const initialState: PersonnelsState = {
  directors: {
    data: [],
    loading: false,
    error: null,
    success: false,
  },
  marketers: {
    data: [],
    loading: false,
    error: null,
    success: false,
  },
  currentType: 'directors',
};

const personnelsSlice = createSlice({
  name: "personnels",
  initialState,
  reducers: {
    resetPersonnelsState: () => initialState,
    setPersonnelType: (state, action: PayloadAction<'directors' | 'marketers'>) => {
      state.currentType = action.payload;
    },
    resetDirectors: (state) => {
      state.directors = initialState.directors;
    },
    resetMarketers: (state) => {
      state.marketers = initialState.marketers;
    },
  },
  extraReducers: (builder) => {
    // Directors reducers
    builder
      .addCase(directors.pending, (state) => {
        state.directors.loading = true;
        state.directors.error = null;
        state.directors.success = false;
      })
      .addCase(
        directors.fulfilled,
        (state, action: PayloadAction<{ success: boolean; data: Personnel[] }>) => {
          state.directors.loading = false;
          state.directors.data = action.payload.data;
          state.directors.success = action.payload.success;
        }
      )
      .addCase(
        directors.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.directors.loading = false;
          state.directors.error = action.payload || {
            message: "An unknown error occurred",
          };
          state.directors.success = false;
        }
      );
    
    // Marketers reducers
    builder
      .addCase(marketers.pending, (state) => {
        state.marketers.loading = true;
        state.marketers.error = null;
        state.marketers.success = false;
      })
      .addCase(
        marketers.fulfilled,
        (state, action: PayloadAction<{ success: boolean; data: Personnel[] }>) => {
          state.marketers.loading = false;
          state.marketers.data = action.payload.data;
          state.marketers.success = action.payload.success;
        }
      )
      .addCase(
        marketers.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.marketers.loading = false;
          state.marketers.error = action.payload || {
            message: "An unknown error occurred",
          };
          state.marketers.success = false;
        }
      );
  },
});

export const { resetPersonnelsState, setPersonnelType, resetDirectors, resetMarketers } = personnelsSlice.actions;
export default personnelsSlice.reducer;