import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import api from "../middleware";

// ============ TYPES ============
export interface CittaContractType {
  id: number;
  name: string;
  code: string;
}

export interface CittaContractTypesResponse {
  success: boolean;
  message: CittaContractType[];
}

export interface ErrorResponse {
  message: string;
}

export interface CittaContractTypesState {
  contractTypes: CittaContractType[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ============ ASYNC THUNK ============
export const fetchCittaContractTypes = createAsyncThunk<
  CittaContractTypesResponse,
  void, // No parameters needed for this endpoint
  { rejectValue: ErrorResponse }
>("cittaContractTypes/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<CittaContractTypesResponse>(
      `${BASE_URL}/api/admin/citta-contract-types`,
    );
    return response.data;
  } catch (error: any) {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      Cookies.remove("token");
      return rejectWithValue({
        message: "Session expired. Please login again.",
      });
    }
    return rejectWithValue({
      message:
        error.response?.data?.message || "Failed to fetch Citta contract types",
    });
  }
});

// ============ INITIAL STATE ============
const initialState: CittaContractTypesState = {
  contractTypes: [],
  loading: false,
  error: null,
  successMessage: null,
};

// ============ SLICE ============
const cittaContractTypesSlice = createSlice({
  name: "cittaContractTypes",
  initialState,
  reducers: {
    clearCittaContractTypesError: (state) => {
      state.error = null;
    },
    clearCittaContractTypesSuccess: (state) => {
      state.successMessage = null;
    },
    clearCittaContractTypes: (state) => {
      state.contractTypes = [];
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // PENDING
      .addCase(fetchCittaContractTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      // FULFILLED
      .addCase(
        fetchCittaContractTypes.fulfilled,
        (state, action: PayloadAction<CittaContractTypesResponse>) => {
          state.loading = false;

          if (
            action.payload?.success &&
            Array.isArray(action.payload.message)
          ) {
            state.contractTypes = action.payload.message;
            state.successMessage = "Citta contract types loaded successfully";
          } else {
            state.contractTypes = [];
            state.error = "Invalid response format from server";
          }
        },
      )
      // REJECTED
      .addCase(fetchCittaContractTypes.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch Citta contract types";
      });
  },
});

// ============ ACTIONS ============
export const {
  clearCittaContractTypesError,
  clearCittaContractTypesSuccess,
  clearCittaContractTypes,
} = cittaContractTypesSlice.actions;

// ============ SELECTORS ============
export const selectAllCittaContractTypes = (state: {
  cittaContractTypes: CittaContractTypesState;
}) => state.cittaContractTypes.contractTypes;

export const selectCittaContractTypesLoading = (state: {
  cittaContractTypes: CittaContractTypesState;
}) => state.cittaContractTypes.loading;

export const selectCittaContractTypesError = (state: {
  cittaContractTypes: CittaContractTypesState;
}) => state.cittaContractTypes.error;

export const selectCittaContractTypesSuccess = (state: {
  cittaContractTypes: CittaContractTypesState;
}) => state.cittaContractTypes.successMessage;

// Formatted for dropdown - using code and name
export const selectCittaContractTypesDropdownOptions = (state: {
  cittaContractTypes: CittaContractTypesState;
}) =>
  state.cittaContractTypes.contractTypes.map((contractType) => ({
    value: contractType.code,
    label: `${contractType.name}`,
    original: contractType,
  }));

// Get contract type by code
export const selectCittaContractTypeByCode = (
  state: { cittaContractTypes: CittaContractTypesState },
  contractCode: string,
) =>
  state.cittaContractTypes.contractTypes.find(
    (contractType) => contractType.code === contractCode,
  );

// Get contract type by id
export const selectCittaContractTypeById = (
  state: { cittaContractTypes: CittaContractTypesState },
  id: number,
) =>
  state.cittaContractTypes.contractTypes.find(
    (contractType) => contractType.id === id,
  );

export default cittaContractTypesSlice.reducer;
