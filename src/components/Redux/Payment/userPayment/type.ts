// types.ts
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

export interface Payment {
  id: number;
  property_id: number | null;
  user_id: number;
  property_plan_id: number | null;
  order_id: number | null;
  amount_paid: number;
  purpose: string;
  payment_type: string;
  status: number;
  reference: string;
  is_coupon: number;
  created_at: string;
  updated_at: string;
  proof_of_payment: string | null;
  bank_name: string | null;
  description: string;
  marketer_id: number | null;
  director_id: number | null;
  property: Property | null;
  plan: Plan | null;
  marketer: Person | null;
  director: Person | null;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaymentListData {
  current_page: number;
  data: Payment[];
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

export interface PaymentsResponse {
  status: string;
  message: string;
  data: PaymentListData;
}