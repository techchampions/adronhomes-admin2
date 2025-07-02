export interface UsersAndPropertiesResponse {
  status: boolean;
  data: { users: User[]; properties: Property[] };
}
export interface User {
  id: number;
  first_name: string;
  last_name: string;
}
export interface Property {
  id: number;
  name: string;
  total_amount: number;
}
