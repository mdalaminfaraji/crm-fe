import apiClient from "./apiClient";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  notes?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface ClientRequest {
  name: string;
  email: string;
  phone: string;
  company?: string;
  notes?: string;
  status?: string;
}

export interface ClientResponse {
  message: string;
  client: Client;
}

export interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ClientsResponse {
  clients: Client[];
  pagination: PaginationData;
  message: string;
}

export interface ClientSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const clientService = {
  getAll: async (params?: ClientSearchParams): Promise<ClientsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    }
    
    const url = `/api/clients${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  getById: async (id: string): Promise<ClientResponse> => {
    const response = await apiClient.get(`/api/clients/${id}`);
    return response.data;
  },

  create: async (clientData: ClientRequest): Promise<ClientResponse> => {
    const response = await apiClient.post("/api/clients", clientData);
    return response.data;
  },

  update: async (
    id: string,
    clientData: Partial<ClientRequest>
  ): Promise<ClientResponse> => {
    const response = await apiClient.put(`/api/clients/${id}`, clientData);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/api/clients/${id}`);
    return response.data;
  },
};

export default clientService;
