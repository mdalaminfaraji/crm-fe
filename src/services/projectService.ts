import apiClient from "./apiClient";

export enum ProjectStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  ON_HOLD = "ON_HOLD",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
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

export interface ProjectsResponse {
  projects: Project[];
}

const projectService = {
  getAll: async (): Promise<ProjectsResponse> => {
    const response = await apiClient.get("/api/projects");
    return response.data;
  },

  getById: async (id: string): Promise<ProjectResponse> => {
    const response = await apiClient.get(`/api/projects/${id}`);
    return response.data;
  },

  create: async (projectData: ProjectRequest): Promise<ProjectResponse> => {
    const response = await apiClient.post("/api/projects", projectData);
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
