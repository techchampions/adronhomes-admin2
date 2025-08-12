// Base export interface for a single FAQ item
export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  created_at: string | null;
  updated_at: string | null;
}

// Response type for the successful API response
export interface FAQResponse {
  success: true;
  data: FAQItem[];
}

export interface FAQPayload {
  faq_id?: number;
  question?: string;
  answer?: string;
}
// Optional: Error response type
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Combined type that can represent both success and error responses
export type APIResponse<T> = T | ErrorResponse;

// Specific export type for FAQ API responses
export type FAQAPIResponse = APIResponse<FAQResponse>;
