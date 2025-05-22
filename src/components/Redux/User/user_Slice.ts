import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ErrorResponse, getUser, User, UserResponse } from "./user_Thunk";


interface UserState {
  user: User | null;
  loading: boolean;
  error: ErrorResponse | null;
  success: boolean;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  success: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        getUser.fulfilled,
        (state, action: PayloadAction<UserResponse>) => {
          state.loading = false;
          state.success = true;
          if (action.payload.user) {
            state.user = action.payload.user;
          }
        }
      )
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        if (action.payload) {
          state.error = action.payload;
        } else {
          state.error = {
            message: action.error.message || "Unknown error occurred",
          };
        }
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;