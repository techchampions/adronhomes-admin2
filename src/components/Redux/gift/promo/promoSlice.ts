// Redux/gift/promo/promoSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../middleware';
import { toast } from 'react-toastify';

// Types matching API
export interface RewardItem {
  item_id: string;
  name: string;
  qty: number;
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
  id?: string;
  promo_name: string;
  tiers: Tier[];
}

// Main Promo interface for table display
export interface Promo {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  properties?: any[];
  tiers?: any[];
  is_active?: number;
  promo_name?: string; // For backward compatibility
}

export interface SimplePromo {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  is_active?: number;
}

interface PromoState {
  currentPromo: PromoFormData | null;
  isEditing: boolean;

  isLoading: boolean;
  error: string | null;
  submitStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  promos: Promo[];
  promosList: SimplePromo[];
  promosLoading: boolean;
  promosError: string | null;
  success: boolean;
  singlePromoLoading: boolean;
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

// Helper functions
const createInitialRewardGroup = (): RewardGroup => ({
  logic: 'AND',
  items: [{ item_id: '', name: '', qty: 1 }],
});

const createInitialTier = (): Tier => ({
  trigger_amount: null,
  percentage: null,
  reward_groups: [createInitialRewardGroup()],
});

const initialPromoData: PromoFormData = {
  promo_name: '',
  tiers: [createInitialTier()],
};

const initialState: PromoState = {
  singlePromoLoading: false,
  currentPromo: null,
  isEditing: false,
  isLoading: false,
  error: null,
  submitStatus: 'idle',
  promos: [],
  promosList: [],
  promosLoading: false,
  promosError: null,
  success: false,
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

// API URLs
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PROMO_URL = `${BASE_URL}/api/admin/promo`;
const PROMO_LIST_URL = `${BASE_URL}/api/admin/promo/list`;

// Fetch all promos with pagination
export const fetchPromos = createAsyncThunk(
  'promo/fetchPromos',
  async (params: { page?: number; search?: string; sort_by?: string; per_page?: number } = {}, { rejectWithValue }) => {
    try {
      const { page = 1, search = '', sort_by = 'newest', per_page = 12 } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
        ...(search && { search }),
        ...(sort_by && { sort_by }),
      });
      
      const response = await api.get(`${PROMO_URL}?${queryParams}`);
      
      if (response.data && response.data.success && response.data.data) {
        const responseData = response.data.data;
        const promosArray = (responseData.data || []).map((item: any) => ({
          id: item.id,
          name: item.name || item.promo_name,
          created_at: item.created_at,
          updated_at: item.updated_at,
          properties: item.properties || [],
          tiers: item.tiers || [],
          is_active: item.is_active
        }));
        
        const paginationData = {
          currentPage: responseData.current_page || page,
          perPage: responseData.per_page || per_page,
          total: responseData.total || 0,
          lastPage: responseData.last_page || 1,
        };
        
        const statsData = {
          total_promotions: response.data.stats?.total_promotion || promosArray.length,
          total_tiers: response.data.stats?.total_tiers || 0,
          total_properties: response.data.stats?.total_properties || 0,
          active_promotions: response.data.stats?.active_promotions || 0,
        };
        
        return {
          success: true,
          data: promosArray,
          pagination: paginationData,
          stats: statsData,
        };
      }
      
      const fallbackPromos = Array.isArray(response.data) ? response.data : [];
      const fallbackPagination = {
        currentPage: page,
        perPage: per_page,
        total: fallbackPromos.length,
        lastPage: 1,
      };
      
      return {
        success: true,
        data: fallbackPromos,
        pagination: fallbackPagination,
        stats: initialState.stats,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch promos');
    }
  }
);

// Fetch simple list of promos
export const fetchPromosList = createAsyncThunk(
  'promo/fetchPromosList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(PROMO_LIST_URL);
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      
      return [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch promos list');
    }
  }
);

// Fetch single promo by ID
export const fetchPromoById = createAsyncThunk(
  'promo/fetchPromoById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`${PROMO_URL}/${id}`);
      if (response.data && response.data.success) {
        return response.data;
      }
      return { success: true, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch promo');
    }
  }
);


