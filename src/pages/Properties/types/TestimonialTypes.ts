// Interface for each testimonial item
export interface Testimonial {
  id: number;
  client_name: string;
  client_image: string;
  client_comment: string;
  video_link: string;
  created_at: string | null;
  updated_at: string | null;
}

// Interface for pagination links
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Interface for the paginated data
export interface PaginatedTestimonials {
  current_page: number;
  data: Testimonial[];
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

// Main response interface
export interface ApiResponse {
  success: boolean;
  data: PaginatedTestimonials;
}

export interface TestimonialPayload {
  id?: number;
  client_name?: string;
  video_link?: string;
  client_image?: File;
  client_comment?: string;
}
