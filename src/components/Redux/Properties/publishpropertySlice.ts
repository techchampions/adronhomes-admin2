import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorResponse, publishDraft, PublishDraftSuccessResponse } from "./publishPropertythunk";


// Define the state interface
interface PublishDraftState {
  loading: boolean;
  data: PublishDraftSuccessResponse | null;
  error: ErrorResponse | null;
  success:boolean
}

const initialState: PublishDraftState = {
  loading: false,
  data: null,
  error: null,
  success:false
};

// Create the slice
const publishDraftSlice = createSlice({
  name: "publishDraft",
  initialState,
  reducers: {
    resetPublishDraftState: (state) => {
      state.loading = false;
      state.data = null;
      state.error = null;
      state.success=false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishDraft.pending, (state) => {
        state.loading = true;
        state.data = null;
        state.error = null;
        state.success=false
      })
      .addCase(
        publishDraft.fulfilled,
        (
          state,
          action: PayloadAction<PublishDraftSuccessResponse>
        ) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
          state.success=true
        }
      )
      .addCase(
        publishDraft.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.loading = false;
          state.data = null;
          state.error = action.payload || {
            message: "An unknown error occurred",
          };
        }
      );
  },
});

export const { resetPublishDraftState } = publishDraftSlice.actions;
export default publishDraftSlice.reducer;