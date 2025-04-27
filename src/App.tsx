import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes";

/**
 * Main App component
 * Uses the new modular routing system with lazy loading and route protection
 */
function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
