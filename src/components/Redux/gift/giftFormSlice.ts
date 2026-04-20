// giftFormSlice.ts - Updated with image fields
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GiftRequest } from './gift_thunk';

export interface GiftFormData {
  // Basic gift info
  giftName: string;
  giftType: string; // 'land', 'house', 'standard'
  estimatedValue: number | string;

  totalQuantity: number | string;
  quantityPerProperty: number | string;
  remainingQuantity: number | string;
  claimedCount: number | string;
  measurementUnit: string;
  
  // Availability
  startDate: string;
  endDate: string;
  
  // Content
  description: string;
  redemptionInstructions: string;
  termsAndConditions: string;
  status: string;
  imageUrl: string;
  
  // Image upload fields
  displayImage: File | null;
  imagePreview: string;
  
  // Metadata
  metadata: Record<string, any>;
}

export interface GiftFormState {
  formData: GiftFormData;
  isEditing: boolean;
  editingId: string | null;
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;
    giftRequests: GiftRequest[];
  giftRequestsLoading: boolean;
}

const initialFormData: GiftFormData = {
  giftName: '',
  giftType: '',
  estimatedValue: '',
  totalQuantity: '',
  quantityPerProperty: '',
  remainingQuantity: '',
  claimedCount: 0,
  measurementUnit: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  description: '',
  redemptionInstructions: '',
  termsAndConditions: '',
  status: 'active',
  imageUrl: '',
  displayImage: null,
  imagePreview: '',
  metadata: {},
};

const initialState: GiftFormState = {
  formData: initialFormData,
  isEditing: false,
  editingId: null,
  isLoading: false,
  error: null,
  isDirty: false,
  giftRequests: [],
giftRequestsLoading: false,
};

const giftFormSlice = createSlice({
  name: 'giftForm',
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<GiftFormData>) => {
      state.formData = { ...action.payload };
      state.isDirty = false;
    },
    
    updateField: (state, action: PayloadAction<{ field: keyof GiftFormData; value: any }>) => {
      const { field, value } = action.payload;
      state.formData = {
        ...state.formData,
        [field]: value,
      };
      state.isDirty = true;
    },
    
    updateMultipleFields: (state, action: PayloadAction<Partial<GiftFormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
      state.isDirty = true;
    },
    
    resetForm: (state) => {
      // Clean up preview URL if it exists
      if (state.formData.imagePreview && state.formData.imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(state.formData.imagePreview);
      }
      state.formData = { ...initialFormData };
      state.isEditing = false;
      state.editingId = null;
      state.isDirty = false;
      state.error = null;
    },
    
    setEditingMode: (state, action: PayloadAction<{ id: string; data: GiftFormData }>) => {
      state.isEditing = true;
      state.editingId = action.payload.id;
      state.formData = { ...action.payload.data };
      state.isDirty = false;
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearDirty: (state) => {
      state.isDirty = false;
    },
    
    clearImage: (state) => {
      if (state.formData.imagePreview && state.formData.imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(state.formData.imagePreview);
      }
      state.formData.displayImage = null;
      state.formData.imagePreview = '';
    },
  },
});

export const {
  setFormData,
  updateField,
  updateMultipleFields,
  resetForm,
  setEditingMode,
  setLoading,
  setError,
  clearDirty,
  clearImage,
} = giftFormSlice.actions;

export default giftFormSlice.reducer;