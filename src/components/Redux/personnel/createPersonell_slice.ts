import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreatePersonnel, PersonnelResponse } from './personnel_thunk';

interface PersonnelState {
  loading: boolean;
  data: PersonnelResponse['personnel'] | null;
  success: boolean;
  error: string | null;
}

const initialState: PersonnelState = {
  loading: false,
  data: null,
  success: false,
  error: null,
};

const personnelSlice = createSlice({
  name: 'createpersonnel',
  initialState,
  reducers: {
    resetPersonnelState: (state) => {
      state.loading = false;
      state.data = null;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CreatePersonnel.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(CreatePersonnel.fulfilled, (state, action: PayloadAction<PersonnelResponse>) => {
        state.loading = false;
        state.data = action.payload.personnel;
        state.success = true;
        state.error = null;
      })
      .addCase(CreatePersonnel.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload?.message || 'Failed to create personnel';
      });
  },
});

export const { resetPersonnelState } = personnelSlice.actions;

export default personnelSlice.reducer;
