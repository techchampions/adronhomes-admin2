// erpContractsSyncThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { RootState } from "../../store";
import api from "../../middleware";

// Response interfaces
export interface ERPContract {
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
}

export interface ContractsSyncResponse {
  status: boolean;
  message: string;
  contract_ids: {
    linkedContracts: string[];
    erpContracts: ERPContract[];
    query: Record<string, unknown>;
  };
}

export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Async thunk for fetching ERP contracts sync data
export const fetchERPContractsSync = createAsyncThunk<
  ContractsSyncResponse,
  { userId: string }, // Changed parameter name from propertyId to userId for clarity
  { rejectValue: ErrorResponse; state: RootState }
>(
  "erpContracts/fetchSync",
  async ({ userId }, { rejectWithValue }) => {
    const token = Cookies.get('token');
    
    if (!token) {
      toast.error("Authentication required. Please login.");
      return rejectWithValue({
        message: "Authentication required. Please login.",
      });
    }

    try {
      const response = await api.get<ContractsSyncResponse>(
        `${BASE_URL}/api/erp-contracts-sync/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          }
        }
      );
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.status === 401) {
        Cookies.remove('token');
        toast.error("Session expired. Please login again.");
      }

      if (axiosError.response) {
        const errorMessage = axiosError.response.data.message || 
          (axiosError.response.data.errors 
            ? Object.values(axiosError.response.data.errors).flat().join(', ')
            : "Failed to fetch ERP contracts data");
        
        toast.error(errorMessage);
        return rejectWithValue(axiosError.response.data);
      }
      
      const errorMessage = axiosError.request 
        ? "No response from server. Please check your network connection."
        : "An unexpected error occurred. Please try again.";
      
      toast.error(errorMessage);
      return rejectWithValue({
        message: errorMessage,
      });
    }
  }
);