// src/types/giftTypes.ts
export interface GiftData {
  id: number;
  giftName: string;
  giftType: string;
  estimatedValue: number;
  totalQuantity: number;
  quantityPerProperty: number;
  remainingQuantity?: number;
  claimedCount?: number;
  measurementUnit: string;
  status: 'active' | 'disabled'
  startDate?: string;
  endDate?: string;
  description?: string;
  redemptionInstructions?: string;
  termsAndConditions?: string;
  displayImage?: string | null;
  imageUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GiftRequest {
  id: number;
  giftId: number;
  propertyId: number;
  propertyName: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  requestedAt: string;
  fulfilledAt?: string;
}

export interface GiftStats {
  totalGifts: number;
  totalRequests: number;
  pendingRequests: number;
  activatedGifts: number;
}

export interface GiftProperty {
  id: number;
  giftId: number;
  propertyId: number;
  propertyName: string;
  quantity: number;
  status: 'pending' | 'approved' | 'fulfilled';
  assignedAt: string;
}

// Sort option type
export interface SortOption {
  value: string;
  name: string;
}



// src/types/giftTypes.ts - UPDATED
export interface GiftData {
  id: number;
  giftName: string;
  giftType: string;
  estimatedValue: number;
  totalQuantity: number;
  quantityPerProperty: number;
  remainingQuantity?: number;
  claimedCount?: number;
  measurementUnit: string;
  status: 'active' | 'disabled'
  startDate?: string;
  endDate?: string;
  description?: string;
  redemptionInstructions?: string;
  termsAndConditions?: string;
  displayImage?: string | null;
  imageUrl?: string;
//   metadata?: {
//     brand?: string;
//     warranty_period?: string;
//     installation_included?: boolean | string; // Allow both boolean and string
//   };
  createdAt: string;
  updatedAt?: string;
}

// Sort option type
export interface SortOption {
  value: string;
  name: string;
}