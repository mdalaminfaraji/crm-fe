import apiClient from "./apiClient";
import { Client } from "./clientService";
import { Interaction } from "./interactionService";
import { Project, ProjectStatus } from "./projectService";
import { Reminder } from "./reminderService";

export interface DashboardData {
  clientsCount: number;
  projectsCount: number;
  projectsByStatus: Record<ProjectStatus, number>;
  upcomingReminders: Reminder[];
  recentInteractions: Interaction[];
  recentClients: Client[];
  activeProjects: Project[];
}

export interface DashboardResponse {
  message: string;
  data: DashboardData;
}

const dashboardService = {
  getData: async (): Promise<DashboardResponse> => {
    const response = await apiClient.get("/api/dashboard");
    return response.data;
  },
};

export default dashboardService;
