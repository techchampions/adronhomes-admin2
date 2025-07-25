import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContractDocumentsResponse, ContractDocumentsState, fetchContractDocuments } from "./viewDocs";


const initialState: ContractDocumentsState = {
  data: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 1,
  },
};

const ViewcontractDocuments = createSlice({
  name: "ViewcontractDocuments",
  initialState,
  reducers: {
    setContractDocumentsPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    resetContractDocuments: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContractDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchContractDocuments.fulfilled,
        (state, action: PayloadAction<ContractDocumentsResponse>) => {
          state.loading = false;
          state.data = action.payload.contract_documents.data;
          state.pagination = {
            currentPage: action.payload.contract_documents.current_page,
            perPage: action.payload.contract_documents.per_page,
            totalItems: action.payload.contract_documents.total,
            totalPages: action.payload.contract_documents.last_page,
          };
        }
      )
      .addCase(fetchContractDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          message: "Failed to fetch contract documents",
        };
      });
  },
});

export const { setContractDocumentsPage, resetContractDocuments } =
  ViewcontractDocuments.actions;

export default ViewcontractDocuments.reducer;

// Selector
export const selectContractDocumentsPagination = (state: {
  ViewcontractDocuments: ContractDocumentsState;
}) => state.ViewcontractDocuments.pagination;