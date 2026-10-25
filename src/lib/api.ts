import { API_BASE_URL } from "./config";

export class ApiError extends Error {
  status: number;
  body: any;

  constructor(status: number, message: string, body?: any) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  [key: string]: unknown;
  meta: PaginationMeta;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    let body: any = null;
    try {
      body = await response.json();
    } catch {
      // ignore
    }

    if (response.status === 401) {
      throw new ApiError(401, "Não autenticado. Faça login.", body);
    }
    if (response.status === 403) {
      throw new ApiError(403, "Acesso negado. Você não tem permissão para esta operação.", body);
    }
    if (response.status === 404) {
      throw new ApiError(404, "Recurso não encontrado.", body);
    }

    const message = body?.message || `Erro na API (${response.status})`;
    throw new ApiError(response.status, message, body);
  }

  return response.json() as Promise<T>;
}
