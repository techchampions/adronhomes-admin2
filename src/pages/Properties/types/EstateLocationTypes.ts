// Reusable Pagination type (can be placed in a shared types file) export
export interface Pagination<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Property Location type
export interface PropertyLocation {
  id: number;
  country_name: string;
  total_property: number;
  state_name: string;
  photo: string;
  created_at: string | null;
  updated_at: string | null;
}

// Main Response type
export interface PropertyLocationsResponse {
  success: boolean;
  message: string;
  data: Pagination<PropertyLocation>;
}
