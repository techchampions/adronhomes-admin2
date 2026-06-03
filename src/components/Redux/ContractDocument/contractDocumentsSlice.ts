// store/slices/contractDocumentsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ContractDocument, ApiResponse, contractService, ContractSaleDocument, AllocationDocument, ContractDocumentsResponse } from "./ContractDocument";

export interface ContractDocumentsState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  lastResponse: any;
  contractOfSale: ContractSaleDocument | null;
  allocationDocument: AllocationDocument | null;
  contractDocumentsList: any[];
}

const initialState: ContractDocumentsState = {
  isLoading: false,
  error: null,
  success: false,
  lastResponse: null,
  contractOfSale: null,
  allocationDocument: null,
  contractDocumentsList: [],
};

export const generateContractDocs = createAsyncThunk<
  ApiResponse,
  { doc_type: "contract_sale" | "general_contract" | "allocation"; plan_id: number }
>("contractDocuments/generate", async ({ doc_type, plan_id }) => {
  return await contractService.generateContractDocuments(doc_type, plan_id);
});

export const uploadContractDocs = createAsyncThunk<
  ApiResponse,
  { doc_type: "contract_sale" | "general_contract" | "allocation"; document_file: File; plan_id: number }
>("contractDocuments/upload", async ({ doc_type, document_file, plan_id }) => {
  return await contractService.uploadSingleDocument(doc_type, document_file, plan_id);
});

export const uploadMultipleContractDocs = createAsyncThunk<
  ApiResponse,
  { documents: ContractDocument[]; doc_type: "contract_sale" | "general_contract" | "allocation"; plan_id: number }
>("contractDocuments/uploadMultiple", async ({ documents, doc_type, plan_id }) => {
  return await contractService.uploadMultipleDocuments(documents, doc_type, plan_id);
});

export const approveContractDocs = createAsyncThunk<
  ApiResponse,
  { doc_type: "contract_sale" | "general_contract" | "allocation"; document_id: string; plan_id: number }
>("contractDocuments/approve", async ({ doc_type, document_id, plan_id }) => {
  return await contractService.approveDocument(doc_type, document_id, plan_id);
});

export const rejectContractDocs = createAsyncThunk<
  ApiResponse,
  { doc_type: "contract_sale" | "general_contract" | "allocation"; document_id: string; plan_id: number }
>("contractDocuments/reject", async ({ doc_type, document_id, plan_id }) => {
  return await contractService.rejectDocument(doc_type, document_id, plan_id);
});

export const fetchContractDocuments = createAsyncThunk<
  ContractDocumentsResponse,
  number
>("contractDocuments/fetch", async (planId) => {
  const response = await contractService.getContractDocuments(planId);
  return response;
});

export const downloadContractDocument = createAsyncThunk<
  { success: boolean; message: string },
  number
>("contractDocuments/download", async (documentId) => {
  const blob = await contractService.downloadContractDocument(documentId);
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `contract_document_${documentId}.pdf`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
  return { success: true, message: "Download started" };
});

