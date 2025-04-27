import apiClient from "./apiClient";

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  clientId?: string;
  projectId?: string;
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
  reminders: Reminder[];
}

const reminderService = {
  getAll: async (): Promise<RemindersResponse> => {
    const response = await apiClient.get("/api/reminders");
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
