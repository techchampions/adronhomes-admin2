export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface Property {
  id: number;
  name: string;
  display_image: string;
  photos: string[];
  size: string;
  price: number;
  type: number;
  no_of_bedroom: number | null;
  slug: string;
  features: string[];
  overview: string;
  description: string;
  street_address: string;
  country: string;
  state: string;
  lga: string;
  created_at: string;
  updated_at: string;
  area: string | null;
  property_map: string | null;
  property_video: string | null;
  virtual_tour: string | null;
  subscriber_form: string | null;
  status: string;
  initial_deposit: number;
  is_sold: number;
  is_active: number;
  property_duration_limit: number | null;
  payment_schedule: string | null;
  category: string;
  is_discount: boolean;
  discount_name: string | null;
  discount_percentage: number | null;
  discount_units: number | null;
  discount_start_date: string | null;
  discount_end_date: string | null;
  parking_space: string | null;
  number_of_bathroom: number | null;
  number_of_unit: number;
  property_agreement: string | null;
  payment_type: string;
  location_type: string;
  purpose: string;
  year_built: string | null;
  shape: string | null;
  topography: string | null;
  title_document_type: string | null;
  road_access: string | null;
  director_id: number;
  unit_available: number;
  unit_sold: number;
  property_view: number;
  property_requests: number;
  total_amount: number;
}

export interface Plan {
  id: number;
  payment_percentage: number;
  repayment_schedule: string | null;
  next_payment_date: string | null;
  total_amount: number;
  paid_amount: number;
  remaining_balance: number;
  status: number;
  monthly_duration: string | null;
}

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
}

export interface Transaction {
  id: number;
  property_id: number | null;
  user_id: number;
  plan_id: number | null;
  amount: number;
  transaction_type: string;
  created_at: string;
  updated_at: string;
  status: number;
  description: string;
  marketer_id: number | null;
  transaction_method: string;
  is_payment: number;
  reference: string;
  property?: Property | null;
  plan?: Plan | null;
  marketer?: Person | null;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface TransactionListData {
  current_page: number;
  data: Transaction[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface TransactionsResponse {
  success: boolean;
  message: string;
  data: TransactionListData;
}