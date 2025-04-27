import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full relative overflow-hidden group ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-blue-700 dark:to-indigo-800 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
      
      <div className="relative transition-all duration-500 ease-in-out transform">
        {theme === 'light' ? (
          <FiMoon className="w-5 h-5 text-gray-700 hover:text-gray-900 transition-colors" />
        ) : (
          <FiSun className="w-5 h-5 text-yellow-300 hover:text-yellow-200 transition-colors" />
        )}
      </div>
      
      <span className="sr-only">
        {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;
