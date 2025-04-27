import React, { useEffect, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeIndicator: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [showIndicator, setShowIndicator] = useState(true);
  const [mounted, setMounted] = useState(false);

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  // Hide indicator after 5 seconds
  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div 
      className={`fixed bottom-4 right-4 transition-all duration-500 ease-in-out transform ${
        showIndicator ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center space-x-3">
        <div className="text-gray-800 dark:text-gray-200 text-sm">
          {theme === 'light' ? 'Light Mode' : 'Dark Mode'} Active
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700">
          {theme === 'light' ? (
            <FiSun className="w-4 h-4 text-yellow-500" />
          ) : (
            <FiMoon className="w-4 h-4 text-blue-400" />
          )}
        </div>
        <button 
          onClick={() => {
            toggleTheme();
            setShowIndicator(true);
            // Hide again after 3 seconds
            setTimeout(() => setShowIndicator(false), 3000);
          }}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          Switch
        </button>
      </div>
    </div>
  );
};

export default ThemeIndicator;
