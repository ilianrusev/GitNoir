import type {
  Case,
  DifficultyKey,
  TierCounts,
  TierPosition,
  UnlockRequirements,
  UserProgress,
} from "../types/types";

const normalizeDifficulty = (difficulty: string | undefined): string =>
  String(difficulty || "")
    .trim()
    .toLowerCase();

const sortCasesWithinTier = (cases: Case[] = []): Case[] =>
  [...cases].sort((firstCase, secondCase) =>
    String(firstCase.id || "").localeCompare(
      String(secondCase.id || ""),
      undefined,
      { numeric: true, sensitivity: "base" },
    ),
  );

const getCasesByDifficulty = (
  cases: Case[] = [],
): Record<DifficultyKey, Case[]> => {
  const grouped: Record<DifficultyKey, Case[]> = {
    beginner: [],
    intermediate: [],
    advanced: [],
  };

  cases.forEach((caseData) => {
    const difficultyKey = normalizeDifficulty(
      caseData?.difficulty,
    ) as DifficultyKey;
    if (!grouped[difficultyKey]) return;
    grouped[difficultyKey].push(caseData);
  });

  return {
    beginner: sortCasesWithinTier(grouped.beginner),
    intermediate: sortCasesWithinTier(grouped.intermediate),
    advanced: sortCasesWithinTier(grouped.advanced),
  };
};

export const getCompletedTierCounts = (
  progress: UserProgress | null,
  cases: Case[] = [],
): TierCounts => {
  const completedCaseIds = new Set(progress?.completed_cases || []);
  const counts: TierCounts = {
    beginner: 0,
    intermediate: 0,
    advanced: 0,
  };

  cases.forEach((caseData) => {
    if (!completedCaseIds.has(caseData.id)) return;

    const difficultyKey = normalizeDifficulty(
      caseData.difficulty,
    ) as DifficultyKey;
    if (!counts[difficultyKey] && counts[difficultyKey] !== 0) return;

    counts[difficultyKey] += 1;
  });

  return counts;
};

// Applies progression rules to determine unlocked slots per tier.
// Rules:
// - Beginner: completed beginner + 1
// - Intermediate: first unlock after 2 beginners, then +1 per completed intermediate
// - Advanced: first unlock after 2 intermediates, then +1 per completed advanced
export const getTierUnlockCounts = (
  progress: UserProgress | null,
  cases: Case[] = [],
): TierCounts => {
  const completedCounts = getCompletedTierCounts(progress, cases);
  const hasIntermediateGate =
    completedCounts.beginner >= 2 || completedCounts.intermediate > 0;
  const hasAdvancedGate =
    completedCounts.intermediate >= 2 || completedCounts.advanced > 0;

  return {
    beginner: completedCounts.beginner + 1,
    intermediate: hasIntermediateGate
      ? completedCounts.intermediate + 1
      : 0,
    advanced: hasAdvancedGate
      ? completedCounts.advanced + 1
      : 0,
  };
};

// Returns case position inside its own difficulty tier.
export const getTierPosition = (
  caseData: Case | null | undefined,
  cases: Case[] = [],
): TierPosition => {
  const difficultyKey = normalizeDifficulty(caseData?.difficulty) as DifficultyKey;
  const groupedCases = getCasesByDifficulty(cases);
  const tierCases = groupedCases[difficultyKey] || [];

  const position = tierCases.findIndex((entry) => entry.id === caseData?.id);

  return {
    difficultyKey,
    position: position >= 0 ? position + 1 : null,
  };
};

// Computes unlock state and remaining requirement for a specific case.
export const getUnlockRequirements = (
  caseData: Case,
  progress: UserProgress | null,
  cases: Case[] = [],
): UnlockRequirements => {
  const { difficultyKey, position } = getTierPosition(caseData, cases);

  if (!difficultyKey || !position) {
    return {
      difficultyKey,
      position,
      remaining: null,
      requiredDifficulty: null,
      unlocked: false,
    };
  }

  const completedCounts = getCompletedTierCounts(progress, cases);
  const tierUnlockCounts = getTierUnlockCounts(progress, cases);
  const unlocked = position <= (tierUnlockCounts[difficultyKey] || 0);

  if (unlocked) {
    return {
      difficultyKey,
      position,
      remaining: 0,
      requiredDifficulty: null,
      unlocked: true,
    };
  }

  let remaining = 0;
  let requiredDifficulty: DifficultyKey | null = null;

  if (difficultyKey === "beginner") {
    remaining = Math.max(0, position - (completedCounts.beginner + 1));
    requiredDifficulty = "beginner";
  } else if (difficultyKey === "intermediate") {
    if (position === 1) {
      remaining = Math.max(0, 2 - completedCounts.beginner);
      requiredDifficulty = "beginner";
    } else {
      remaining = Math.max(0, position - 1 - completedCounts.intermediate);
      requiredDifficulty = "intermediate";
    }
  } else if (difficultyKey === "advanced") {
    if (position === 1) {
      remaining = Math.max(0, 2 - completedCounts.intermediate);
      requiredDifficulty = "intermediate";
    } else {
      remaining = Math.max(0, position - 1 - completedCounts.advanced);
      requiredDifficulty = "advanced";
    }
  }

  return {
    difficultyKey,
    position,
    remaining,
    requiredDifficulty,
    unlocked: false,
  };
};

// Converts computed unlock requirements into user-facing helper text.
export const getUnlockRequirementText = (
  caseData: Case,
  progress: UserProgress | null,
  cases: Case[] = [],
): string | null => {
  const requirement = getUnlockRequirements(caseData, progress, cases);

  if (requirement.unlocked || requirement.remaining === null) {
    return null;
  }

  const suffix = requirement.remaining === 1 ? "case" : "cases";

  if (requirement.requiredDifficulty === "beginner") {
    return `Complete ${requirement.remaining} more Beginner ${suffix} to unlock`;
  }

  if (requirement.requiredDifficulty === "intermediate") {
    return `Complete ${requirement.remaining} more Intermediate ${suffix} to unlock`;
  }

  if (requirement.requiredDifficulty === "advanced") {
    return `Complete ${requirement.remaining} more Advanced ${suffix} to unlock`;
  }

  return null;
};