export const removePropertyFromPromotion = createAsyncThunk(
  'promo/removePropertyFromPromotion',
  async (data: { property_id: number; promo_id: number }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${PROMO_URL}/unlink-property`, {
        property_id: data.property_id,
        promo_id: data.promo_id
      });
      
      if (response.data && response.data.success) {
        return response.data;
      }
      return { success: true, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unlink property from promotion');
    }
  }
);

// Create new promo
export const createPromo = createAsyncThunk(
  'promo/createPromo',
  async (promoData: PromoFormData, { rejectWithValue }) => {
    try {
      const response = await api.post(PROMO_URL, promoData);
      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Promotion created successfully');
        return response.data;
      }
      return { success: true, data: response.data, message: 'Promo created successfully' };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create promo');
    }
  }
);

// Update existing promo
export const updatePromo = createAsyncThunk(
  'promo/updatePromo',
  async ({ id, data }: { id: string; data: PromoFormData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${PROMO_URL}/${id}`, data);
      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Promotion updated successfully');
        return response.data;
      }
      return { success: true, data: response.data, message: 'Promo updated successfully' };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update promo');
    }
  }
);

// Delete promo
export const deletePromo = createAsyncThunk(
  'promo/deletePromo',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`${PROMO_URL}/${id}`);
      toast.success(response.data?.message || 'Promotion deleted successfully');
      return { success: true, id, message: 'Promo deleted successfully' };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete promo');
    }
  }
);

