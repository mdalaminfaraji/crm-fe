import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes";
import { useTheme } from "./hooks/useTheme";
import { useEffect } from "react";
function App() {
  const { theme } = useTheme();
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
