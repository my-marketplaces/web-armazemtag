import { useAuth } from "@clerk/tanstack-react-start";
import { apiFetch, ApiError, PaginationMeta } from "./api";

export type RegistrationKind = "INDIVIDUAL" | "BUSINESS";
export type RegistrationStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface RegistrationUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface RegistrationAccess {
  id: string;
  userId: string;
  createdAt: string;
  user: RegistrationUser;
}

export interface RegistrationStore {
  id: string;
  name: string;
  slug: string;
  status: string;
  city: string | null;
  state: string | null;
  role: string;
}

export interface Registration {
  id: string;
  kind: RegistrationKind;
  fullName: string;
  legalName: string | null;
  document: string | null;
  documentMasked: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  addressNumber: string | null;
  addressComplement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  status: RegistrationStatus;
  notes: string | null;
  responsibleId: string | null;
  responsible: {
    id: string;
    fullName: string;
    kind: RegistrationKind;
    status: RegistrationStatus;
  } | null;
  accesses: RegistrationAccess[];
  stores: RegistrationStore[];
  subscriptions: unknown[];
  ads: unknown[];
  canManage: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationsListResponse {
  registrations: Registration[];
  meta: PaginationMeta;
}

export interface ListRegistrationsParams {
  page?: number;
  limit?: number;
  search?: string;
  kind?: RegistrationKind;
  status?: RegistrationStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateRegistrationInput {
  kind: RegistrationKind;
  fullName: string;
  legalName?: string;
  document: string;
  phone?: string;
  email?: string;
  address?: string;
  addressNumber?: string;
  addressComplement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  status?: RegistrationStatus;
  notes?: string;
  responsibleId?: string;
  accessUserIds?: string[];
}

export type UpdateRegistrationInput = Partial<CreateRegistrationInput>;

export interface UpdateRegistrationStatusInput {
  status: RegistrationStatus;
  reason?: string;
}

function buildQuery(params: ListRegistrationsParams): string {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.search) search.set("search", params.search);
  if (params.kind) search.set("kind", params.kind);
  if (params.status) search.set("status", params.status);
  if (params.sortBy) search.set("sortBy", params.sortBy);
  if (params.sortOrder) search.set("sortOrder", params.sortOrder);
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function useRegistrationsApi() {
  const { getToken } = useAuth();

  return {
    list: async (params: ListRegistrationsParams): Promise<RegistrationsListResponse> => {
      const token = await getToken();
      return apiFetch<RegistrationsListResponse>(`/admin/registrations${buildQuery(params)}`, {
        token,
      });
    },
    get: async (id: string): Promise<Registration> => {
      const token = await getToken();
      return apiFetch<Registration>(`/admin/registrations/${id}`, { token });
    },
    create: async (input: CreateRegistrationInput): Promise<Registration> => {
      const token = await getToken();
      return apiFetch<Registration>("/admin/registrations", {
        method: "POST",
        body: JSON.stringify(input),
        token,
      });
    },
    update: async (id: string, input: UpdateRegistrationInput): Promise<Registration> => {
      const token = await getToken();
      return apiFetch<Registration>(`/admin/registrations/${id}`, {
        method: "PATCH",
        body: JSON.stringify(input),
        token,
      });
    },
    updateStatus: async (
      id: string,
      input: UpdateRegistrationStatusInput,
    ): Promise<Registration> => {
      const token = await getToken();
      return apiFetch<Registration>(`/admin/registrations/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify(input),
        token,
      });
    },
  };
}

export { ApiError };
