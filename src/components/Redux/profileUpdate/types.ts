// types.ts
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  lga: string;
  dateOfBirth: string;
  profile_picture: string;
  phone_number?: string;
  address?: string;
  notification_enabled?: number;
  // ... other user fields
}

export interface UpdateProfileResponse {
  message: string;
  user: User;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  date_of_birth?: string;
  country?: string;
  state?: string;
  lga?: string;
  address?: string;
  profile_picture?: File | string;
  notification_enabled?: number;
}