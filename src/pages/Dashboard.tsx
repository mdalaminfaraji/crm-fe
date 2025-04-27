import { useState, useEffect } from "react";
import { FiUsers, FiFolder, FiClock, FiMessageSquare } from "react-icons/fi";

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
  // Mock data - in a real app, this would come from an API
  const [stats, setStats] = useState({
    totalClients: 0,
    totalProjects: 0,
    upcomingReminders: 0,
    recentInteractions: 0,
    projectsByStatus: {
      "Not Started": 0,
      "In Progress": 0,
      Completed: 0,
      "On Hold": 0,
    },
  });

  // Simulate fetching dashboard data
  useEffect(() => {
    // This would be an API call in a real application
    setTimeout(() => {
      setStats({
        totalClients: 12,
        totalProjects: 24,
        upcomingReminders: 5,
        recentInteractions: 18,
        projectsByStatus: {
          "Not Started": 6,
          "In Progress": 10,
          Completed: 5,
          "On Hold": 3,
        },
      });
    }, 1000);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Dashboard
      </h1>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon={<FiUsers className="h-6 w-6" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Projects"
          value={stats.totalProjects}
          icon={<FiFolder className="h-6 w-6" />}
          color="bg-green-500"
        />
        <StatCard
          title="Upcoming Reminders"
          value={stats.upcomingReminders}
          icon={<FiClock className="h-6 w-6" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Recent Interactions"
          value={stats.recentInteractions}
          icon={<FiMessageSquare className="h-6 w-6" />}
          color="bg-purple-500"
        />
      </div>

      {/* Project status breakdown */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Projects by Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.projectsByStatus).map(([status, count]) => (
            <div key={status} className="text-center">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity - placeholder */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Your recent activity will appear here.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
