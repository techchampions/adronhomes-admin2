export interface OfficeLocation {
  id: number;
  office_name: string;
  first_contact: string;
  second_contact: string;
  third_contact: string | null;
  office_address: string;
  email: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface OfficeLocationsResponse {
  status: boolean;
  data: OfficeLocation[];
}
export interface CreateOfficeLocationPayload {
  office_name: string;
  first_contact: string;
  second_contact: string;
  third_contact: string | null;
  office_address: string;
}
export interface EditOfficeLocationPayload {
  id?: number;
  office_name?: string;
  first_contact?: string;
  second_contact?: string;
  third_contact?: string | null;
  office_address?: string;
}
