import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import AppRoutes from "./routes";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="grain-overlay" />
        <AppRoutes />
        <Toaster position="bottom-right" />
        <Analytics />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
