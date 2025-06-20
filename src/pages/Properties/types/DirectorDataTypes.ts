export interface Director {
  id: number;
  email: string;
  phone_number: string;
  referral_code: string;
  name: string;
  first_name: string;
  last_name: string;
  role: number;
  country: string;
  state: string;
  lga: string;
  otp_verified_at: string;
  email_verified_at: string;
  profile_picture: string;
  gender: string;
  notification_enabled: number;
  device_id: string;
  address: string;
  created_at: string;
  updated_at: string;
  personnel: string;
  contract_id: number;
}

export interface DirectorDashboardResponse {
  success: boolean;
  message: string;
  total_properties: number;
  total_available: number;
  total_sold: number;
  director: Director;
  properties: []; // You can replace `any` with a `Property` type when the structure is known
}
