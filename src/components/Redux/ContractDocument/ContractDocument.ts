// services/contract.service.ts
import api from "../middleware";
import Cookies from "js-cookie";

export const API_ENDPOINTS = {
  CONTRACT: {
    ATTACH_DOCUMENTS: "/admin/attach-contract-documents",
    GET_CONTRACT_DOCUMENTS: (planId: number) => `/admin/contract-documents/${planId}`,
    GET_CONTRACT_DOCUMENT: (documentId: number) => `/admin/contract-document/${documentId}`,
    DOWNLOAD_CONTRACT_FORM: (documentId: number) => `/admin/download-contract-form/${documentId}`,
  },
} as const;

export interface ContractDocument {
  id?: number;
  document_name: string;
  document_file?: File | string;
  plan_id?: number;
  download_link?: string;
  is_generated?: boolean;
  is_approved?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ContractSaleDocument {
  id: number;
  plan_id: number;
  document_name: string;
  download_link: string;
  is_generated: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface AllocationDocument {
  id: number;
  plan_id: number;
  document_name: string;
  download_link: string;
  is_generated: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContractDocumentsResponse {
  success: boolean;
  contract_documents?: {
    data: any[];
    current_page: number;
    total: number;
  };
  contract_of_sale?: ContractSaleDocument;
  allocation_document?: AllocationDocument;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  contract_of_sale?: ContractSaleDocument;
  allocation?: AllocationDocument;
  contract_documents?: any;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://adron.microf10.sg-host.com";

class ContractService {
  async generateContractDocuments(
    doc_type: "contract_sale" | "general_contract" | "allocation",
    plan_id: number
  ): Promise<ApiResponse> {
    const token = Cookies.get("token");
    
    const formData = new FormData();
    formData.append("doc_type", doc_type);
    formData.append("action", "generate");
    formData.append("plan_id", plan_id.toString());
    
    const response = await api.post(
      `${BASE_URL}/api/admin/attach-contract-documents`,
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
    return response.data;
  }

  async uploadSingleDocument(
    doc_type: "contract_sale" | "general_contract" | "allocation",
    document_file: File,
    plan_id: number
  ): Promise<ApiResponse> {
    const token = Cookies.get("token");
    
    const formData = new FormData();
    formData.append("doc_type", doc_type);
    formData.append("action", "upload");
    formData.append("document_file", document_file);
    formData.append("plan_id", plan_id.toString());
    
    const response = await api.post(
      `${BASE_URL}/api/admin/attach-contract-documents`,
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
    return response.data;
  }

  async uploadMultipleDocuments(
    documents: ContractDocument[],
    doc_type: "contract_sale" | "general_contract" | "allocation",
    plan_id: number
  ): Promise<ApiResponse> {
    const token = Cookies.get("token");
    
    const formData = new FormData();
    
    documents.forEach((doc, index) => {
      if (doc.id) {
        formData.append(`documents[${index}][id]`, doc.id.toString());
      }
      if (doc.document_name) {
        formData.append(`documents[${index}][document_name]`, doc.document_name);
      }
      if (doc.document_file && doc.document_file instanceof File) {
        formData.append(`documents[${index}][document_file]`, doc.document_file);
      }
    });
    
    formData.append("plan_id", plan_id.toString());
    formData.append("doc_type", doc_type);
    formData.append("action", "upload");
    
    const response = await api.post(
      `${BASE_URL}/api/admin/attach-contract-documents`,
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
    return response.data;
  }

  async approveDocument(
    doc_type: "contract_sale" | "general_contract" | "allocation",
    document_id: string,
    plan_id: number
  ): Promise<ApiResponse> {
    const token = Cookies.get("token");
    
    const formData = new FormData();
    formData.append("doc_type", doc_type);
    formData.append("action", "approve");
    formData.append("document_id", document_id);
    formData.append("plan_id", plan_id.toString());
    
    const response = await api.post(
      `${BASE_URL}/api/admin/attach-contract-documents`,
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
    return response.data;
  }

  async rejectDocument(
    doc_type: "contract_sale" | "general_contract" | "allocation",
    document_id: string,
    plan_id: number
  ): Promise<ApiResponse> {
    const token = Cookies.get("token");
    
    const formData = new FormData();
    formData.append("doc_type", doc_type);
    formData.append("action", "reject");
    formData.append("document_id", document_id);
    formData.append("plan_id", plan_id.toString());
    
    const response = await api.post(
      `${BASE_URL}/api/admin/attach-contract-documents`,
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
    return response.data;
  }

  async getContractDocuments(planId: number): Promise<ContractDocumentsResponse> {
    const token = Cookies.get("token");
    
    const response = await api.get(
      `${BASE_URL}/api/admin/contract-documents/${planId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
          device_id: "1010l0010l1",
        },
      }
    );
    return response.data;
  }

  async getContractDocument(documentId: number): Promise<ApiResponse> {
    const token = Cookies.get("token");
    
    const response = await api.get(
      `${BASE_URL}/api/admin/contract-document/${documentId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
          device_id: "1010l0010l1",
        },
      }
    );
    return response.data;
  }

  async downloadContractDocument(documentId: number): Promise<Blob> {
    const token = Cookies.get("token");
    
    const response = await api.get(
      `${BASE_URL}/api/admin/download-contract-form/${documentId}`,
      {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
          identifier: "dMNOcdMNOPefFGHIlefFGHIJKLmno",
          device_id: "1010l0010l1",
        },
      }
    );
    return response.data;
  }
}

export const contractService = new ContractService();