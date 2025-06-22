import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReactNode } from "react";

// store/modalSlice.ts
interface ModalState {
  isOpen: boolean;
  component: React.ComponentType<any> | null;
  componentProps: any;
}

const initialState: ModalState = {
  isOpen: false,
  component: null,
  componentProps: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{
        component: React.ComponentType<any>;
        componentProps?: any;
      }>
    ) => {
      state.isOpen = true;
      state.component = action.payload.component;
      state.componentProps = action.payload.componentProps || null;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.component = null;
      state.componentProps = null;
    },
  },
});
export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
