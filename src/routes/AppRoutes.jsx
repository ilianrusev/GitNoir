import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./RouteGuards";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import GamePage from "../pages/GamePage";
import LeaderboardPage from "../pages/LeaderboardPage";
import CheatSheetPage from "../pages/CheatSheetPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/cases" element={<Navigate to="/dashboard" replace />} />
      <Route path="/game/:caseId" element={<GamePage />} />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <LeaderboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/cheatsheet" element={<CheatSheetPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
