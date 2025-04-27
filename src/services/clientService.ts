import apiClient from "./apiClient";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  notes?: string;
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
}

export interface ClientResponse {
  message: string;
  client: Client;
}

export interface ClientsResponse {
  clients: Client[];
}

const clientService = {
  getAll: async (): Promise<ClientsResponse> => {
    const response = await apiClient.get("/api/clients");
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

  update: async (id: string, clientData: Partial<ClientRequest>): Promise<ClientResponse> => {
    const response = await apiClient.put(`/api/clients/${id}`, clientData);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/api/clients/${id}`);
    return response.data;
  },
};

export default clientService;
