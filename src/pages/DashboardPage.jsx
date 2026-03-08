import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getCases, getUserProgress } from "../services/gameService";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import DashboardWelcome from "../components/DashboardWelcome";
import DashboardStats from "../components/DashboardStats";
import CasesGrid from "../components/CasesGrid";
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

  const checkUnlocked = (caseData) => {
    if (caseData.unlock_cost === 0) return true;
    if (progress?.completed_cases?.includes(caseData.id)) return true;
    if (progress?.case_progress?.[caseData.id]) return true;
    return reputation >= caseData.unlock_cost;
  };

  const getCaseStatus = (caseData) => {
    if (progress?.completed_cases?.includes(caseData.id)) return "completed";
    if (progress?.case_progress?.[caseData.id]) return "in_progress";
    if (checkUnlocked(caseData)) return "unlocked";
    return "locked";
  };

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
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header reputation={reputation} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <DashboardWelcome username={user?.username?.toUpperCase()} />

        {/* Stats Grid */}
        <DashboardStats
          reputation={reputation}
          completedCount={completedCount}
          totalCases={cases.length}
        />

        <div className="mb-8">
          <p className="font-mono text-xs text-[#ffb703] tracking-[0.3em] mb-4">
            YOUR CASES
          </p>
          <h2 className="font-typewriter text-2xl text-[#e5e5e5] mb-6">
            RECENT INVESTIGATIONS
          </h2>
        </div>

        <CasesGrid
          cases={recentCases}
          getCaseStatus={getCaseStatus}
          progress={progress}
        />

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
