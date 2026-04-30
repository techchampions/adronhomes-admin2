// Redux/gift/promo/promoFormSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface RewardItem {
  item_id: string;
  name: string;
  qty: number;
  item_price?: number;
}

export interface RewardGroup {
  logic: 'AND' | 'OR';
  items: RewardItem[];
}

export interface Tier {
  trigger_amount: number | null;
  percentage: number | null;
  reward_groups: RewardGroup[];
}

export interface PromoFormData {
  promo_name: string;
  tiers: Tier[];
}

interface PromoFormState {
  formData: PromoFormData;
  isEditing: boolean;
  editingId: string | null;
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;
}

// Helper functions
const createInitialRewardGroup = (): RewardGroup => ({
  logic: 'AND',
  items: [{ item_id: '', name: '', qty: 1, item_price: 0 }],
});

const createInitialTier = (): Tier => ({
  trigger_amount: null,
  percentage: null,
  reward_groups: [createInitialRewardGroup()],
});

const initialFormData: PromoFormData = {
  promo_name: '',
  tiers: [createInitialTier()],
};

const initialState: PromoFormState = {
  formData: initialFormData,
  isEditing: false,
  editingId: null,
  isLoading: false,
  error: null,
  isDirty: false,
};

const promoFormSlice = createSlice({
  name: 'promoForm',
  initialState,
  reducers: {
    updateField: (
      state,
      action: PayloadAction<{ field: keyof PromoFormData; value: any }>
    ) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
      state.isDirty = true;
    },

    updateNestedField: (
      state,
      action: PayloadAction<{
        tierIndex: number;
        groupIndex?: number;
        itemIndex?: number;
        field: string;
        value: any;
      }>
    ) => {
      const { tierIndex, groupIndex, itemIndex, field, value } = action.payload;
      
      if (itemIndex !== undefined && groupIndex !== undefined) {
        // Update reward item
        const item = state.formData.tiers[tierIndex].reward_groups[groupIndex].items[itemIndex];
        if (field === 'name') {
          item.name = value;
          item.item_id = value;
        } else if (field === 'item_id') {
          item.item_id = value;
          item.name = value;
        } else if (field === 'qty') {
          item.qty = parseInt(value) || 1;
        } else if (field === 'item_price') {
          item.item_price = parseFloat(value) || 0;
        }
      } else if (groupIndex !== undefined) {
        // Update reward group logic
        if (field === 'logic') {
          state.formData.tiers[tierIndex].reward_groups[groupIndex].logic = value;
        }
      } else {
        // Update tier fields
        (state.formData.tiers[tierIndex] as any)[field] = value;
      }
      
      state.isDirty = true;
    },

    addTier: (state) => {
      state.formData.tiers.push(createInitialTier());
      state.isDirty = true;
    },

    removeTier: (state, action: PayloadAction<number>) => {
      if (state.formData.tiers.length > 1) {
        state.formData.tiers.splice(action.payload, 1);
        state.isDirty = true;
      }
    },

    addRewardGroup: (state, action: PayloadAction<{ tierIndex: number }>) => {
      const { tierIndex } = action.payload;
      state.formData.tiers[tierIndex].reward_groups.push(createInitialRewardGroup());
      state.isDirty = true;
    },

    removeRewardGroup: (
      state,
      action: PayloadAction<{ tierIndex: number; groupIndex: number }>
    ) => {
      const { tierIndex, groupIndex } = action.payload;
      const groups = state.formData.tiers[tierIndex].reward_groups;
      if (groups.length > 1) {
        groups.splice(groupIndex, 1);
        state.isDirty = true;
      }
    },

    addRewardItem: (
      state,
      action: PayloadAction<{ tierIndex: number; groupIndex: number }>
    ) => {
      const { tierIndex, groupIndex } = action.payload;
      state.formData.tiers[tierIndex].reward_groups[groupIndex].items.push({
        item_id: '',
        name: '',
        qty: 1,
        item_price: 0,
      });
      state.isDirty = true;
    },

    removeRewardItem: (
      state,
      action: PayloadAction<{ tierIndex: number; groupIndex: number; itemIndex: number }>
    ) => {
      const { tierIndex, groupIndex, itemIndex } = action.payload;
      const items = state.formData.tiers[tierIndex].reward_groups[groupIndex].items;
      if (items.length > 1) {
        items.splice(itemIndex, 1);
        state.isDirty = true;
      }
    },

    setEditingMode: (
      state,
      action: PayloadAction<{ id: string; data: PromoFormData }>
    ) => {
      state.formData = action.payload.data;
      state.isEditing = true;
      state.editingId = action.payload.id;
      state.isDirty = false;
      state.error = null;
    },

    resetForm: (state) => {
      state.formData = initialFormData;
      state.isEditing = false;
      state.editingId = null;
      state.isDirty = false;
      state.error = null;
      state.isLoading = false;
    },

    clearDirty: (state) => {
      state.isDirty = false;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  updateField,
  updateNestedField,
  addTier,
  removeTier,
  addRewardGroup,
  removeRewardGroup,
  addRewardItem,
  removeRewardItem,
  setEditingMode,
  resetForm,
  clearDirty,
  setLoading,
  setError,
} = promoFormSlice.actions;

export default promoFormSlice.reducer;