import { Navigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../context/AuthContext";
import { isGuestUser } from "../services/authService";
import type { ReactNode } from "react";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user || isGuestUser(user)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user && !isGuestUser(user)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
