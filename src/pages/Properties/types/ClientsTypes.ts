/** A single property-request record */

import { PaginatedData } from "./PropertyRequestTypes";

/** Full API response for the properties-requests endpoint */
export interface PartnershipRequestResponse {
  success: boolean;
  data: PaginatedData<PartnershipRequest>;
}
export interface PartnershipRequestByIDResponse {
  success: boolean;
  data: PartnershipRequest;
}

/** A single request made on a property */
export interface PartnershipRequest {
  id: number;
  fullname: string;
  phone_number: string;
  location: string;
  email: string; // note the API includes a trailing \r\n – trim in code if needed
  message: string;
  created_at: string; // ISO 8601
  updated_at: string;
  is_read: number; // 0 =pending, 1 =approved… (adjust to an enum when you know the mapping)
}
