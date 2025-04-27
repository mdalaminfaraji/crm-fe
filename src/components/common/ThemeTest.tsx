import React, { useEffect, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { FiSun, FiMoon, FiX } from 'react-icons/fi';

/**
 * An enhanced component to test if the theme system is working correctly
 * Provides visual feedback and debugging information
 */
const ThemeTest: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  
  // After mounting, we have access to the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !visible) return null;

  return (
    <div className="themed-card fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg border">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Theme Test Panel</h3>
        <button 
          onClick={() => setVisible(false)}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="Close panel"
        >
          <FiX />
        </button>
      </div>
      
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between p-2 rounded bg-gray-100 dark:bg-gray-700">
          <span>Current theme:</span>
          <span className="font-bold flex items-center gap-2">
            {theme === 'dark' ? <FiMoon className="text-indigo-400" /> : <FiSun className="text-yellow-400" />}
            {theme}
          </span>
        </div>
        
        <div className="flex items-center justify-between p-2 rounded bg-gray-100 dark:bg-gray-700">
          <span>HTML class:</span>
          <span className="font-bold">
            {document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
          </span>
        </div>
        
        <div className="flex items-center justify-between p-2 rounded bg-gray-100 dark:bg-gray-700">
          <span>CSS Variables:</span>
          <span className="font-bold">
            {getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim() !== '' ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="p-2 rounded bg-gray-100 dark:bg-gray-700 text-center">Light Text</div>
          <div className="p-2 rounded bg-blue-500 text-white text-center">Dark Text</div>
        </div>
        
        <button 
          onClick={toggleTheme}
          className="themed-button mt-3 px-4 py-2 rounded-md w-full font-medium"
        >
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>
    </div>
  );
};

export default ThemeTest;