const contractDocumentsSlice = createSlice({
  name: "contractDocuments",
  initialState,
  reducers: {
    resetContractState: () => initialState,
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.lastResponse = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch documents
    builder.addCase(fetchContractDocuments.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    
    builder.addCase(fetchContractDocuments.fulfilled, (state, action: PayloadAction<ContractDocumentsResponse>) => {
      state.isLoading = false;
      state.success = true;
      const response = action.payload;
      
      state.contractOfSale = response.contract_of_sale || null;
      state.allocationDocument = response.allocation_document || null;
      state.contractDocumentsList = response.contract_documents?.data || [];
      state.lastResponse = response;
    });
    
    builder.addCase(fetchContractDocuments.rejected, (state, action) => {
      state.isLoading = false;
      state.success = false;
      state.error = action.error?.message || "Failed to fetch documents";
    });
    
    // Generate Contract of Sale
    builder.addCase(generateContractDocs.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    
    builder.addCase(generateContractDocs.fulfilled, (state, action) => {
      state.isLoading = false;
      const response = action.payload;
      const docType = action.meta.arg.doc_type;
      
      if (response?.success) {
        state.success = true;
        state.lastResponse = response;
        state.error = null;
        
        // Update only the document type that was generated
        if (docType === "contract_sale" && response.data) {
          // Response data contains the contract of sale document
          state.contractOfSale = response.data as ContractSaleDocument;
        } 
        else if (docType === "allocation" && response.data) {
          // Response data contains the allocation document
          state.allocationDocument = response.data as AllocationDocument;
        }
        else if (docType === "general_contract" && response.data) {
          // Handle general contract generation
          if (!state.contractDocumentsList) {
            state.contractDocumentsList = [];
          }
          state.contractDocumentsList = [response.data, ...state.contractDocumentsList];
        }
      } else {
        state.success = false;
        state.error = response?.message || "Operation failed";
      }
    });
    
    builder.addCase(generateContractDocs.rejected, (state, action) => {
      state.isLoading = false;
      state.success = false;
      state.error = action.error?.message || "Failed to generate documents";
    });
    
    // Upload single document
    builder.addCase(uploadContractDocs.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    
    builder.addCase(uploadContractDocs.fulfilled, (state, action) => {
      state.isLoading = false;
      const response = action.payload;
      const docType = action.meta.arg.doc_type;
      
      if (response?.success) {
        state.success = true;
        state.lastResponse = response;
        state.error = null;
        
        if (docType === "contract_sale" && response.data) {
          state.contractOfSale = response.data as ContractSaleDocument;
        } 
        else if (docType === "allocation" && response.data) {
          state.allocationDocument = response.data as AllocationDocument;
        }
      } else {
        state.success = false;
        state.error = response?.message || "Operation failed";
      }
    });
    
    builder.addCase(uploadContractDocs.rejected, (state, action) => {
      state.isLoading = false;
      state.success = false;
      state.error = action.error?.message || "Failed to upload document";
    });
    
    // Upload multiple documents
    builder.addCase(uploadMultipleContractDocs.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    
    builder.addCase(uploadMultipleContractDocs.fulfilled, (state, action) => {
      state.isLoading = false;
      const response = action.payload;
      
      if (response?.success) {
        state.success = true;
        state.lastResponse = response;
        state.error = null;
        
        if (response.contract_documents?.data) {
          state.contractDocumentsList = response.contract_documents.data;
        }
      } else {
        state.success = false;
        state.error = response?.message || "Operation failed";
      }
    });
    
    builder.addCase(uploadMultipleContractDocs.rejected, (state, action) => {
      state.isLoading = false;
      state.success = false;
      state.error = action.error?.message || "Failed to upload documents";
    });
    
    // Approve document
    builder.addCase(approveContractDocs.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    
    builder.addCase(approveContractDocs.fulfilled, (state, action) => {
      state.isLoading = false;
      const response = action.payload;
      const docType = action.meta.arg.doc_type;
      
      if (response?.success) {
        state.success = true;
        state.lastResponse = response;
        state.error = null;
        
        // Update approval status
        if (docType === "contract_sale" && state.contractOfSale) {
          state.contractOfSale = {
            ...state.contractOfSale,
            is_approved: true
          };
        } 
        else if (docType === "allocation" && state.allocationDocument) {
          state.allocationDocument = {
            ...state.allocationDocument,
            is_approved: true
          };
        }
      } else {
        state.success = false;
        state.error = response?.message || "Operation failed";
      }
    });
    
    builder.addCase(approveContractDocs.rejected, (state, action) => {
      state.isLoading = false;
      state.success = false;
      state.error = action.error?.message || "Failed to approve document";
    });
    
    // Reject document
    builder.addCase(rejectContractDocs.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    
    builder.addCase(rejectContractDocs.fulfilled, (state, action) => {
      state.isLoading = false;
      const response = action.payload;
      const docType = action.meta.arg.doc_type;
      
      if (response?.success) {
        state.success = true;
        state.lastResponse = response;
        state.error = null;
        
        // Update rejection status
        if (docType === "contract_sale" && state.contractOfSale) {
          state.contractOfSale = {
            ...state.contractOfSale,
            is_approved: false
          };
        } 
        else if (docType === "allocation" && state.allocationDocument) {
          state.allocationDocument = {
            ...state.allocationDocument,
            is_approved: false
          };
        }
      } else {
        state.success = false;
        state.error = response?.message || "Operation failed";
      }
    });
    
    builder.addCase(rejectContractDocs.rejected, (state, action) => {
      state.isLoading = false;
      state.success = false;
      state.error = action.error?.message || "Failed to reject document";
    });
    
    // Download document
    builder.addCase(downloadContractDocument.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    
    builder.addCase(downloadContractDocument.fulfilled, (state) => {
      state.isLoading = false;
      state.success = true;
    });
    
    builder.addCase(downloadContractDocument.rejected, (state, action) => {
      state.isLoading = false;
      state.success = false;
      state.error = action.error?.message || "Failed to download document";
    });
  },
});

export const {
  resetContractState,
  clearError,
  clearSuccess,
} = contractDocumentsSlice.actions;

// Selectors
export const selectIsLoading = (state: { contractDocumentsfile: ContractDocumentsState }) => 
  state.contractDocumentsfile.isLoading;
export const selectError = (state: { contractDocumentsfile: ContractDocumentsState }) => 
  state.contractDocumentsfile.error;
export const selectSuccess = (state: { contractDocumentsfile: ContractDocumentsState }) => 
  state.contractDocumentsfile.success;
export const selectLastResponse = (state: { contractDocumentsfile: ContractDocumentsState }) => 
  state.contractDocumentsfile.lastResponse;
export const selectContractOfSale = (state: { contractDocumentsfile: ContractDocumentsState }) => 
  state.contractDocumentsfile.contractOfSale;
export const selectAllocationDocument = (state: { contractDocumentsfile: ContractDocumentsState }) => 
  state.contractDocumentsfile.allocationDocument;
export const selectContractDocumentsList = (state: { contractDocumentsfile: ContractDocumentsState }) => 
  state.contractDocumentsfile.contractDocumentsList;

export default contractDocumentsSlice.reducer;