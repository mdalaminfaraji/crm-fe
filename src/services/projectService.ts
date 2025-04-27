import apiClient from './apiClient';

export enum ProjectStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  budget?: number;
  deadline?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  userId: string;
}

export interface ProjectRequest {
  title: string;
  description?: string;
  budget?: number;
  deadline?: string;
  status?: ProjectStatus;
  clientId: string;
}

export interface ProjectResponse {
  message: string;
  project: Project;
}

export interface PaginationData {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProjectsResponse {
  message: string;
  projects: Project[];
  pagination?: PaginationData;
}

export interface ProjectSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProjectStatus;
  clientId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const projectService = {
  getAll: async (params?: ProjectSearchParams): Promise<ProjectsResponse> => {
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.clientId) queryParams.append('clientId', params.clientId);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    }

    const url = `/api/projects${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  getById: async (id: string): Promise<ProjectResponse> => {
    const response = await apiClient.get(`/api/projects/${id}`);
    return response.data;
  },

  create: async (projectData: ProjectRequest): Promise<ProjectResponse> => {
    const response = await apiClient.post('/api/projects', projectData);
    return response.data;
  },

  update: async (id: string, projectData: Partial<ProjectRequest>): Promise<ProjectResponse> => {
    const response = await apiClient.put(`/api/projects/${id}`, projectData);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/api/projects/${id}`);
    return response.data;
  },
};

export default projectService;
