import { AxiosError } from "axios";
import api from "../../components/Redux/middleware";

export interface EstatePersonnel {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: number;
  created_at: string;
}

export interface EstatePersonnelRecord {
  estate: { id: number; estate_name: string } | null;
  personnel: EstatePersonnel[];
}

function errorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message || fallback;
}

export async function fetchEstatePersonnel(estateId: number) {
  try {
    const response = await api.get<{
      success: boolean;
      data: EstatePersonnelRecord;
    }>(`/api/admin/estates/${estateId}/personnel`);
    return response.data.data;
  } catch (error) {
    throw new Error(errorMessage(error, "Could not load Security Personnels"));
  }
}

export function personnelRoleName(role: number) {
  const names: Record<number, string> = {
    2: "Marketer",
    3: "Director",
    4: "Accountant",
    5: "HR",
    6: "Legal",
    7: "Info Tech",
    8: "Client service",
    9: "Security",
    10: "Director of Estate Community",
  };
  return names[role] || "Security Personnels";
}
