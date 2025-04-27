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
  FiChevronLeft,
  FiX
} from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const Sidebar = ({ isOpen, toggleSidebar, isMobile }: SidebarProps) => {
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
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      
      <aside 
        className={`bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out 
          ${isOpen ? (isMobile ? 'w-64 translate-x-0' : 'w-64') : (isMobile ? '-translate-x-full' : 'w-20')}
          h-screen overflow-y-auto ${isMobile ? 'fixed z-50 top-0 left-0' : 'sticky top-0'}`}
      >
      {/* Logo and close button for mobile */}
      <div className="flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-700 px-4">
        <div className="flex items-center">
          <h1 className={`text-xl font-bold text-blue-600 dark:text-blue-400 ${!isOpen && !isMobile && 'hidden'}`}>
            Mini-CRM
          </h1>
          {!isOpen && !isMobile && <span className="text-blue-600 dark:text-blue-400 text-2xl font-bold">M</span>}
        </div>
        {isMobile && (
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400"
            aria-label="Close sidebar"
          >
            <FiX className="h-5 w-5" />
          </button>
        )}
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

      {/* Collapse button at bottom - only show on desktop */}
      {!isMobile && (
        <div className="absolute bottom-4 w-full flex justify-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <FiChevronLeft className="h-5 w-5" /> : <FiChevronRight className="h-5 w-5" />}
          </button>
        </div>
      )}
    </aside>
    </>
  );
};

export default Sidebar;
