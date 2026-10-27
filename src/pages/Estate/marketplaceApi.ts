import { AxiosError } from "axios";
import api from "../../components/Redux/middleware";

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export const orderStatuses: OrderStatus[] = [
  "pending",
  "processing",
  "completed",
  "cancelled",
];

export interface MarketEstate {
  id: number;
  estate_name: string;
  property_slug?: string;
}

export interface MarketProduct {
  id: number;
  estate_id: number;
  name: string;
  category: string;
  price: string | number;
  stock: number;
  description: string;
  picture: string | null;
  estate?: MarketEstate | null;
}

export interface MarketOrderUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface MarketOrder {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: string | number;
  total_price: string | number;
  status: OrderStatus;
  created_at: string;
  estate?: { id: number; estate_name: string } | null;
  user?: MarketOrderUser | null;
}

export interface Paginated<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
}

interface ListResponse<T> {
  success: boolean;
  message?: string;
  data: Paginated<T>;
}

interface ItemResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface NewProductInput {
  estateId: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  picture: File;
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

export interface EstateOption {
  id: number;
  name: string;
}

interface EstateListResponse {
  success: boolean;
  data: {
    estates: Paginated<{ id: number; estate_name: string }>;
  };
}

export async function fetchEstateCommunities() {
  try {
    const loadPage = async (page: number) => {
      const response = await api.get<EstateListResponse>("/api/admin/estates", {
        params: { page },
      });
      return response.data.data.estates;
    };

    const first = await loadPage(1);
    const rows = [...(first.data || [])];
    if (first.last_page > 1) {
      const pages = await Promise.all(
        Array.from({ length: first.last_page - 1 }, (_, index) =>
          loadPage(index + 2),
        ),
      );
      pages.forEach((page) => rows.push(...(page.data || [])));
    }

    const seen = new Set<number>();
    return rows
      .filter((estate) => {
        if (!estate?.id || seen.has(estate.id)) return false;
        seen.add(estate.id);
        return true;
      })
      .map((estate) => ({
        id: estate.id,
        name: estate.estate_name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    throw new Error(errorMessage(error, "Could not load estate communities"));
  }
}

export async function fetchMarketplaceProducts(page = 1, perPage = 12) {
  try {
    const response = await api.get<ListResponse<MarketProduct>>(
      "/api/marketplace/products",
      { params: { page, per_page: perPage } },
    );
    return response.data.data;
  } catch (error) {
    throw new Error(errorMessage(error, "Could not load products"));
  }
}

export async function createMarketplaceProduct(input: NewProductInput) {
  const form = new FormData();
  form.append("estate_id", String(input.estateId));
  form.append("name", input.name);
  form.append("category", input.category);
  form.append("price", String(input.price));
  form.append("stock", String(input.stock));
  form.append("description", input.description);
  form.append("picture", input.picture);

  try {
    const response = await api.post<ItemResponse<MarketProduct>>(
      "/api/marketplace/products",
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  } catch (error) {
    throw new Error(errorMessage(error, "Could not add product"));
  }
}

export async function deleteMarketplaceProduct(id: number) {
  try {
    const response = await api.delete<ItemResponse<null>>(
      `/api/admin/marketplace/products/${id}`,
    );
    return response.data;
  } catch (error) {
    throw new Error(errorMessage(error, "Could not delete product"));
  }
}

export async function fetchAdminMarketplaceOrders(params: {
  page?: number;
  perPage?: number;
  status?: OrderStatus;
}) {
  try {
    const response = await api.get<ListResponse<MarketOrder>>(
      "/api/admin/marketplace/orders",
      {
        params: {
          page: params.page ?? 1,
          per_page: params.perPage ?? 12,
          status: params.status,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    throw new Error(errorMessage(error, "Could not load orders"));
  }
}

export async function updateAdminMarketplaceOrder(
  id: number,
  status: OrderStatus,
) {
  try {
    const response = await api.post<ItemResponse<MarketOrder>>(
      `/api/admin/marketplace/orders/${id}`,
      { status },
    );
    return response.data;
  } catch (error) {
    throw new Error(errorMessage(error, "Could not update order"));
  }
}

export async function fetchUserMarketplaceOrders(page = 1, perPage = 12) {
  try {
    const response = await api.get<ListResponse<MarketOrder>>(
      "/api/user/marketplace/orders",
      { params: { page, per_page: perPage } },
    );
    return response.data.data;
  } catch (error) {
    throw new Error(errorMessage(error, "Could not load your orders"));
  }
}

export async function placeUserMarketplaceOrder(
  productId: number,
  quantity: number,
) {
  try {
    const response = await api.post<ItemResponse<MarketOrder>>(
      "/api/user/marketplace/orders",
      { product_id: productId, quantity },
    );
    return response.data;
  } catch (error) {
    throw new Error(errorMessage(error, "Could not place order"));
  }
}
