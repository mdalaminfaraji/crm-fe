import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes";
import ThemeIndicator from "./components/common/ThemeIndicator";

/**
 * Main App component
 * Uses the new modular routing system with lazy loading and route protection
 * Includes theme indicator for dark/light mode feedback
 */
function App() {
  return (
    <BrowserRouter>
      <AppRouter />
      <ThemeIndicator />
    </BrowserRouter>
  );
}

export default App;
