import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { BASE_URL } from './viewcontractFormDetails';
import api from '../middleware';

// Types
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface ContractDownloadResponse {
  success: boolean;
  contract_download_link: string;
  message: string;
}

interface ContractDownloadParams {
  contractId: number;
}

interface ContractDownloadState {
  downloadLink: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: ContractDownloadState = {
  downloadLink: null,
  loading: false,
  error: null,
  message: null,
};

// Thunk
export const downloadContract = createAsyncThunk<
  ContractDownloadResponse,
  ContractDownloadParams,
  {
    rejectValue: ErrorResponse;
  }
>(
  'contractDownload/download',
  async ({ contractId }, { rejectWithValue }) => {
    const token = Cookies.get('token');

    if (!token) {
      return rejectWithValue({ message: 'No authentication token found. Please login again.' });
    }

    try {
      const response = await api.get<ContractDownloadResponse>(
        `${BASE_URL}/api/admin/download-contract-form/${contractId}`,
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
        return rejectWithValue({
          message: axiosError.response.data.message || 'Failed to download contract',
          errors: axiosError.response.data.errors,
        });
      } else if (axiosError.request) {
        return rejectWithValue({
          message: 'No response from server. Please check your network connection.',
        });
      }

      return rejectWithValue({
        message: 'An unexpected error occurred. Please try again.',
      });
    }
  }
);

// Slice
const contractDownloadSlice = createSlice({
  name: 'contractDownload',
  initialState,
  reducers: {
    clearContractDownload: (state) => {
      state.downloadLink = null;
      state.message = null;
      state.error = null;
    },
    resetContractDownloadState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(downloadContract.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(
        downloadContract.fulfilled,
        (state, action: PayloadAction<ContractDownloadResponse>) => {
          state.loading = false;
          state.downloadLink = action.payload.contract_download_link;
          state.message = action.payload.message;
          state.error = null;
        }
      )
      .addCase(downloadContract.rejected, (state, action) => {
        state.loading = false;
        state.downloadLink = null;
        state.error =
          (action.payload && 'message' in action.payload)
            ? action.payload.message
            : action.error.message || 'Failed to download contract';
      });
  },
});

// Exports
export const { clearContractDownload, resetContractDownloadState } =
  contractDownloadSlice.actions;
export default contractDownloadSlice.reducer;