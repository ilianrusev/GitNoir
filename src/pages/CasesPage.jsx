import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
import { getCases, getUserProgress, unlockCase } from "../services/gameService";
import { ArrowLeft, Filter } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { toast } from "sonner";
import Header from "../components/Header";
import SingleCase from "../components/SingleCase";

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
    return (progress?.available_reputation || 0) >= caseData.unlock_cost;
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
      <Header reputation={progress?.available_reputation || 0} />

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
              <SingleCase
                key={caseData.id}
                caseData={caseData}
                status={status}
                unlocked={unlocked}
                caseProgress={caseProgress}
                animationDelay={`${index * 0.05}s`}
                variant="cases"
                canUnlock={canUnlock(caseData)}
                onUnlock={handleUnlock}
              />
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
