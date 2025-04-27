import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes";
import { useTheme } from "./hooks/useTheme";
import { useEffect } from "react";

/**
 * Main App component
 * Uses the new modular routing system with lazy loading and route protection
 * Includes theme indicator for dark/light mode feedback
 */
function App() {
  const { theme } = useTheme();

  // Apply the theme class to the body element
  useEffect(() => {
    document.body.className = `app-body ${theme}`;
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="app-container">
        <AppRouter />
      </div>
    </BrowserRouter>
  );
}

export default App;
