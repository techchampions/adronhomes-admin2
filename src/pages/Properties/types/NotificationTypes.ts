/**
 * A single notification record.
 */
export interface Notification {
  id: number;
  title: string;
  content: string;
  is_read: number; // 0 = unread, 1 = read
  created_at: string | null;
  updated_at: string | null;
  property_id: number;
  user_id: number;
  plan_id: number;
}

/**
 * Standard pagination link structure from Laravel‑style APIs.
 */
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

/**
 * Generic paginated payload wrapper.
 */
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

/**
 * Root API response envelope.
 * You can reuse this for any endpoint by
 * substituting the generic parameter.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/**
 * Concrete type for the notifications endpoint.
 */
export type NotificationsResponse = ApiResponse<Paginated<Notification>>;
