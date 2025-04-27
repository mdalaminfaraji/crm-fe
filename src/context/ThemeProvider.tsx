import { useState, useEffect, ReactNode } from 'react';
import { ThemeContext, Theme } from './ThemeContext';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Check if user has a theme preference in localStorage or use system preference
  const getInitialTheme = (): Theme => {
    // For SSR/SSG, window might not be available
    if (typeof window === 'undefined') return 'light';
    
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [mounted, setMounted] = useState(false);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update theme if user hasn't explicitly set a preference
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Legacy browsers (Safari)
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // After mounting, we have access to the theme
  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Prevent flash of incorrect theme
  const providerValue = { theme, toggleTheme };
  
  return (
    <ThemeContext.Provider value={providerValue}>
      {mounted ? children : null}
    </ThemeContext.Provider>
  );
};