// Bulk assign promotions to properties
export const bulkAssignMultiplePromos = createAsyncThunk(
  'promo',
  async (payload: { promo_ids: number[]; property_ids: number[] }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${PROMO_URL}/assign-properties`, payload);
      toast.success(response.data?.message || 'Promotions assigned successfully');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign promotions');
    }
  }
);

// Toggle promo status
export const togglePromoStatus = createAsyncThunk(
  'promo/togglePromoStatus',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`${PROMO_URL}/${id}/toggle-status`);
      if (response.data && response.data.success) {
        toast.success(response.data.message || 'Promotion status updated successfully');
        return response.data;
      }
      return { success: true, data: response.data, message: 'Status updated successfully' };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update promotion status');
    }
  }
);

const promoSlice = createSlice({
  name: 'promo',
  initialState,
  reducers: {
    setCurrentPromo: (state, action: PayloadAction<PromoFormData | null>) => {
      state.currentPromo = action.payload;
      state.isEditing = !!action.payload?.id;
      state.error = null;
      state.submitStatus = 'idle';
      state.success = false;
    },
    
    resetCurrentPromo: (state) => {
      state.currentPromo = null;
      state.isEditing = false;
      state.error = null;
      state.submitStatus = 'idle';
      state.success = false;
    },
    
    initializeCreateForm: (state) => {
      state.currentPromo = { ...initialPromoData };
      state.isEditing = false;
      state.error = null;
      state.submitStatus = 'idle';
      state.success = false;
    },
    
    updateCurrentPromo: (state, action: PayloadAction<Partial<PromoFormData>>) => {
      if (state.currentPromo) {
        state.currentPromo = { ...state.currentPromo, ...action.payload };
      } else {
        state.currentPromo = { ...initialPromoData, ...action.payload };
      }
      state.success = false;
    },
    
    clearPromoSuccess: (state) => {
      state.success = false;
      state.submitStatus = 'idle';
    },
    
    addTier: (state) => {
      if (state.currentPromo) {
        state.currentPromo.tiers.push(createInitialTier());
      }
    },
    
    removeTier: (state, action: PayloadAction<number>) => {
      if (state.currentPromo && state.currentPromo.tiers.length > 1) {
        state.currentPromo.tiers.splice(action.payload, 1);
      }
    },
    
    updateTier: (
      state,
      action: PayloadAction<{ index: number; field: keyof Tier; value: any }>
    ) => {
      if (state.currentPromo) {
        const { index, field, value } = action.payload;
        (state.currentPromo.tiers[index] as any)[field] = value;
      }
    },
    
    addRewardGroup: (state, action: PayloadAction<{ tierIndex: number }>) => {
      if (state.currentPromo) {
        const { tierIndex } = action.payload;
        state.currentPromo.tiers[tierIndex].reward_groups.push(createInitialRewardGroup());
      }
    },
    
    removeRewardGroup: (
      state,
      action: PayloadAction<{ tierIndex: number; groupIndex: number }>
    ) => {
      if (state.currentPromo) {
        const { tierIndex, groupIndex } = action.payload;
        const groups = state.currentPromo.tiers[tierIndex].reward_groups;
        if (groups.length > 1) {
          groups.splice(groupIndex, 1);
        }
      }
    },
    
    updateRewardGroupLogic: (
      state,
      action: PayloadAction<{ tierIndex: number; groupIndex: number; logic: 'AND' | 'OR' }>
    ) => {
      if (state.currentPromo) {
        const { tierIndex, groupIndex, logic } = action.payload;
        state.currentPromo.tiers[tierIndex].reward_groups[groupIndex].logic = logic;
      }
    },
    
    addRewardItem: (
      state,
      action: PayloadAction<{ tierIndex: number; groupIndex: number }>
    ) => {
      if (state.currentPromo) {
        const { tierIndex, groupIndex } = action.payload;
        const group = state.currentPromo.tiers[tierIndex].reward_groups[groupIndex];
        group.items.push({ item_id: '', name: '', qty: 1 });
      }
    },
    
    removeRewardItem: (
      state,
      action: PayloadAction<{ tierIndex: number; groupIndex: number; itemIndex: number }>
    ) => {
      if (state.currentPromo) {
        const { tierIndex, groupIndex, itemIndex } = action.payload;
        const items = state.currentPromo.tiers[tierIndex].reward_groups[groupIndex].items;
        if (items.length > 1) {
          items.splice(itemIndex, 1);
        }
      }
    },
    
    updateRewardItem: (
      state,
      action: PayloadAction<{
        tierIndex: number;
        groupIndex: number;
        itemIndex: number;
        field: keyof RewardItem;
        value: any;
      }>
    ) => {
      if (state.currentPromo) {
        const { tierIndex, groupIndex, itemIndex, field, value } = action.payload;
        const item = state.currentPromo.tiers[tierIndex].reward_groups[groupIndex].items[itemIndex];
        
        if (field === 'item_id') {
          item.item_id = value;
          if (!item.name && value) {
            item.name = value;
          }
        } else if (field === 'name') {
          item.name = value;
          if (!item.item_id && value) {
            item.item_id = value;
          }
        } else if (field === 'qty') {
          item.qty = typeof value === 'string' ? parseInt(value) || 1 : value;
        }
      }
    },
    
    resetSubmitStatus: (state) => {
      state.submitStatus = 'idle';
      state.error = null;
      state.success = false;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetPromosState: (state) => {
      state.promos = [];
      state.promosList = [];
      state.promosLoading = false;
      state.promosError = null;
      state.pagination = initialState.pagination;
      state.stats = initialState.stats;
      state.search = '';
    },
    
    setPromosPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    
    setPromosSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.pagination.currentPage = 1;
    },
    
    optimisticToggleStatus: (state, action: PayloadAction<{ id: string; newStatus: number }>) => {
      const { id, newStatus } = action.payload;
      
      const index = state.promos.findIndex(p => p.id.toString() === id);
      if (index !== -1) {
        state.promos[index] = { 
          ...state.promos[index], 
          is_active: newStatus
        };
      }
      
      const listIndex = state.promosList.findIndex(p => p.id.toString() === id);
      if (listIndex !== -1) {
        state.promosList[listIndex] = { 
          ...state.promosList[listIndex], 
          is_active: newStatus
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromos.pending, (state) => {
        state.promosLoading = true;
        state.promosError = null;
      })
      .addCase(fetchPromos.fulfilled, (state, action) => {
        state.promosLoading = false;
        state.promos = action.payload.data;
        state.pagination = action.payload.pagination;
        state.stats = action.payload.stats;
        state.promosError = null;
      })
      .addCase(fetchPromos.rejected, (state, action) => {
        state.promosLoading = false;
        state.promosError = action.payload as string;
        toast.error(action.payload as string || 'Failed to fetch promotions');
      })
      
      .addCase(fetchPromosList.pending, (state) => {
        state.promosLoading = true;
        state.promosError = null;
      })
      .addCase(fetchPromosList.fulfilled, (state, action) => {
        state.promosLoading = false;
        state.promosList = action.payload;
        state.promosError = null;
      })
      .addCase(fetchPromosList.rejected, (state, action) => {
        state.promosLoading = false;
        state.promosError = action.payload as string;
        toast.error(action.payload as string || 'Failed to fetch promotions list');
      })
      
      .addCase(fetchPromoById.pending, (state) => {
        state.singlePromoLoading = true;
        state.error = null;
      })
      .addCase(fetchPromoById.fulfilled, (state, action) => {
        state.singlePromoLoading = false;
        const responseData = action.payload;
        state.currentPromo = responseData.data || responseData;
        state.isEditing = true;
        state.submitStatus = 'idle';
        state.error = null;
        state.success = false;
      })
      .addCase(fetchPromoById.rejected, (state, action) => {
        state.singlePromoLoading = false;
        state.error = action.payload as string;
        state.success = false;
        toast.error(action.payload as string || 'Failed to fetch promotion');
      })
      
      .addCase(createPromo.pending, (state) => {
        state.submitStatus = 'loading';
        state.error = null;
        state.success = false;
      })
      .addCase(createPromo.fulfilled, (state, action) => {
        state.submitStatus = 'succeeded';
        state.success = true;
        const newPromo = action.payload.data || action.payload;
        const formattedPromo: Promo = {
          id: newPromo.id,
          name: newPromo.name || newPromo.promo_name,
          created_at: newPromo.created_at,
          updated_at: newPromo.updated_at,
          properties: newPromo.properties || [],
          tiers: newPromo.tiers || [],
          is_active: newPromo.is_active
        };
        state.promos.unshift(formattedPromo);
        state.promosList.unshift({ 
          id: formattedPromo.id, 
          name: formattedPromo.name, 
          created_at: formattedPromo.created_at, 
          updated_at: formattedPromo.updated_at,
          is_active: formattedPromo.is_active 
        });
        if (state.stats) {
          state.stats.total_promotions += 1;
          if (formattedPromo.is_active === 1) {
            state.stats.active_promotions += 1;
          }
        }
        state.currentPromo = null;
        state.isEditing = false;
        state.error = null;
      })
      .addCase(createPromo.rejected, (state, action) => {
        state.submitStatus = 'failed';
        state.success = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || 'Failed to create promotion');
      })
      
      .addCase(updatePromo.pending, (state) => {
        state.submitStatus = 'loading';
        state.error = null;
        state.success = false;
      })
      .addCase(updatePromo.fulfilled, (state, action) => {
        state.submitStatus = 'succeeded';
        state.success = true;
        const updatedPromo = action.payload.data || action.payload;
        const formattedPromo: Promo = {
          id: updatedPromo.id,
          name: updatedPromo.name || updatedPromo.promo_name,
          created_at: updatedPromo.created_at,
          updated_at: updatedPromo.updated_at,
          properties: updatedPromo.properties || [],
          tiers: updatedPromo.tiers || [],
          is_active: updatedPromo.is_active
        };
        const index = state.promos.findIndex(p => p.id === formattedPromo.id);
        if (index !== -1) {
          state.promos[index] = formattedPromo;
        }
        const listIndex = state.promosList.findIndex(p => p.id === formattedPromo.id);
        if (listIndex !== -1) {
          state.promosList[listIndex] = { 
            id: formattedPromo.id, 
            name: formattedPromo.name, 
            created_at: formattedPromo.created_at, 
            updated_at: formattedPromo.updated_at,
            is_active: formattedPromo.is_active
          };
        }
        state.currentPromo = null;
        state.isEditing = false;
        state.error = null;
      })
      .addCase(updatePromo.rejected, (state, action) => {
        state.submitStatus = 'failed';
        state.success = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || 'Failed to update promotion');
      })
      
      .addCase(deletePromo.pending, (state) => {
        state.submitStatus = 'loading';
        state.error = null;
      })
      .addCase(deletePromo.fulfilled, (state, action) => {
        state.submitStatus = 'succeeded';
        state.success = true;
        const deletedPromo = state.promos.find(promo => promo.id.toString() === action.payload.id);
        state.promos = state.promos.filter(promo => promo.id.toString() !== action.payload.id);
        state.promosList = state.promosList.filter(promo => promo.id.toString() !== action.payload.id);
        if (state.stats) {
          state.stats.total_promotions = Math.max(0, state.stats.total_promotions - 1);
          if (deletedPromo?.is_active === 1) {
            state.stats.active_promotions = Math.max(0, state.stats.active_promotions - 1);
          }
        }
      })
      .addCase(deletePromo.rejected, (state, action) => {
        state.submitStatus = 'failed';
        state.error = action.payload as string;
        state.success = false;
      })
      
      .addCase(bulkAssignMultiplePromos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bulkAssignMultiplePromos.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(bulkAssignMultiplePromos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = false;
        toast.error(action.payload as string || 'Failed to assign promotions');
      })
      
      .addCase(togglePromoStatus.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        const id = action.meta.arg;
        const promo = state.promos.find(p => p.id.toString() === id);
        if (promo) {
          const newStatus = promo.is_active === 1 ? 0 : 1;
          const index = state.promos.findIndex(p => p.id.toString() === id);
          if (index !== -1) {
            state.promos[index] = { ...state.promos[index], is_active: newStatus };
          }
          const listIndex = state.promosList.findIndex(p => p.id.toString() === id);
          if (listIndex !== -1) {
            state.promosList[listIndex] = { ...state.promosList[listIndex], is_active: newStatus };
          }
          if (state.stats) {
            if (newStatus === 1) {
              state.stats.active_promotions += 1;
            } else {
              state.stats.active_promotions -= 1;
            }
          }
        }
      })
      .addCase(togglePromoStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        const updatedPromo = action.payload.data || action.payload;
        
        const index = state.promos.findIndex(p => p.id.toString() === updatedPromo.id?.toString());
        if (index !== -1) {
          state.promos[index] = { 
            ...state.promos[index], 
            is_active: updatedPromo.is_active
          };
        }
        
        const listIndex = state.promosList.findIndex(p => p.id.toString() === updatedPromo.id?.toString());
        if (listIndex !== -1) {
          state.promosList[listIndex] = { 
            ...state.promosList[listIndex], 
            is_active: updatedPromo.is_active
          };
        }
        
        if (state.stats) {
          state.stats.active_promotions = state.promos.filter(p => p.is_active === 1).length;
        }
      })
      .addCase(togglePromoStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.success = false;
        toast.error(action.payload as string || 'Failed to update promotion status');
        
        const id = action.meta.arg;
        const promo = state.promos.find(p => p.id.toString() === id);
        if (promo) {
          const originalStatus = promo.is_active === 1 ? 0 : 1;
          const index = state.promos.findIndex(p => p.id.toString() === id);
          if (index !== -1) {
            state.promos[index] = { ...state.promos[index], is_active: originalStatus };
          }
          const listIndex = state.promosList.findIndex(p => p.id.toString() === id);
          if (listIndex !== -1) {
            state.promosList[listIndex] = { ...state.promosList[listIndex], is_active: originalStatus };
          }
          if (state.stats) {
            if (originalStatus === 1) {
              state.stats.active_promotions += 1;
            } else {
              state.stats.active_promotions -= 1;
            }
          }
        }
      })
      .addCase(removePropertyFromPromotion.fulfilled, (state, action) => {
  state.isLoading = false;
  state.success = true;
  
  if (state.currentPromo && state.currentPromo.id) {
    const promoId = state.currentPromo.id;
    const propertyId = action.meta.arg.property_id;
    
    const promoIndex = state.promos.findIndex(p => p.id.toString() === promoId.toString());
    if (promoIndex !== -1 && state.promos[promoIndex].properties) {
      const oldLength = state.promos[promoIndex].properties.length;
      state.promos[promoIndex].properties = state.promos[promoIndex].properties?.filter(
        (prop: any) => prop.id !== propertyId && prop.property_id !== propertyId
      );
      
      // Update stats if properties were removed
      if (state.stats && oldLength > state.promos[promoIndex].properties.length) {
        state.stats.total_properties = Math.max(0, state.stats.total_properties - 1);
      }
    }
  }
  
  toast.success(action.payload?.message || 'Property removed from promotion successfully');
});
  },
});

// Export actions
export const {
  setCurrentPromo,
  resetCurrentPromo,
  initializeCreateForm,
  updateCurrentPromo,
  clearPromoSuccess,
  addTier,
  removeTier,
  updateTier,
  addRewardGroup,
  removeRewardGroup,
  updateRewardGroupLogic,
  addRewardItem,
  removeRewardItem,
  updateRewardItem,
  resetSubmitStatus,
  clearError,
  resetPromosState,
  optimisticToggleStatus,
  setPromosPage,
  setPromosSearch,
} = promoSlice.actions;

// Export selectors
export const selectCurrentPromo = (state: { promo: PromoState }) => state.promo.currentPromo;
export const selectIsEditing = (state: { promo: PromoState }) => state.promo.isEditing;
export const selectIsLoading = (state: { promo: PromoState }) => state.promo.isLoading;
export const selectSubmitStatus = (state: { promo: PromoState }) => state.promo.submitStatus;
export const selectError = (state: { promo: PromoState }) => state.promo.error;
export const selectAllPromos = (state: { promo: PromoState }) => state.promo.promos;
export const selectPromosList = (state: { promo: PromoState }) => state.promo.promosList;
export const selectPromosLoading = (state: { promo: PromoState }) => state.promo.promosLoading;
export const selectPromosError = (state: { promo: PromoState }) => state.promo.promosError;
export const selectPromoSuccess = (state: { promo: PromoState }) => state.promo.success;
export const selectPromosPagination = (state: { promo: PromoState }) => state.promo.pagination;
export const selectPromosStats = (state: { promo: PromoState }) => state.promo.stats;
export const selectPromosSearch = (state: { promo: PromoState }) => state.promo.search;

export const selectSinglePromoLoading = (state: { promo: PromoState }) => state.promo.singlePromoLoading;

export default promoSlice.reducer;