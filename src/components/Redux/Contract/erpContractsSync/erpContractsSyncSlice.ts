// erpContractsSyncSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { fetchERPContractsSync } from "./erpContractsSyncThunk";

interface ERPContractsSyncState {
  loading: boolean;
  success: boolean;
  error: string | null;
  data: {
    status: boolean;
    message: string;
    contract_ids: {
      linkedContracts: string[];
      erpContracts: Array<{
        id: number;
        customerName: string;
        customerCode: string;
        dateOfBirth: string;
        userId: number;
        propertyId: number | null;
        contractId: string;
        customerAddress: string;
        contractDate: string;
        propertyEstate: string;
        propertyName: string;
        customerTown: string;
        customerState: string;
        customerEmail: string;
        customerPhone: string;
        customerSMSPhone: string;
        customerTitle: string;
        customerGender: string;
        customerMarital: string;
        fullPayment: string;
        fullPaymentDate: string | null;
        quantity: string;
        propertyCost: string;
        propertyDiscount: string;
        propertyNetValue: string;
        propertyTenor: number;
        firstPaymentDate: string;
        lastPaymentDate: string;
        propertyBranch: string;
        currentbalance: string;
        created_at: string;
        updated_at: string;
      }>;
      query: Record<string, unknown>;
    };
  } | null;
}

const initialState: ERPContractsSyncState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

const erpContractsSyncSlice = createSlice({
  name: "erpContractsSync",
  initialState,
  reducers: {
    resetERPContractsSyncState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    },
    // Additional reducer to manually set data if needed
    setERPContractsData: (state, action) => {
      state.data = action.payload;
      state.success = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchERPContractsSync.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
        state.data = null;
      })
      .addCase(fetchERPContractsSync.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchERPContractsSync.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.data = null;
        state.error = action.payload?.message || "Failed to fetch ERP contracts data";
      });
  },
});

export const { resetERPContractsSyncState, setERPContractsData } = erpContractsSyncSlice.actions;

// Selectors for easy access to state data
export const selectERPContractsSync = (state: { erpContractsSync: ERPContractsSyncState }) => 
  state.erpContractsSync.data;
export const selectERPContractsLoading = (state: { erpContractsSync: ERPContractsSyncState }) => 
  state.erpContractsSync.loading;
export const selectERPContractsError = (state: { erpContractsSync: ERPContractsSyncState }) => 
  state.erpContractsSync.error;
export const selectERPContractsSuccess = (state: { erpContractsSync: ERPContractsSyncState }) => 
  state.erpContractsSync.success;

export default erpContractsSyncSlice.reducer;