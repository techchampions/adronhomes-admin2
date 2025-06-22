export interface AccountDetail {
  id: number;
  account_name: string;
  bank_name: string;
  account_number: string;
  updated_at: string;
  created_at: string;
  type: string;
}
export interface AccountDetailsResponse {
  status: boolean;
  data: AccountDetail[];
}
export interface CreateAccountPayload {
  account_name?: string;
  bank_name?: string;
  account_number?: string;
  id?: number;
  type: string;
}
