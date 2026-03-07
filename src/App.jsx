import { useState, useEffect, createContext, useContext } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
  syncUserFromFirebaseUser,
} from "./services/gameService";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CasesPage from "./pages/CasesPage";
import GamePage from "./pages/GamePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import NotebookPage from "./pages/NotebookPage";

// Auth Context
const AuthContext = createContext(null);
const MIN_AUTH_LOADING_MS = 250;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authCheckStartedAt = Date.now();
    let loadingTimeout;

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      const syncedUser = syncUserFromFirebaseUser(firebaseUser);
      setUser(syncedUser);

      const elapsed = Date.now() - authCheckStartedAt;
      const remaining = Math.max(MIN_AUTH_LOADING_MS - elapsed, 0);

      loadingTimeout = setTimeout(() => {
        setLoading(false);
      }, remaining);
    });

    return () => {
      unsubscribe();
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, []);

  const login = async (email, password) => {
    const userData = await loginUser(email, password);
    setUser(userData);
    return userData;
  };

  const register = async (username, email, password) => {
    const userData = await registerUser(username, email, password);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const refreshUser = () => {
    const updatedUser = getCurrentUser();
    setUser(updatedUser);
    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="terminal-text text-lg animate-pulse-glow">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route (redirects to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="terminal-text text-lg animate-pulse-glow">
          Loading...
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="grain-overlay" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cases"
            element={
              <ProtectedRoute>
                <CasesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/:caseId"
            element={
              <ProtectedRoute>
                <GamePage />
              </ProtectedRoute>
            }
          />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route
            path="/notebook"
            element={
              <ProtectedRoute>
                <NotebookPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
