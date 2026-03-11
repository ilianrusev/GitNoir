const DIFFICULTY_KEYS = {
  beginner: "beginner",
  intermediate: "intermediate",
  advanced: "advanced",
};

const normalizeDifficulty = (difficulty) =>
  String(difficulty || "")
    .trim()
    .toLowerCase();

const sortCasesWithinTier = (cases = []) =>
  [...cases].sort((firstCase, secondCase) =>
    String(firstCase.id || "").localeCompare(
      String(secondCase.id || ""),
      undefined,
      { numeric: true, sensitivity: "base" },
    ),
  );

const getCasesByDifficulty = (cases = []) => {
  const grouped = {
    [DIFFICULTY_KEYS.beginner]: [],
    [DIFFICULTY_KEYS.intermediate]: [],
    [DIFFICULTY_KEYS.advanced]: [],
  };

  cases.forEach((caseData) => {
    const difficultyKey = normalizeDifficulty(caseData?.difficulty);
    if (!grouped[difficultyKey]) return;
    grouped[difficultyKey].push(caseData);
  });

  return {
    [DIFFICULTY_KEYS.beginner]: sortCasesWithinTier(
      grouped[DIFFICULTY_KEYS.beginner],
    ),
    [DIFFICULTY_KEYS.intermediate]: sortCasesWithinTier(
      grouped[DIFFICULTY_KEYS.intermediate],
    ),
    [DIFFICULTY_KEYS.advanced]: sortCasesWithinTier(
      grouped[DIFFICULTY_KEYS.advanced],
    ),
  };
};

export const getCompletedTierCounts = (progress, cases = []) => {
  const completedCaseIds = new Set(progress?.completed_cases || []);
  const counts = {
    [DIFFICULTY_KEYS.beginner]: 0,
    [DIFFICULTY_KEYS.intermediate]: 0,
    [DIFFICULTY_KEYS.advanced]: 0,
  };

  cases.forEach((caseData) => {
    if (!completedCaseIds.has(caseData.id)) return;

    const difficultyKey = normalizeDifficulty(caseData.difficulty);
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
export const getTierUnlockCounts = (progress, cases = []) => {
  const completedCounts = getCompletedTierCounts(progress, cases);
  const hasIntermediateGate =
    completedCounts.beginner >= 2 || completedCounts.intermediate > 0;
  const hasAdvancedGate =
    completedCounts.intermediate >= 2 || completedCounts.advanced > 0;

  return {
    [DIFFICULTY_KEYS.beginner]: completedCounts.beginner + 1,
    [DIFFICULTY_KEYS.intermediate]: hasIntermediateGate
      ? completedCounts.intermediate + 1
      : 0,
    [DIFFICULTY_KEYS.advanced]: hasAdvancedGate
      ? completedCounts.advanced + 1
      : 0,
  };
};

// Returns case position inside its own difficulty tier.
export const getTierPosition = (caseData, cases = []) => {
  const difficultyKey = normalizeDifficulty(caseData?.difficulty);
  const groupedCases = getCasesByDifficulty(cases);
  const tierCases = groupedCases[difficultyKey] || [];

  const position = tierCases.findIndex((entry) => entry.id === caseData?.id);

  return {
    difficultyKey,
    position: position >= 0 ? position + 1 : null,
  };
};

// Computes unlock state and remaining requirement for a specific case.
export const getUnlockRequirements = (caseData, progress, cases = []) => {
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
  let requiredDifficulty = null;

  if (difficultyKey === DIFFICULTY_KEYS.beginner) {
    remaining = Math.max(0, position - (completedCounts.beginner + 1));
    requiredDifficulty = DIFFICULTY_KEYS.beginner;
  } else if (difficultyKey === DIFFICULTY_KEYS.intermediate) {
    if (position === 1) {
      remaining = Math.max(0, 2 - completedCounts.beginner);
      requiredDifficulty = DIFFICULTY_KEYS.beginner;
    } else {
      remaining = Math.max(0, position - 1 - completedCounts.intermediate);
      requiredDifficulty = DIFFICULTY_KEYS.intermediate;
    }
  } else if (difficultyKey === DIFFICULTY_KEYS.advanced) {
    if (position === 1) {
      remaining = Math.max(0, 2 - completedCounts.intermediate);
      requiredDifficulty = DIFFICULTY_KEYS.intermediate;
    } else {
      remaining = Math.max(0, position - 1 - completedCounts.advanced);
      requiredDifficulty = DIFFICULTY_KEYS.advanced;
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
export const getUnlockRequirementText = (caseData, progress, cases = []) => {
  const requirement = getUnlockRequirements(caseData, progress, cases);

  if (requirement.unlocked || requirement.remaining === null) {
    return null;
  }

  const suffix = requirement.remaining === 1 ? "case" : "cases";

  if (requirement.requiredDifficulty === DIFFICULTY_KEYS.beginner) {
    return `Complete ${requirement.remaining} more Beginner ${suffix} to unlock`;
  }

  if (requirement.requiredDifficulty === DIFFICULTY_KEYS.intermediate) {
    return `Complete ${requirement.remaining} more Intermediate ${suffix} to unlock`;
  }

  if (requirement.requiredDifficulty === DIFFICULTY_KEYS.advanced) {
    return `Complete ${requirement.remaining} more Advanced ${suffix} to unlock`;
  }

  return null;
};
