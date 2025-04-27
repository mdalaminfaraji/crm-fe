import apiClient from './apiClient';
import { ProjectStatus } from './projectService';

// Enhanced interfaces for dashboard data with additional fields needed for display
export interface DashboardReminder {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  clientId?: string;
  clientName?: string;
  projectId?: string;
  projectTitle?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardInteraction {
  id: string;
  type: string;
  description: string;
  date: string;
  clientId?: string;
  clientName?: string;
  projectId?: string;
  projectTitle?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardProject {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  clientId?: string;
  clientName?: string;
  deadline?: string;
  budget?: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  totalClients: number;
  totalProjects: number;
  projectsByStatus: Record<ProjectStatus, number>;
  upcomingReminders: DashboardReminder[];
  recentInteractions: DashboardInteraction[];
  upcomingDeadlines: DashboardProject[];
  activeProjects: DashboardProject[];
}

export interface DashboardResponse {
  message: string;
  dashboardData: DashboardData;
}

const dashboardService = {
  getData: async (): Promise<DashboardResponse> => {
    const response = await apiClient.get('/api/dashboard');
    return response.data;
  },
};

export default dashboardService;
