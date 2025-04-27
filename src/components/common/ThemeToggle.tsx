import React, { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
}

/**
 * An enhanced toggle button component for switching between light and dark themes
 * with improved styling and visual feedback
 */
const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  return (
    <button
      onClick={toggleTheme}
      className={`p-3 rounded-full relative overflow-hidden group ${className}`}
      style={{
        backgroundColor: theme === 'dark' ? 'var(--bg-secondary)' : 'var(--bg-secondary)',
        color: theme === 'dark' ? 'var(--text-primary)' : 'var(--text-primary)',
        boxShadow: '0 2px 5px var(--shadow-color)',
        transition: 'var(--theme-transition)'
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      type="button"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-blue-700 dark:to-indigo-800 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
      
      <div className="relative transition-all duration-500 ease-in-out transform">
        {theme === 'light' ? (
          <FiMoon className="w-6 h-6" style={{ color: '#6366f1' }} />
        ) : (
          <FiSun className="w-6 h-6" style={{ color: '#fbbf24' }} />
        )}
      </div>
      
      <span className="sr-only">
        {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;
