import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getCases, getUserProgress } from "../services/gameService";
import { isGuestUser } from "../services/authService";
import { isCaseUnlocked } from "../services/caseStatusService";
import { Filter } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import Header from "../components/Header";
import DashboardStats from "../components/dashboard/DashboardStats";
import CasesGrid from "../components/cases/CasesGrid";
import SecondaryHeader from "../components/SecondaryHeader";
import type { Case, UserProgress } from "../types/types";

const FILTER_OPTIONS = [
  { value: "all", label: "All Cases" },
  { value: "available", label: "Available" },
  { value: "completed", label: "Completed" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [filter, setFilter] = useState("all");
  const shouldShowLeaderboardDisclaimer = !user || isGuestUser(user);

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

  const difficultyOrder: Record<string, number> = {
    beginner: 0,
    intermediate: 1,
    advanced: 2,
  };

  const sortByDifficulty = (casesList: Case[]) =>
    [...casesList].sort((a, b) => {
      const aOrder = difficultyOrder[a.difficulty?.toLowerCase()] ?? 999;
      const bOrder = difficultyOrder[b.difficulty?.toLowerCase()] ?? 999;
      return aOrder - bOrder;
    });

  const filteredCases =
    filter === "all"
      ? sortByDifficulty(cases)
      : cases.filter((caseItem) => {
          if (filter === "beginner") return caseItem.difficulty === "Beginner";
          if (filter === "intermediate")
            return caseItem.difficulty === "Intermediate";
          if (filter === "advanced") return caseItem.difficulty === "Advanced";
          if (filter === "completed")
            return progress?.completed_cases?.includes(caseItem.id);
          if (filter === "available")
            return (
              isCaseUnlocked(caseItem, progress, cases) &&
              !progress?.completed_cases?.includes(caseItem.id)
            );
          return true;
        });

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

        {shouldShowLeaderboardDisclaimer && (
          <div className="mb-6 border-l-2 border-(--primary) pl-3 py-1">
            <p className="font-mono text-[11px] text-(--foreground-muted)">
              Global Leaderboard page is available only for logged-in users.
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <DashboardStats
          reputation={reputation}
          completedCount={completedCount}
          totalCases={cases.length}
        />

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="mb-8">
            <p className="font-mono text-xs text-(--primary) tracking-[0.3em] mb-4">
              YOUR CASES
            </p>
            <h2 className="font-typewriter text-2xl text-(--foreground) mb-6">
              ALL INVESTIGATIONS
            </h2>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="btn-outline flex items-center gap-2 w-fit mb-6"
                data-testid="filter-dropdown"
              >
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-(--background-paper) border-(--border)">
              {FILTER_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className="text-(--foreground) focus:bg-(--secondary)"
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CasesGrid
          filterCases={filteredCases}
          progress={progress}
          allCases={cases}
        />

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
