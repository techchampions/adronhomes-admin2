import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import api from "../middleware";

// Types
export interface ContractDocument {
  id: number;
  plan_id: number;
  document_name: string;
  document_file: string;
  created_at: string;
  updated_at: string;
}

export interface ContractDocumentsResponse {
  success: boolean;
  contract_documents: {
    current_page: number;
    data: ContractDocument[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface ContractDocumentsState {
  data: ContractDocument[];
  loading: boolean;
  error: { message: string } | null;
  pagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

interface FetchContractDocumentsParams {
  planId: number;
  page?: number;
}

export const fetchContractDocuments = createAsyncThunk<
  ContractDocumentsResponse,
  FetchContractDocumentsParams,
  { rejectValue: { message: string } }
>(
  "contractDocuments/fetch",
  async ({ planId, page = 1 }, { rejectWithValue }) => {
    const token = Cookies.get("token");

    if (!token) {
      return rejectWithValue({ message: "No authentication token found" });
    }

    try {
      const response = await api.get<ContractDocumentsResponse>(
        `https://adron.microf10.sg-host.com/api/admin/contract-documents/${planId}`,
        {
          params: { page },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
            device_id: "1010l0010l1",
          },
        }
      );
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      if (axiosError.response?.status === 401) {
        Cookies.remove("token");
        toast.error("Session expired. Please login again.");
      }
      return rejectWithValue(
        axiosError.response?.data || { message: "Failed to fetch documents" }
      );
    }
  }
);