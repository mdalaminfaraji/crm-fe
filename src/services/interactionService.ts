import apiClient from './apiClient';

// Pagination data interface
export interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export enum InteractionType {
  CALL = 'CALL',
  EMAIL = 'EMAIL',
  MEETING = 'MEETING',
  OTHER = 'OTHER',
}

export interface Interaction {
  id: string;
  date: string;
  type: InteractionType;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  clientId?: string;
  clientName?: string;
  projectId?: string;
  projectTitle?: string;
  userId: string;
}

export interface InteractionRequest {
  date?: string;
  type: InteractionType;
  notes?: string;
  clientId?: string;
  projectId?: string;
}

export interface InteractionResponse {
  message: string;
  interaction: Interaction;
}

export interface InteractionsResponse {
  message: string;
  interactions: Interaction[];
  pagination?: PaginationData;
}

// Search parameters interface
export interface InteractionSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: InteractionType;
  clientId?: string;
  projectId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const interactionService = {
  getAll: async (params?: InteractionSearchParams): Promise<InteractionsResponse> => {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.type) queryParams.append('type', params.type);
      if (params.clientId) queryParams.append('clientId', params.clientId);
      if (params.projectId) queryParams.append('projectId', params.projectId);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    }

    const url = `/api/interactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  getById: async (id: string): Promise<InteractionResponse> => {
    const response = await apiClient.get(`/api/interactions/${id}`);
    return response.data;
  },

  create: async (interactionData: InteractionRequest): Promise<InteractionResponse> => {
    const response = await apiClient.post('/api/interactions', interactionData);
    return response.data;
  },

  update: async (
    id: string,
    interactionData: Partial<InteractionRequest>,
  ): Promise<InteractionResponse> => {
    const response = await apiClient.put(`/api/interactions/${id}`, interactionData);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/api/interactions/${id}`);
    return response.data;
  },
};

export default interactionService;
