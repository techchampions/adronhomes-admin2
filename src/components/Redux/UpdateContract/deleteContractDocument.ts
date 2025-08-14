// deleteContractDocumentSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import api from '../middleware';

// Types
interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

interface DeleteContractDocumentResponse {
  success: boolean;
  message: string;
}

interface DeleteContractDocumentParams {
  documentId: number;
}

interface DeleteContractDocumentState {
  loading: boolean;
  error: string | null;
  success: boolean | null;
  message: string | null;
}

const initialState: DeleteContractDocumentState = {
  loading: false,
  error: null,
  success: null,
  message: null,
};

// Thunk
export const deleteContractDocument = createAsyncThunk<
  DeleteContractDocumentResponse,
  DeleteContractDocumentParams,
  { rejectValue: ErrorResponse }
>(
  'contractDocument/delete',
  async ({ documentId }, { rejectWithValue }) => {
    const token = Cookies.get('token');

    if (!token) {
      return rejectWithValue({ message: 'No authentication token found. Please login again.' });
    }

    try {
      const response = await api.delete<DeleteContractDocumentResponse>(
        `https://adron.microf10.sg-host.com/api/admin/delete-contract-document/${documentId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            identifier: 'dMNOcdMNOPefFGHIlefFGHIJKLmno',
            device_id: '1010l0010l1',
          },
        }
      );
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<ErrorResponse>;
      if (axiosError.response?.status === 401) {
        Cookies.remove('token');
        toast.error('Session expired. Please login again.');
      }
      if (axiosError.response) {
        return rejectWithValue(axiosError.response.data);
      }
      return rejectWithValue({
        message: 'An unexpected error occurred. Please try again.',
      });
    }
  }
);

// Slice
const deleteContractDocumentSlice = createSlice({
  name: 'deleteContractDocument',
  initialState,
  reducers: {
    resetDeleteState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteContractDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
        state.message = null;
      })
      .addCase(deleteContractDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.message = action.payload.message;
      })
      .addCase(deleteContractDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete document';
        state.success = false;
      });
  },
});

export const { resetDeleteState } = deleteContractDocumentSlice.actions;
export default deleteContractDocumentSlice.reducer;