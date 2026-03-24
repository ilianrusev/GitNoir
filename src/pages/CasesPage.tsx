import { useState, useEffect } from "react";
import { getCases, getUserProgress } from "../services/gameService";
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
import SecondaryHeader from "../components/SecondaryHeader";
import CasesGrid from "../components/cases/CasesGrid";
import type { Case, UserProgress } from "../types/types";

const FILTER_OPTIONS = [
  { value: "all", label: "All Cases" },
  { value: "available", label: "Available" },
  { value: "completed", label: "Completed" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
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
      : cases.filter((c) => {
          if (filter === "beginner") return c.difficulty === "Beginner";
          if (filter === "intermediate") return c.difficulty === "Intermediate";
          if (filter === "advanced") return c.difficulty === "Advanced";
          if (filter === "completed")
            return progress?.completed_cases?.includes(c.id);
          if (filter === "available")
            return (
              isCaseUnlocked(c, progress, cases) &&
              !progress?.completed_cases?.includes(c.id)
            );
          return true;
        });

  return (
    <div className="min-h-screen bg-(--background)">
      <Header reputation={progress?.reputation || 0} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between ">
          <SecondaryHeader
            backTo="/dashboard"
            backLabel="Back to Dashboard"
            eyebrow="CASE FILES"
            title="ALL INVESTIGATIONS"
          />

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
        {/* Cases Grid */}
        <CasesGrid
          filterCases={filteredCases}
          progress={progress}
          variant="cases"
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
