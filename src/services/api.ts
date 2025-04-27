/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies/authentication
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');

      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// Auth services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Client services
export const clientService = {
  getAll: async () => {
    const response = await api.get('/clients');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  create: async (clientData: any) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },

  update: async (id: string, clientData: any) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },
};

// Project services
export const projectService = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (projectData: any) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },

  update: async (id: string, projectData: any) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

// Interaction services
export const interactionService = {
  getAll: async () => {
    const response = await api.get('/interactions');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/interactions/${id}`);
    return response.data;
  },

  create: async (interactionData: any) => {
    const response = await api.post('/interactions', interactionData);
    return response.data;
  },

  update: async (id: string, interactionData: any) => {
    const response = await api.put(`/interactions/${id}`, interactionData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/interactions/${id}`);
    return response.data;
  },
};

// Reminder services
export const reminderService = {
  getAll: async () => {
    const response = await api.get('/reminders');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/reminders/${id}`);
    return response.data;
  },

  create: async (reminderData: any) => {
    const response = await api.post('/reminders', reminderData);
    return response.data;
  },

  update: async (id: string, reminderData: any) => {
    const response = await api.put(`/reminders/${id}`, reminderData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/reminders/${id}`);
    return response.data;
  },
};

// Dashboard service
export const dashboardService = {
  getData: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },
};

export default api;
