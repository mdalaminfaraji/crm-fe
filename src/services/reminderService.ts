import apiClient from "./apiClient";

// Pagination data interface
export interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  clientId?: string;
  clientName?: string;
  projectId?: string;
  projectTitle?: string;
  userId: string;
}

export interface ReminderRequest {
  title: string;
  description?: string;
  dueDate: string;
  completed?: boolean;
  clientId?: string;
  projectId?: string;
}

export interface ReminderResponse {
  message: string;
  reminder: Reminder;
}

export interface RemindersResponse {
  message: string;
  reminders: Reminder[];
  pagination?: PaginationData;
}

// Search parameters interface
export interface ReminderSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  dueThisWeek?: boolean;
  completed?: boolean;
  clientId?: string;
  projectId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const reminderService = {
  getAll: async (params?: ReminderSearchParams): Promise<RemindersResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.dueThisWeek) queryParams.append('dueThisWeek', params.dueThisWeek.toString());
      if (params.completed !== undefined) queryParams.append('completed', params.completed.toString());
      if (params.clientId) queryParams.append('clientId', params.clientId);
      if (params.projectId) queryParams.append('projectId', params.projectId);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    }
    
    const url = `/api/reminders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  getById: async (id: string): Promise<ReminderResponse> => {
    const response = await apiClient.get(`/api/reminders/${id}`);
    return response.data;
  },

  create: async (reminderData: ReminderRequest): Promise<ReminderResponse> => {
    const response = await apiClient.post("/api/reminders", reminderData);
    return response.data;
  },

  update: async (id: string, reminderData: Partial<ReminderRequest>): Promise<ReminderResponse> => {
    const response = await apiClient.put(`/api/reminders/${id}`, reminderData);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/api/reminders/${id}`);
    return response.data;
  },
};

export default reminderService;
