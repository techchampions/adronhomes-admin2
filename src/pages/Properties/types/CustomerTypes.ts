/* ---------- generic helpers (reuse across your codebase) ---------- */

/** Laravel‑style pagination link. */
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

/** Generic paginated wrapper. */
export interface Paginated<T> {
  current_page: number;
  data: T[];
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

/** Generic API envelope. */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/* ---------- customer‑specific types ---------- */

/** One customer record.  */
export interface Customer {
  id: number;
  email: string;
  phone_number: string;
  referral_code: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  role: number; // 0 = customer, 1 = admin, etc.
  country: string | null;
  state: string | null;
  lga: string | null;
  otp_verified_at: string | null; // MySQL datetime string
  email_verified_at: string | null; // ISO‑8601 or MySQL datetime string
  profile_picture: string | null;
  gender: string | null;
  notification_enabled: number; // 0 | 1
  device_id: string;
  address: string | null;
  created_at: string;
  updated_at: string;
  personnel: string; // "customer", "marketer", …
  contract_id: string;
  property_plan_total: number;
  saved_property_total: number;
  marketer: string | null;
}

/** Metrics that sit beside the paginated list. */
export interface CustomersMetrics {
  total: number;
  active_plan: number;
  active_customer: number;
}

/** The complete customers block inside `data`. */
export interface CustomersPayload extends CustomersMetrics {
  list: Paginated<Customer>;
}

/* ---------- final shape for this endpoint ---------- */

export type CustomersResponse = ApiResponse<{
  customers: CustomersPayload;
}>;
