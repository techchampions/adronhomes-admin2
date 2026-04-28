// Redux/gift/promo/promoFormSelectors.ts
import { RootState } from "../../store";

export const selectPromoFormData = (state: RootState) => state.promoForm.formData;
export const selectIsEditing = (state: RootState) => state.promoForm.isEditing;
export const selectEditingId = (state: RootState) => state.promoForm.editingId;
export const selectIsFormLoading = (state: RootState) => state.promoForm.isLoading;
export const selectFormError = (state: RootState) => state.promoForm.error;
export const selectIsFormDirty = (state: RootState) => state.promoForm.isDirty;