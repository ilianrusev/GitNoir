import { Link } from "react-router-dom";
import { Lock, Play } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import type { Case, CaseProgressEntry, CaseStatus } from "../../types/types";

const NEW_CASE_WINDOW_DAYS = 3;

function parseCaseDate(dateValue: string | undefined): Date | null {
  if (!dateValue) return null;

  const dateOnlyMatch = String(dateValue).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const parsed = new Date(dateValue);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

interface SingleCaseProps {
  caseData: Case;
  status: CaseStatus;
  caseProgress?: CaseProgressEntry;
  lockHint: string | null;
  variant?: string;
}

export default function SingleCase({
  caseData,
  status,
  caseProgress,
  lockHint,
  variant = "dashboard",
}: SingleCaseProps) {
  const isUnlocked = status !== "locked";
  const isCasesVariant = variant === "cases";
  const shouldSoftLockBlur = isCasesVariant && !isUnlocked;
  const isNewCase = (() => {
    const createdAt = parseCaseDate(caseData.created_at);
    if (!createdAt) return false;

    const now = new Date();
    const createdDay = new Date(
      createdAt.getFullYear(),
      createdAt.getMonth(),
      createdAt.getDate(),
    );
    const currentDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const dayDiff = Math.floor(
      (currentDay.getTime() - createdDay.getTime()) / (24 * 60 * 60 * 1000),
    );

    return dayDiff >= 0 && dayDiff <= NEW_CASE_WINDOW_DAYS;
  })();

  return (
    <div
      className={
        isCasesVariant
          ? "case-file"
          : `case-card p-6 relative ${!isUnlocked ? "locked" : ""}`
      }
      data-testid={`case-card-${caseData.id}`}
    >
      {isNewCase && (
        <div className="absolute top-0 left-0 z-20 w-24 h-24 pointer-events-none overflow-hidden">
          <span className="absolute top-3 -left-7 w-28 -rotate-45 bg-[#d00000] text-white font-mono text-[10px] tracking-widest text-center py-1 shadow-sm">
            NEW
          </span>
        </div>
      )}

      {shouldSoftLockBlur && (
        <div className="absolute inset-0 bg-(--background)/25 backdrop-blur-[1px] pointer-events-none z-10" />
      )}

      {!isCasesVariant && !isUnlocked && (
        <div className="locked-overlay">
          <Lock className="w-8 h-8 text-[#666]" />
          <span className="font-mono text-xs text-[#666]">
            {lockHint || "LOCKED"}
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
        <div className="flex items-center gap-2">
          {status === "completed" && (
            <span className="font-mono text-xs text-(--foreground-terminal)">
              SOLVED
            </span>
          )}
          {status === "in_progress" && (
            <span className="font-mono text-xs text-(--primary)">
              IN PROGRESS
            </span>
          )}
        </div>
      </div>

      <h3
        className={`font-typewriter ${isCasesVariant ? "text-2xl mb-3" : "text-lg mb-2"} text-(--foreground) ${status === "completed" ? "line-through opacity-60" : ""}`}
      >
        {caseData.title}
      </h3>
      <p
        className={`text-(--foreground-muted) ${isCasesVariant ? "mb-6 leading-relaxed" : "text-sm mb-4 line-clamp-2"} ${status === "completed" ? "line-through opacity-60" : ""}`}
      >
        {caseData.description}
      </p>

      {isCasesVariant && (
        <div className="p-4 bg-(--background-terminal) border border-[#222] mb-6">
          <p className="font-typewriter text-sm text-[#666] italic line-clamp-3">
            "{caseData.story_intro.split("\n")[0]}"
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-auto pt-4 border-t border-[#222]">
        {isCasesVariant ? (
          <>
            <div className="flex flex-wrap items-center gap-3 min-w-0 relative z-20">
              {isUnlocked && (
                <span className="font-mono text-xs text-[#666]">
                  {caseData.steps.length} STEPS
                </span>
              )}
              {!isUnlocked && (
                <span className="font-mono text-xs text-[#666] flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  {lockHint || "LOCKED"}
                </span>
              )}
            </div>

            {isUnlocked ? (
              <Link
                to={`/game/${caseData.id}`}
                className="self-center sm:self-auto"
              >
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
                  shouldSoftLockBlur
                    ? "btn-outline opacity-75 relative z-20 max-w-full self-center sm:self-auto"
                    : "btn-outline opacity-50 max-w-full self-center sm:self-auto"
                }
                disabled
                data-testid={`unlock-case-${caseData.id}`}
              >
                <Lock className="w-4 h-4 mr-2" />
                Locked
              </Button>
            )}
          </>
        ) : (
          <>
            <span className="font-mono text-xs text-[#666]">
              {caseData.total_points} PTS
            </span>
            {isUnlocked && status !== "completed" && (
              <Link
                to={`/game/${caseData.id}`}
                className="self-center sm:self-auto"
              >
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
              <Link
                to={`/game/${caseData.id}`}
                className="self-center sm:self-auto"
              >
                <Button
                  className="btn-outline py-2 px-4 text-xs"
                  data-testid={`replay-case-${caseData.id}`}
                >
                  Replay
                </Button>
              </Link>
            )}
          </>
        )}
      </div>

      {caseProgress &&
        status === "in_progress" &&
        (isCasesVariant ? (
          <div className="mt-6 pt-4 border-t border-[#222]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-[#666]">PROGRESS</span>
              <span className="font-mono text-xs text-(--primary)">
                {caseProgress.current_step} / {caseData.steps.length}
              </span>
            </div>
            <Progress
              value={(caseProgress.current_step / caseData.steps.length) * 100}
              className="h-1 bg-(--background-paper)"
            />
          </div>
        ) : (
          <div className="mt-4">
            <Progress
              value={(caseProgress.current_step / caseData.steps.length) * 100}
              className="h-1 bg-(--background-paper)"
            />
            <span className="font-mono text-[10px] text-[#666] mt-1 block">
              Step {caseProgress.current_step + 1} of {caseData.steps.length}
            </span>
          </div>
        ))}
    </div>
  );
}
