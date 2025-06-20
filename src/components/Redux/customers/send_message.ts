import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

// Types
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface Message {
  id: number;
  receiver: string;
  sender: number;
  messageId: string;
  message: string;
  updated_at: string;
  created_at: string;
}

export interface MessageResponse {
  status: boolean;
  message: string;
  data: Message;
}

export interface SendMessageParams {
  userId: string;
  message: string;
}

interface MessageState {
  data: Message | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: MessageState = {
  data: null,
  loading: false,
  error: null,
  success: false,
};

// Thunk for sending message
export const sendMessage = createAsyncThunk<
  MessageResponse,
  SendMessageParams,
  {
    rejectValue: ErrorResponse;
  }
>(
  'message/send',
  async ({ userId, message }, { rejectWithValue }) => {
    const token = Cookies.get('token');

    if (!token) {
      return rejectWithValue({ message: 'No authentication token found. Please login again.' });
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('message', message);

    try {
      const response = await axios.post<MessageResponse>(
        'https://adron.microf10.sg-host.com/api/admin/message-user',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
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
          message: axiosError.response.data.message || 'Failed to send message',
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
const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.data = null;
      state.error = null;
      state.success = false;
    },
    resetMessageState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        sendMessage.fulfilled,
        (state, action: PayloadAction<MessageResponse>) => {
          state.loading = false;
          state.data = action.payload.data;
          state.success = action.payload.status;
          state.error = null;
          if (action.payload.status) {
            toast.success(action.payload.message);
          }
        }
      )
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.success = false;
        state.error =
          (action.payload && 'message' in action.payload)
            ? action.payload.message
            : action.error.message || 'Failed to send message';
        
        if (state.error) {
          toast.error(state.error);
        }
      });
  },
});

// Exports
export const { clearMessage, resetMessageState } = messageSlice.actions;
export default messageSlice.reducer;