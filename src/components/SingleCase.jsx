import { Link } from "react-router-dom";
import { Lock, Play } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

export default function SingleCase({
  caseData,
  status,
  unlocked,
  caseProgress,
  animationDelay,
  variant = "dashboard",
  canUnlock = false,
  onUnlock,
}) {
  const isCasesVariant = variant === "cases";
  const shouldSoftLockBlur = isCasesVariant && !unlocked && !canUnlock;

  return (
    <div
      className={
        isCasesVariant
          ? "case-file animate-fade-in"
          : `case-card p-6 relative ${!unlocked ? "locked" : ""}`
      }
      style={{ animationDelay }}
      data-testid={`case-card-${caseData.id}`}
    >
      {shouldSoftLockBlur && (
        <div className="absolute inset-0 bg-[#0a0a0a]/25 backdrop-blur-[1px] pointer-events-none z-10" />
      )}

      {!isCasesVariant && !unlocked && (
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
          <span className="font-mono text-xs text-[#00ff41]">SOLVED</span>
        )}
        {status === "in_progress" && (
          <span className="font-mono text-xs text-[#ffb703]">IN PROGRESS</span>
        )}
      </div>

      <h3
        className={`font-typewriter ${isCasesVariant ? "text-2xl mb-3" : "text-lg mb-2"} text-[#e5e5e5] ${status === "completed" ? "line-through opacity-60" : ""}`}
      >
        {caseData.title}
      </h3>
      <p
        className={`text-[#a3a3a3] ${isCasesVariant ? "mb-6 leading-relaxed" : "text-sm mb-4 line-clamp-2"} ${status === "completed" ? "line-through opacity-60" : ""}`}
      >
        {caseData.description}
      </p>

      {isCasesVariant && (
        <div className="p-4 bg-[#0c0c0c] border border-[#222] mb-6">
          <p className="font-typewriter text-sm text-[#666] italic line-clamp-3">
            "{caseData.story_intro.split("\n")[0]}"
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#222]">
        {isCasesVariant ? (
          <>
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
                  className={status === "completed" ? "btn-outline" : "btn-primary"}
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
                  canUnlock
                    ? "btn-primary"
                    : shouldSoftLockBlur
                      ? "btn-outline opacity-75 relative z-20 blur-[0.px]"
                      : "btn-outline opacity-50"
                }
                onClick={() => canUnlock && onUnlock?.(caseData)}
                disabled={!canUnlock}
                data-testid={`unlock-case-${caseData.id}`}
              >
                <Lock className="w-4 h-4 mr-2" />
                Unlock ({caseData.unlock_cost} REP)
              </Button>
            )}
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      {caseProgress &&
        status === "in_progress" &&
        (isCasesVariant ? (
          <div className="mt-6 pt-4 border-t border-[#222]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-[#666]">PROGRESS</span>
              <span className="font-mono text-xs text-[#ffb703]">
                {caseProgress.current_step} / {caseData.steps.length}
              </span>
            </div>
            <Progress
              value={(caseProgress.current_step / caseData.steps.length) * 100}
              className="h-1 bg-[#1a1a1a]"
            />
          </div>
        ) : (
          <div className="mt-4">
            <Progress
              value={(caseProgress.current_step / caseData.steps.length) * 100}
              className="h-1 bg-[#1a1a1a]"
            />
            <span className="font-mono text-[10px] text-[#666] mt-1 block">
              Step {caseProgress.current_step + 1} of {caseData.steps.length}
            </span>
          </div>
        ))}
    </div>
  );
}