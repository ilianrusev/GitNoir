export const isCaseUnlocked = (caseData, progress) => {
  if (caseData.unlock_cost === 0) return true;
  if (progress?.completed_cases?.includes(caseData.id)) return true;
  if (progress?.case_progress?.[caseData.id]) return true;
  return (progress?.reputation || 0) >= caseData.unlock_cost;
};

export const getCaseStatus = (caseData, progress) => {
  if (progress?.completed_cases?.includes(caseData.id)) return "completed";
  if (progress?.case_progress?.[caseData.id]) return "in_progress";
  if (isCaseUnlocked(caseData, progress)) return "unlocked";
  return "locked";
};
