export interface PropertyType {
  id: number;
  name: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Property {
  id: number;
  name: string;
  display_image: string;
  photos: string[];
  size: string;
  price: number;
  type: PropertyType;
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
  is_sold: 0 | 1;
  is_active: 0 | 1;
  property_duration_limit: number;
  payment_schedule: string[];
  category: string;
  is_discount: boolean;
  discount_name: string | null;
  discount_percentage: number | null;
  discount_units: number | null;
  discount_start_date: string | null;
  discount_end_date: string | null;
  parking_space: number | null;
  number_of_bathroom: number | null;
  number_of_unit: number;
  property_agreement: string;
  payment_type: string;
  location_type: string;
  purpose: string[] | null;
  year_built: string | null;
  shape: string | null;
  topography: string | null;
  title_document_type: string | null;
  road_access: string | null;
  director_id: number | null;
  unit_available: number;
  unit_sold: number;
  property_view: number;
  property_requests: number;
  video_link: string | null;
  video_file: string | null;
  nearby_landmarks: string | null;
  gated_estate: string | null;
  fencing: string | null;
  contact_number: string | null;
  whatsapp_link: string | null;
  rent_duration: string | null;
  toilets: number | null;
  building_condition: string | null;
  fees_charges: string | null;
  is_featured: 0 | 1;
  total_amount: number;
  details: PropertyDetail[]; 
}

export interface PropertyDetail {
  id: number;
  name: string;
  value: number;
  property_id: number;
  created_at: string;
  updated_at: string;
  type: string;
  purpose: string;
}


export interface SavedUser {
  id: number;
  email: string;
  phone_number: string;
  referral_code: string;
  name: string | null;
  first_name: string;
  last_name: string;
  role: number;
  country: string;
  state: string;
  lga: string;
  otp_verified_at: string;
  email_verified_at: string;
  profile_picture: string;
  gender: string | null;
  notification_enabled: 0 | 1;
  device_id: string;
  address: string;
  created_at: string;
  updated_at: string;
  personnel: string;
  contract_id: string | null;
  unique_customer_id: string | null;
}

export interface SavedPropertyUser {
  id: number;
  property_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  saved_user: SavedUser;
}


export interface SimilarPropertyUser extends Property {}

export interface PropertyData {
  properties: Property[];
  saved_property_user: SavedPropertyUser[];
  similar_property_user: SimilarPropertyUser[];
}

export interface PropertyDataResponse {
  status: string;
  message: string;
  data: PropertyData;
}