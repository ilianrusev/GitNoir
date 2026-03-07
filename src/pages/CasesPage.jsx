import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
import { getCases, getUserProgress, unlockCase } from "../services/gameService";
import { Lock, Play, ArrowLeft, Filter } from "lucide-react";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { toast } from "sonner";
import Header from "../components/Header";

export default function CasesPage() {
  const { refreshUser } = useAuth();
  const [cases, setCases] = useState([]);
  const [progress, setProgress] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allCases = getCases();
    const userProgress = getUserProgress();
    setCases(allCases);
    setProgress(userProgress);
  };

  const handleUnlock = (caseData) => {
    try {
      unlockCase(caseData.id);
      toast.success(`Case "${caseData.title}" unlocked!`);
      refreshUser();
      loadData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const isCaseUnlocked = (caseData) => {
    if (caseData.unlock_cost === 0) return true;
    if (progress?.completed_cases?.includes(caseData.id)) return true;
    if (progress?.case_progress?.[caseData.id]) return true;
    return false;
  };

  const canUnlock = (caseData) => {
    return (progress?.reputation || 0) >= caseData.unlock_cost;
  };

  const getCaseStatus = (caseData) => {
    if (progress?.completed_cases?.includes(caseData.id)) return "completed";
    if (progress?.case_progress?.[caseData.id]) return "in_progress";
    if (isCaseUnlocked(caseData)) return "unlocked";
    return "locked";
  };

  const filteredCases = cases.filter((c) => {
    if (filter === "all") return true;
    if (filter === "beginner") return c.difficulty === "Beginner";
    if (filter === "intermediate") return c.difficulty === "Intermediate";
    if (filter === "advanced") return c.difficulty === "Advanced";
    if (filter === "completed")
      return progress?.completed_cases?.includes(c.id);
    if (filter === "available")
      return isCaseUnlocked(c) && !progress?.completed_cases?.includes(c.id);
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header reputation={progress?.reputation || 0} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-[#a3a3a3] mb-4 hover:text-[#ffb703] transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-mono text-sm">Back to Dashboard</span>
            </Link>
            <p className="font-mono text-xs text-[#ffb703] tracking-[0.3em] mb-2">
              CASE FILES
            </p>
            <h1 className="font-typewriter text-4xl text-[#e5e5e5]">
              ALL INVESTIGATIONS
            </h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="btn-outline flex items-center gap-2"
                data-testid="filter-dropdown"
              >
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1a1a1a] border-[#333]">
              <DropdownMenuItem
                onClick={() => setFilter("all")}
                className="text-[#e5e5e5] focus:bg-[#2a2a2a]"
              >
                All Cases
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilter("available")}
                className="text-[#e5e5e5] focus:bg-[#2a2a2a]"
              >
                Available
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilter("completed")}
                className="text-[#e5e5e5] focus:bg-[#2a2a2a]"
              >
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilter("beginner")}
                className="text-[#e5e5e5] focus:bg-[#2a2a2a]"
              >
                Beginner
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilter("intermediate")}
                className="text-[#e5e5e5] focus:bg-[#2a2a2a]"
              >
                Intermediate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilter("advanced")}
                className="text-[#e5e5e5] focus:bg-[#2a2a2a]"
              >
                Advanced
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCases.map((caseData, index) => {
            const status = getCaseStatus(caseData);
            const unlocked = isCaseUnlocked(caseData);
            const caseProgress = progress?.case_progress?.[caseData.id];

            return (
              <div
                key={caseData.id}
                className="case-file animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
                data-testid={`case-file-${caseData.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
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
                      <span className="font-mono text-xs text-[#00ff41] px-2 py-1 border border-[#00ff41]">
                        SOLVED
                      </span>
                    )}
                    {status === "in_progress" && (
                      <span className="font-mono text-xs text-[#ffb703] px-2 py-1 border border-[#ffb703]">
                        IN PROGRESS
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-sm text-[#ffb703]">
                    {caseData.total_points} PTS
                  </span>
                </div>

                <h3
                  className={`font-typewriter text-2xl text-[#e5e5e5] mb-3 ${status === "completed" ? "line-through opacity-60" : ""}`}
                >
                  {caseData.title}
                </h3>
                <p
                  className={`text-[#a3a3a3] mb-6 leading-relaxed ${status === "completed" ? "line-through opacity-60" : ""}`}
                >
                  {caseData.description}
                </p>

                <div className="p-4 bg-[#0c0c0c] border border-[#222] mb-6">
                  <p className="font-typewriter text-sm text-[#666] italic line-clamp-3">
                    "{caseData.story_intro.split("\n")[0]}"
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-[#666]">
                      {caseData.steps.length} STEPS
                    </span>
                    {!unlocked && (
                      <span className="font-mono text-xs text-[#666] flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {caseData.unlock_cost} REP
                      </span>
                    )}
                  </div>

                  {unlocked ? (
                    <Link to={`/game/${caseData.id}`}>
                      <Button
                        className={
                          status === "completed" ? "btn-outline" : "btn-primary"
                        }
                        data-testid={`play-case-${caseData.id}`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {status === "completed"
                          ? "Replay"
                          : status === "in_progress"
                            ? "Continue"
                            : "Start Case"}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      className={
                        canUnlock(caseData)
                          ? "btn-primary"
                          : "btn-outline opacity-50"
                      }
                      onClick={() =>
                        canUnlock(caseData) && handleUnlock(caseData)
                      }
                      disabled={!canUnlock(caseData)}
                      data-testid={`unlock-case-${caseData.id}`}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Unlock ({caseData.unlock_cost} REP)
                    </Button>
                  )}
                </div>

                {caseProgress && status === "in_progress" && (
                  <div className="mt-6 pt-4 border-t border-[#222]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-[#666]">
                        PROGRESS
                      </span>
                      <span className="font-mono text-xs text-[#ffb703]">
                        {caseProgress.current_step} / {caseData.steps.length}
                      </span>
                    </div>
                    <Progress
                      value={
                        (caseProgress.current_step / caseData.steps.length) *
                        100
                      }
                      className="h-1 bg-[#1a1a1a]"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-16">
            <p className="font-typewriter text-xl text-[#666]">
              No cases match your filter.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
