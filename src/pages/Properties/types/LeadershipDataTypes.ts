export interface LeadershipItem {
  id: number;
  name: string;
  slug: string;
  position: string;
  picture: string;
  description: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface LeadershipPaginationData {
  current_page: number;
  data: LeadershipItem[];
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

export interface LeadershipResponse {
  success: boolean;
  data: LeadershipPaginationData;
}
export interface CreateLeadershipResponse {
  success: boolean;
  message: string;
  data: LeadershipItem;
}
export interface DeleteLeadershipResponse {
  success: boolean;
  message: string;
}

export interface CreateLeaderPayload {
  name: string;
  position: string;
  picture: File | null;
  description: string;
}
export interface EditLeaderPayload {
  id: number;
  name: string;
  position: string;
  picture: File | null;
  description: string;
}
