import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCases, getUserProgress } from "../services/gameService";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import DashboardStats from "../components/dashboard/DashboardStats";
import CasesGrid from "../components/cases/CasesGrid";
import SecondaryHeader from "../components/SecondaryHeader";
export default function DashboardPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState([]);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allCases = getCases();
    const userProgress = getUserProgress();
    setCases(allCases);
    setProgress(userProgress);
  };

  const reputation = progress?.reputation || 0;
  const completedCount = progress?.completed_cases?.length || 0;

  const recentCases = [...cases]
    .sort((firstCase, secondCase) => {
      const firstCreatedAt = firstCase.created_at
        ? new Date(firstCase.created_at).getTime()
        : 0;
      const secondCreatedAt = secondCase.created_at
        ? new Date(secondCase.created_at).getTime()
        : 0;
      return secondCreatedAt - firstCreatedAt;
    })
    .slice(0, 9);

  return (
    <div className="min-h-screen bg-(--background)">
      <Header reputation={reputation} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <SecondaryHeader
          eyebrow="DETECTIVE PROFILE"
          title={
            <>
              WELCOME,{" "}
              <span className="text-(--primary)">
                {user?.username?.toUpperCase()}
              </span>
            </>
          }
          description="Your reputation speaks for itself. What case will you crack today?"
        />

        {/* Stats Grid */}
        <DashboardStats
          reputation={reputation}
          completedCount={completedCount}
          totalCases={cases.length}
        />

        <div className="mb-8">
          <p className="font-mono text-xs text-(--primary) tracking-[0.3em] mb-4">
            YOUR CASES
          </p>
          <h2 className="font-typewriter text-2xl text-(--foreground) mb-6">
            RECENT INVESTIGATIONS
          </h2>
        </div>

        <CasesGrid cases={recentCases} progress={progress} />

        {cases.length > 9 && (
          <div className="mt-8 text-center">
            <Link to="/cases">
              <Button className="btn-outline" data-testid="view-all-cases">
                View All {cases.length} Cases
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
