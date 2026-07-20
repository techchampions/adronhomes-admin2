// giftFormSelectors.ts - Redux selectors
// import { RootState } from './store';

import { RootState } from "../store";

export const selectGiftFormData = (state: RootState) => state.giftForm.formData;
export const selectIsEditing = (state: RootState) => state.giftForm.isEditing;
export const selectEditingId = (state: RootState) => state.giftForm.editingId;
export const selectIsFormLoading = (state: RootState) => state.giftForm.isLoading;
export const selectFormError = (state: RootState) => state.giftForm.error;
export const selectIsFormDirty = (state: RootState) => state.giftForm.isDirty;