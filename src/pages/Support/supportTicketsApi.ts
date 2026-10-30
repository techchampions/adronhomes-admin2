import { AxiosError } from "axios";
import api from "../../components/Redux/middleware";

export type TicketStatus = "open" | "closed";

export interface TicketUser {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
}

export interface TicketMessage {
  id: number;
  body: string;
  author_role: "customer" | "support";
  created_at: string;
  author?: TicketUser | null;
}

export interface SupportTicket {
  id: number;
  subject: string;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
  user?: TicketUser | null;
  messages?: TicketMessage[];
  latest_message?: TicketMessage | null;
}

function errorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message || fallback;
}

export async function fetchSupportTickets() {
  try {
    const response = await api.get<{ success: boolean; data: SupportTicket[] }>(
      "/api/admin/support-tickets",
    );
    return response.data.data;
  } catch (error) {
    throw new Error(errorMessage(error, "Could not load support tickets"));
  }
}

export async function fetchSupportTicket(id: number) {
  try {
    const response = await api.get<{ success: boolean; data: SupportTicket }>(
      `/api/admin/support-tickets/${id}`,
    );
    return response.data.data;
  } catch (error) {
    throw new Error(errorMessage(error, "Could not load this ticket"));
  }
}

export async function replyToSupportTicket(id: number, message: string) {
  try {
    const response = await api.post<{ success: boolean; data: SupportTicket }>(
      `/api/admin/support-tickets/${id}/replies`,
      { message },
    );
    return response.data.data;
  } catch (error) {
    throw new Error(errorMessage(error, "Could not send the reply"));
  }
}

export async function setSupportTicketStatus(id: number, status: TicketStatus) {
  try {
    const response = await api.post<{ success: boolean; data: SupportTicket }>(
      `/api/admin/support-tickets/${id}/status`,
      { status },
    );
    return response.data.data;
  } catch (error) {
    throw new Error(errorMessage(error, "Could not update the ticket"));
  }
}
