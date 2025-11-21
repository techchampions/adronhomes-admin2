// wallet_types.ts
export interface ErrorResponse {
  message: string;
  code?: number;
}

// User interface
export interface User {
  id: number;
  email: string;
  phone_number: string;
  referral_code: string;
  name: string | null;
  first_name: string;
  last_name: string;
  role: number;
  country: string | null;
  state: string | null;
  lga: string | null;
  otp_verified_at: string;
  email_verified_at: string;
  profile_picture: string | null;
  gender: string | null;
  notification_enabled: number;
  device_id: string;
  address: string | null;
  created_at: string;
  updated_at: string;
  personnel: string;
  contract_id: string | null;
  unique_customer_id: string | null;
  virtual_account: {
    id: number;
    account_name: string;
    account_number: string;
    account_bank: string;
    account_balance: number;
    user_id: number;
    is_deactivated: number;
    created_at: string;
    updated_at: string;
    is_generated: number;
  };
}

// Transaction interface
export interface Transaction {
  id: number;
  property_id: number | null;
  user_id: number;
  plan_id: number | null;
  amount: number;
  transaction_type: "credit" | "debit";
  created_at: string;
  updated_at: string;
  status: number;
  description: string;
  marketer_id: number | null;
  transaction_method: string;
  is_payment: number;
  reference: string;
  user: User;
}

// Pagination interfaces
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface TransactionList {
  current_page: number;
  data: Transaction[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Main response interfaces
export interface TransactionsData {
  total_wallet_amount: string;
  total_creditted: string;
  total_debitted: string;
  list: TransactionList;
}

export interface WalletData {
  transactions: TransactionsData;
}

export interface WalletSuccessResponse {
  success: true;
  data: WalletData;
}

export interface WalletErrorResponse {
  success: false;
  message: string;
  code?: number;
}

export type WalletResponse = WalletSuccessResponse | WalletErrorResponse;