import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
import { getCases, getUserProgress } from "../services/gameService";
import { Lock, Play } from "lucide-react";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import Header from "../components/Header";

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

  const earnedPoints = progress?.reputation || 0;
  const completedCount = progress?.completed_cases?.length || 0;

  const checkUnlocked = (caseData) => {
    if (caseData.unlock_cost === 0) return true;
    if (progress?.completed_cases?.includes(caseData.id)) return true;
    if (progress?.case_progress?.[caseData.id]) return true;
    return earnedPoints >= caseData.unlock_cost;
  };

  const getCaseStatus = (caseData) => {
    if (progress?.completed_cases?.includes(caseData.id)) return "completed";
    if (progress?.case_progress?.[caseData.id]) return "in_progress";
    return "locked";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header reputation={earnedPoints} />

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
            <div className="stat-value">{earnedPoints}</div>
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
            ACTIVE INVESTIGATIONS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.slice(0, 9).map((caseData, index) => {
            const status = getCaseStatus(caseData);
            const unlocked = checkUnlocked(caseData);
            const caseProgress = progress?.case_progress?.[caseData.id];

            return (
              <div
                key={caseData.id}
                className={`case-card p-6 relative ${!unlocked ? "locked" : ""}`}
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`case-card-${caseData.id}`}
              >
                {!unlocked && (
                  <div className="locked-overlay">
                    <Lock className="w-8 h-8 text-[#666]" />
                    <span className="font-mono text-xs text-[#666]">
                      {caseData.unlock_cost} REP TO UNLOCK
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <span
                    className={`badge-difficulty ${
                      caseData.difficulty === "Beginner"
                        ? "badge-beginner"
                        : caseData.difficulty === "Intermediate"
                          ? "badge-intermediate"
                          : "badge-advanced"
                    }`}
                  >
                    {caseData.difficulty}
                  </span>
                  {status === "completed" && (
                    <span className="font-mono text-xs text-[#00ff41]">
                      SOLVED
                    </span>
                  )}
                  {status === "in_progress" && (
                    <span className="font-mono text-xs text-[#ffb703]">
                      IN PROGRESS
                    </span>
                  )}
                </div>

                <h3
                  className={`font-typewriter text-lg text-[#e5e5e5] mb-2 ${status === "completed" ? "line-through opacity-60" : ""}`}
                >
                  {caseData.title}
                </h3>
                <p
                  className={`text-sm text-[#a3a3a3] mb-4 line-clamp-2 ${status === "completed" ? "line-through opacity-60" : ""}`}
                >
                  {caseData.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#222]">
                  <span className="font-mono text-xs text-[#666]">
                    {caseData.total_points} PTS
                  </span>
                  {unlocked && status !== "completed" && (
                    <Link to={`/game/${caseData.id}`}>
                      <Button
                        className="btn-primary py-2 px-4 text-xs"
                        data-testid={`start-case-${caseData.id}`}
                      >
                        <Play className="w-3 h-3 mr-2" />
                        {status === "in_progress" ? "Continue" : "Start"}
                      </Button>
                    </Link>
                  )}
                  {status === "completed" && (
                    <Link to={`/game/${caseData.id}`}>
                      <Button
                        className="btn-outline py-2 px-4 text-xs"
                        data-testid={`replay-case-${caseData.id}`}
                      >
                        Replay
                      </Button>
                    </Link>
                  )}
                </div>

                {caseProgress && status === "in_progress" && (
                  <div className="mt-4">
                    <Progress
                      value={
                        (caseProgress.current_step / caseData.steps.length) *
                        100
                      }
                      className="h-1 bg-[#1a1a1a]"
                    />
                    <span className="font-mono text-[10px] text-[#666] mt-1 block">
                      Step {caseProgress.current_step + 1} of{" "}
                      {caseData.steps.length}
                    </span>
                  </div>
                )}
              </div>
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
