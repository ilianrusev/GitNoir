import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
import { getCases, getUserProgress } from "../services/gameService";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import Header from "../components/Header";
import SingleCase from "../components/SingleCase";

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
        {/* Welcome Section */}
        <div className="mb-12">
          <p className="font-mono text-xs text-[#ffb703] tracking-[0.3em] mb-2">
            DETECTIVE PROFILE
          </p>
          <h1 className="font-typewriter text-4xl text-[#e5e5e5] mb-2">
            WELCOME,{" "}
            <span className="text-[#ffb703]">
              {user?.username?.toUpperCase()}
            </span>
          </h1>
          <p className="text-[#a3a3a3]">
            Your reputation speaks for itself. What case will you crack today?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="stat-card" data-testid="stat-reputation">
            <div className="stat-value">{reputation}</div>
            <div className="stat-label">Reputation</div>
          </div>
          <div className="stat-card" data-testid="stat-cases-solved">
            <div className="stat-value">{completedCount}</div>
            <div className="stat-label">Cases Solved</div>
          </div>
          <div className="stat-card" data-testid="stat-total-cases">
            <div className="stat-value">{cases.length}</div>
            <div className="stat-label">Total Cases</div>
          </div>
          <div className="stat-card" data-testid="stat-progress">
            <div className="stat-value">
              {cases.length > 0
                ? Math.round((completedCount / cases.length) * 100)
                : 0}
              %
            </div>
            <div className="stat-label">Completion</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="case-card p-6 mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs text-[#a3a3a3] tracking-wider">
              CAREER PROGRESS
            </span>
            <span className="font-mono text-xs text-[#ffb703]">
              {completedCount} / {cases.length} CASES
            </span>
          </div>
          <Progress
            value={cases.length > 0 ? (completedCount / cases.length) * 100 : 0}
            className="h-2 bg-[#1a1a1a]"
          />
        </div>

        {/* Active Cases */}
        <div className="mb-8">
          <p className="font-mono text-xs text-[#ffb703] tracking-[0.3em] mb-4">
            YOUR CASES
          </p>
          <h2 className="font-typewriter text-2xl text-[#e5e5e5] mb-6">
            RECENT INVESTIGATIONS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentCases.map((caseData, index) => {
            const status = getCaseStatus(caseData);
            const unlocked = checkUnlocked(caseData);
            const caseProgress = progress?.case_progress?.[caseData.id];

            return (
              <SingleCase
                key={caseData.id}
                caseData={caseData}
                status={status}
                unlocked={unlocked}
                caseProgress={caseProgress}
                animationDelay={`${index * 0.1}s`}
              />
            );
          })}
        </div>

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
