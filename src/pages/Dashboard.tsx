import { useState, useEffect } from "react";
import {
  FiUsers,
  FiFolder,
  FiClock,
  FiMessageSquare,
  FiCalendar,
} from "react-icons/fi";
import dashboardService, { DashboardData } from "../services/dashboardService";

import { Link } from "react-router-dom";
import { ProjectStatus } from "../services/projectService";
import { formatDate } from "../utils/formatters";

// Dashboard statistics card component
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <div className="card flex items-center">
    <div className={`p-3 rounded-full ${color} text-white mr-4`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  </div>
);

// Main Dashboard component
const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  // Fetch dashboard data from the API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await dashboardService.getData();
        setDashboardData(response.dashboardData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to format status for display
  const formatStatus = (status: string): string => {
    switch (status) {
      case ProjectStatus.NOT_STARTED:
        return "Not Started";
      case ProjectStatus.IN_PROGRESS:
        return "In Progress";
      case ProjectStatus.ON_HOLD:
        return "On Hold";
      case ProjectStatus.COMPLETED:
        return "Completed";
      case ProjectStatus.CANCELLED:
        return "Cancelled";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Dashboard
      </h1>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Clients"
          value={dashboardData.totalClients}
          icon={<FiUsers className="h-6 w-6" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Projects"
          value={dashboardData.totalProjects}
          icon={<FiFolder className="h-6 w-6" />}
          color="bg-green-500"
        />
        <StatCard
          title="Upcoming Reminders"
          value={dashboardData.upcomingReminders?.length || 0}
          icon={<FiClock className="h-6 w-6" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Recent Interactions"
          value={dashboardData.recentInteractions?.length || 0}
          icon={<FiMessageSquare className="h-6 w-6" />}
          color="bg-purple-500"
        />
      </div>

      {/* Project status breakdown */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Projects by Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(dashboardData.projectsByStatus || {}).map(
            ([status, count]) => (
              <div
                key={status}
                className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatStatus(status)}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Reminders */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FiClock className="mr-2 text-yellow-500" /> Upcoming Reminders
          </h2>
          {dashboardData.upcomingReminders &&
          dashboardData.upcomingReminders.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="font-medium">{reminder.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                    <FiCalendar className="mr-1" /> Due:{" "}
                    {formatDate(reminder.dueDate)}
                  </div>
                  {reminder.clientId && (
                    <div className="text-sm text-blue-500 mt-1">
                      <Link to={`/clients/${reminder.clientId}`}>
                        Client: {reminder.clientName || "Client"}
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No upcoming reminders
            </p>
          )}
        </div>

        {/* Recent Interactions */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FiMessageSquare className="mr-2 text-purple-500" /> Recent
            Interactions
          </h2>
          {dashboardData.recentInteractions &&
          dashboardData.recentInteractions.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentInteractions.map((interaction) => (
                <div
                  key={interaction.id}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="font-medium">
                    {interaction.type}: {interaction.description}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                    <FiCalendar className="mr-1" />{" "}
                    {formatDate(interaction.date)}
                  </div>
                  {interaction.clientId && (
                    <div className="text-sm text-blue-500 mt-1">
                      <Link to={`/clients/${interaction.clientId}`}>
                        Client: {interaction.clientName || "Client"}
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No recent interactions
            </p>
          )}
        </div>
      </div>

      {/* Active Projects */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <FiFolder className="mr-2 text-green-500" /> Active Projects
        </h2>
        {dashboardData.upcomingDeadlines &&
        dashboardData.upcomingDeadlines.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Deadline
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {dashboardData.upcomingDeadlines.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/projects/${project.id}`}
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {project.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {project.clientName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {formatStatus(project.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {project.deadline
                        ? formatDate(project.deadline)
                        : "No deadline"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No active projects</p>
        )}
      </div>
    </div>
  );
};

// Helper function to get status color
const getStatusColor = (status: string): string => {
  switch (status) {
    case ProjectStatus.NOT_STARTED:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    case ProjectStatus.IN_PROGRESS:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case ProjectStatus.ON_HOLD:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case ProjectStatus.COMPLETED:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case ProjectStatus.CANCELLED:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

export default Dashboard;
