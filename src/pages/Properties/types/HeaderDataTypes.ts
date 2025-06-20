export interface HeaderItem {
  id: number;
  slug: string;
  header: string;
  name: string;
  description: string | null;
  image: string;
  action_link: string;
  list_description: string[] | null;
  created_at: string | null;
  updated_at: string | null;
  price_tag: string | null;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface HeadersData {
  current_page: number;
  data: HeaderItem[];
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

export interface HeadersResponse {
  success: boolean;
  data: HeadersData;
}

export interface UpdateHeaderPayload {
  id?: number;
  header?: string;
  name?: string;
  description?: string;
  image?: File;
  list_description?: string[];
}

export interface UpdateHeaderResponse {
  success: boolean;
  data: HeaderItem;
}
