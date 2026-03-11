import { getCases } from "./gameService";
import {
  getTierPosition,
  getTierUnlockCounts,
  getUnlockRequirementText,
} from "./unlockProgressionService";

const isCompletedOrInProgress = (caseData, progress) =>
  progress?.completed_cases?.includes(caseData.id) ||
  Boolean(progress?.case_progress?.[caseData.id]);

export const isCaseUnlocked = (caseData, progress, allCases = getCases()) => {
  if (!caseData) return false;
  if (isCompletedOrInProgress(caseData, progress)) return true;

  const { difficultyKey, position } = getTierPosition(caseData, allCases);
  if (difficultyKey && position) {
    const unlockCounts = getTierUnlockCounts(progress, allCases);
    return position <= (unlockCounts[difficultyKey] || 0);
  }

  return false;
};

export const getCaseStatus = (caseData, progress, allCases = getCases()) => {
  if (progress?.completed_cases?.includes(caseData.id)) return "completed";
  if (progress?.case_progress?.[caseData.id]) return "in_progress";
  if (isCaseUnlocked(caseData, progress, allCases)) return "unlocked";
  return "locked";
};

export const getCaseUnlockHint = (
  caseData,
  progress,
  allCases = getCases(),
) => {
  if (isCaseUnlocked(caseData, progress, allCases)) return null;

  const progressionHint = getUnlockRequirementText(
    caseData,
    progress,
    allCases,
  );
  if (progressionHint) return progressionHint;

  return "Case is locked";
};
