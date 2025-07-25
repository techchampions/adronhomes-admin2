import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { RootState } from "../store";
import { toast } from "react-toastify";

export interface CreateContractDocumentPayload {
  documents: Array<{
    plan_id: number;
    document_file: File;
  }>;
}

export interface DocumentData {
  id: any;
  plan_id: any;
  document_path: any;
  created_at: any;
  updated_at: any;
}

export interface CreateContractDocumentResponse {
  success: boolean;
  message: string;
  data?: DocumentData[];
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const createContractDocumentsThunk = createAsyncThunk<
  CreateContractDocumentResponse,
  CreateContractDocumentPayload,
  {
    state: RootState;
    rejectValue: ErrorResponse;
  }
>(
  "contractDocuments/create",
  async (payload, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      return rejectWithValue({
        message: "No authentication token found. Please login again.",
      });
    }

    try {
      const formData = new FormData();
      
      payload.documents.forEach((doc, index) => {
        formData.append(`documents[${index}][plan_id]`, doc.plan_id.toString());
        formData.append(`documents[${index}][document_file]`, doc.document_file);
      });

      const response = await axios.post<CreateContractDocumentResponse>(
        `${BASE_URL}/api/admin/add-contract-document`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Documents uploaded successfully!");
      } else {
        toast.warning(response.data.message || "Documents upload completed with warnings");
      }
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
        toast.error("Session expired. Please login again.");
      }

      if (axiosError.response) {
        if (axiosError.response.data.errors) {
          for (const [field, errors] of Object.entries(axiosError.response.data.errors)) {
            errors.forEach(err => toast.error(`${field}: ${err}`));
          }
        } else {
          toast.error(axiosError.response.data.message || "Failed to upload documents.");
        }
        
        return rejectWithValue({
          message: axiosError.response.data.message || "Failed to upload documents.",
          errors: axiosError.response.data.errors,
        });
      }

      toast.error("An unexpected error occurred. Please try again.");
      return rejectWithValue({
        message: "An unexpected error occurred. Please try again.",
      });
    }
  }
);

interface DocumentState {
  documents: DocumentData[] | null;
  loading: boolean;
  error: string | null;
  validationErrors: Record<string, string[]> | null;
}

const initialState: DocumentState = {
  documents: null,
  loading: false,
  error: null,
  validationErrors: null,
};

const documentSlice = createSlice({
  name: "contractDocuments",
  initialState,
  reducers: {
    clearDocumentState: (state) => {
      state.documents = null;
      state.loading = false;
      state.error = null;
      state.validationErrors = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createContractDocumentsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(
        createContractDocumentsThunk.fulfilled,
        (state, action: PayloadAction<CreateContractDocumentResponse>) => {
          state.loading = false;
          state.documents = action.payload.data || null;
          state.error = null;
          state.validationErrors = null;
        }
      )
      .addCase(
        createContractDocumentsThunk.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || "Failed to upload documents.";
          state.validationErrors = action.payload?.errors || null;
        }
      );
  },
});

export const { clearDocumentState } = documentSlice.actions;
export default documentSlice.reducer;
