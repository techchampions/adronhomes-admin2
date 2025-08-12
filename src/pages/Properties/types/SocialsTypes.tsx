// Types for the paginated response
interface PaginatedResponse<T> {
  success: boolean;
  data: {
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
  };
}

// Types for the individual setting item
export interface SettingItem {
  id: number;
  name: string;
  type: string;
  numeric: number | null;
  value: string;
  created_at: string | null;
  updated_at: string | null;
}
export interface SocialPayload {
  name?: string;
  type?: string;
  value?: string;
  id?: number;
}

// Type for the specific response in your example
export type SettingsResponse = PaginatedResponse<SettingItem>;
