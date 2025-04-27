import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiFolder, 
  FiMessageSquare, 
  FiClock, 
  FiSettings, 
  FiHelpCircle,
  FiChevronRight,
  FiChevronLeft
} from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: FiHome },
    { path: '/clients', name: 'Clients', icon: FiUsers },
    { path: '/projects', name: 'Projects', icon: FiFolder },
    { path: '/interactions', name: 'Interactions', icon: FiMessageSquare },
    { path: '/reminders', name: 'Reminders', icon: FiClock },
    { path: '/settings', name: 'Settings', icon: FiSettings },
    { path: '/help', name: 'Help', icon: FiHelpCircle },
  ];

  return (
    <aside 
      className={`bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      } h-screen fixed z-10 md:relative`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
        <h1 className={`text-xl font-bold text-blue-600 dark:text-blue-400 ${!isOpen && 'hidden'}`}>
          Mini-CRM
        </h1>
        {!isOpen && <span className="text-blue-600 dark:text-blue-400 text-2xl font-bold">M</span>}
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-2">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center p-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  } ${!isOpen && 'justify-center'}`
                }
              >
                <item.icon className={`h-5 w-5 ${isOpen && 'mr-3'}`} />
                {isOpen && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse button at bottom */}
      <div className="absolute bottom-4 w-full flex justify-center">
        <button 
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
