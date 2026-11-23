import { AxiosError } from "axios";
import api from "../../components/Redux/middleware";

export interface AdminActionLog {
  id: number;
  actor_id: number | null;
  actor_role: number | null;
  actor_name: string | null;
  actor_email: string | null;
  actor_personnel: string | null;
  module: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  description: string;
  payload: Record<string, unknown> | null;
  method: string | null;
  endpoint: string | null;
  status_code: number | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminLogsFilters {
  module?: string;
  action?: string;
  actor_id?: string;
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  per_page?: number;
}

export interface AdminLogsPaged {
  data: AdminActionLog[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

function errorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message || fallback;
}

export async function fetchAdminActionLogs(filters: AdminLogsFilters = {}) {
  try {
    const response = await api.get<{
      success: boolean;
      data: AdminLogsPaged;
      filters?: { modules?: string[] };
    }>("/api/admin/action-logs", { params: filters });

    return {
      page: response.data.data,
      modules: response.data.filters?.modules || [],
    };
  } catch (error) {
    throw new Error(errorMessage(error, "Could not load admin action logs"));
  }
}

export async function fetchAdminActionLog(id: number) {
  try {
    const response = await api.get<{ success: boolean; data: AdminActionLog }>(
      `/api/admin/action-logs/${id}`,
    );
    return response.data.data;
  } catch (error) {
    throw new Error(errorMessage(error, "Could not load this action log"));
  }
}
