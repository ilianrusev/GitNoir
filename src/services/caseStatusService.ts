import { getCases } from "./gameService";
import {
  getTierPosition,
  getTierUnlockCounts,
  getUnlockRequirementText,
} from "./unlockProgressionService";
import type { Case, CaseStatus, UserProgress } from "../types/types";

const isCompletedOrInProgress = (
  caseData: Case,
  progress: UserProgress | null,
): boolean =>
  progress?.completed_cases?.includes(caseData.id) ||
  Boolean(progress?.case_progress?.[caseData.id]);

export const isCaseUnlocked = (
  caseData: Case | null | undefined,
  progress: UserProgress | null,
  allCases: Case[] = getCases(),
): boolean => {
  if (!caseData) return false;
  if (isCompletedOrInProgress(caseData, progress)) return true;

  const { difficultyKey, position } = getTierPosition(caseData, allCases);
  if (difficultyKey && position) {
    const unlockCounts = getTierUnlockCounts(progress, allCases);
    return position <= (unlockCounts[difficultyKey] || 0);
  }

  return false;
};

export const getCaseStatus = (
  caseData: Case,
  progress: UserProgress | null,
  allCases: Case[] = getCases(),
): CaseStatus => {
  if (progress?.completed_cases?.includes(caseData.id)) return "completed";
  if (progress?.case_progress?.[caseData.id]) return "in_progress";
  if (isCaseUnlocked(caseData, progress, allCases)) return "unlocked";
  return "locked";
};

export const getCaseUnlockHint = (
  caseData: Case,
  progress: UserProgress | null,
  allCases: Case[] = getCases(),
): string | null => {
  if (isCaseUnlocked(caseData, progress, allCases)) return null;

  const progressionHint = getUnlockRequirementText(
    caseData,
    progress,
    allCases,
  );
  if (progressionHint) return progressionHint;

  return "Case is locked";
};
