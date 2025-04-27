import apiClient from "./apiClient";

export enum InteractionType {
  CALL = "CALL",
  EMAIL = "EMAIL",
  MEETING = "MEETING",
  OTHER = "OTHER"
}

export interface Interaction {
  id: string;
  date: string;
  type: InteractionType;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  clientId?: string;
  projectId?: string;
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
  interactions: Interaction[];
}

const interactionService = {
  getAll: async (): Promise<InteractionsResponse> => {
    const response = await apiClient.get("/api/interactions");
    return response.data;
  },

  getById: async (id: string): Promise<InteractionResponse> => {
    const response = await apiClient.get(`/api/interactions/${id}`);
    return response.data;
  },

  create: async (interactionData: InteractionRequest): Promise<InteractionResponse> => {
    const response = await apiClient.post("/api/interactions", interactionData);
    return response.data;
  },

  update: async (id: string, interactionData: Partial<InteractionRequest>): Promise<InteractionResponse> => {
    const response = await apiClient.put(`/api/interactions/${id}`, interactionData);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/api/interactions/${id}`);
    return response.data;
  },
};

export default interactionService;
