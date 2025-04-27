import { useState, useEffect, ReactNode } from 'react';
import { ThemeContext, Theme } from './ThemeContext';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Get initial theme from localStorage or system preference
  const getInitialTheme = (): Theme => {
    // For SSR safety
    if (typeof window === 'undefined') return 'light';
    
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme as Theme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Default to light
    return 'light';
  };

  // Initialize state with a function to avoid execution during SSR
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [mounted, setMounted] = useState(false);
  
  // Apply theme to document
  const applyTheme = (newTheme: Theme) => {
    // Get the root HTML element
    const root = document.documentElement;
    
    // Remove both theme classes
    root.classList.remove('light', 'dark');
    
    // Add the new theme class
    root.classList.add(newTheme);
    
    // Store the theme preference
    localStorage.setItem('theme', newTheme);
    
    // Apply transition styles to body
    document.body.style.transition = 'var(--theme-transition)';
    
    console.log('Applied theme:', newTheme, 'HTML classes:', root.classList.toString());
  };
  
  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    console.log('Theme toggled to:', newTheme);
  };
  
  // Apply theme when it changes
  useEffect(() => {
    if (mounted) {
      applyTheme(theme);
    }
  }, [theme, mounted]);
  
  // Handle initial setup and system preference changes
  useEffect(() => {
    // Mark as mounted
    setMounted(true);
    
    // Apply initial theme immediately
    applyTheme(getInitialTheme());
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };
    
    // Add event listener with browser compatibility
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);
  
  // Prevent flash of wrong theme by rendering children only after mounted
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {mounted ? children : null}
    </ThemeContext.Provider>
  );
};
