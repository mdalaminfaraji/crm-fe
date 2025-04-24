import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiMoon, FiSun, FiBell, FiUser } from 'react-icons/fi';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
}

const Navbar = ({ darkMode, toggleDarkMode, toggleSidebar }: NavbarProps) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 dark:text-gray-300 focus:outline-none mr-4"
            aria-label="Toggle sidebar"
          >
            <FiMenu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white md:block hidden">
            Mini-CRM
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="text-gray-600 dark:text-gray-300 focus:outline-none"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <FiSun className="h-5 w-5" />
            ) : (
              <FiMoon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <button
            className="text-gray-600 dark:text-gray-300 focus:outline-none relative"
            aria-label="View notifications"
          >
            <FiBell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center focus:outline-none"
              aria-label="Open user menu"
            >
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <FiUser className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </div>
            </button>

            {/* Dropdown menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setProfileOpen(false)}
                >
                  Your Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setProfileOpen(false)}
                >
                  Settings
                </Link>
                <Link
                  to="/logout"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setProfileOpen(false)}
                >
                  Sign out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
