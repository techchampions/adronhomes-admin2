import { AxiosError } from "axios";
import api from "../../components/Redux/middleware";

export type HouseholdKind = "family" | "staff";

export interface HouseholdMember {
  id: number;
  user_id: number;
  estate_id: number;
  kind: HouseholdKind;
  full_name: string;
  role_label: string;
  phone: string;
  email: string | null;
  created_at: string;
}

export interface HouseholdRecord {
  resident: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  estate: { id: number; estate_name: string } | null;
  members: HouseholdMember[];
}

function errorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{
    message?: string;
    errors?: Record<string, string[]>;
  }>;
  const fieldError = axiosError.response?.data?.errors;
  const firstField = fieldError
    ? Object.values(fieldError).find((messages) => messages?.length)?.[0]
    : undefined;
  return firstField || axiosError.response?.data?.message || fallback;
}

export async function fetchResidentHousehold(estateId: number, userId: number) {
  try {
    const response = await api.get<{ success: boolean; data: HouseholdRecord }>(
      `/api/admin/estates/${estateId}/users/${userId}/household`,
    );
    return response.data.data;
  } catch (error) {
    throw new Error(errorMessage(error, "Could not load this resident household"));
  }
}
