// Mock data service - handles all game data locally without backend
import { getCurrentUser, saveUser } from "./authService";

const caseModules = import.meta.glob("../data/cases/**/*.json", {
  eager: true,
});

const casesData = Object.values(caseModules)
  .map((module) => module.default)
  .sort((a, b) => {
    const first = Number(String(a.id || "").replace(/[^0-9]/g, ""));
    const second = Number(String(b.id || "").replace(/[^0-9]/g, ""));
    return first - second;
  });

const STORAGE_KEYS = {
  LEADERBOARD: "git_quest_leaderboard",
};

// Get all cases
export const getCases = () => {
  return casesData;
};

// Get a single case by ID
export const getCaseById = (caseId) => {
  return casesData.find((c) => c.id === caseId);
};

const saveGameUser = (user, options = {}) => {
  saveUser(user, options);
  updateLeaderboard(user);
};

const normalizeReputation = (user) => {
  if (!user) return user;

  const availableReputation =
    user.available_reputation ?? user.reputation ?? 0;
  const earnedReputation = user.earned_reputation ?? user.reputation ?? 0;

  user.available_reputation = availableReputation;
  user.earned_reputation = earnedReputation;
  user.reputation = availableReputation;

  return user;
};

// Get user progress
export const getUserProgress = () => {
  const user = normalizeReputation(getCurrentUser());
  if (!user) return null;

  return {
    user_id: user.id,
    reputation: user.available_reputation,
    available_reputation: user.available_reputation,
    earned_reputation: user.earned_reputation,
    completed_cases: user.completed_cases,
    case_progress: user.case_progress,
  };
};

// Check if case is unlocked
export const isCaseUnlocked = (caseId) => {
  const caseData = getCaseById(caseId);
  const user = normalizeReputation(getCurrentUser());

  if (!caseData) return false;
  if (caseData.unlock_cost === 0) return true;
  if (!user) return false;
  if (user.completed_cases.includes(caseId)) return true;
  if (user.case_progress[caseId]) return true;

  return user.available_reputation >= caseData.unlock_cost;
};

// Unlock a case
export const unlockCase = (caseId) => {
  const caseData = getCaseById(caseId);
  const user = normalizeReputation(getCurrentUser());

  if (!caseData) throw new Error("Case not found");
  if (!user) throw new Error("Not authenticated");

  // Already completed or in progress
  if (user.completed_cases.includes(caseId)) {
    return { message: "Case already completed", unlocked: true };
  }
  if (user.case_progress[caseId]) {
    return { message: "Case already unlocked", unlocked: true };
  }

  // Check if can afford
  if (user.available_reputation < caseData.unlock_cost) {
    throw new Error(
      `Not enough reputation. Need ${caseData.unlock_cost}, have ${user.available_reputation}`,
    );
  }

  // Deduct cost and unlock
  user.available_reputation -= caseData.unlock_cost;
  user.reputation = user.available_reputation;
  user.case_progress[caseId] = {
    current_step: 0,
    completed_steps: [],
    earned_points: 0,
  };

  saveGameUser(user);
  return { message: "Case unlocked successfully", unlocked: true };
};

// Validate a command
export const validateCommand = (
  caseId,
  stepIndex,
  command,
  isReplay = false,
) => {
  const caseData = getCaseById(caseId);
  const user = normalizeReputation(getCurrentUser());

  if (!caseData) throw new Error("Case not found");
  if (!user) throw new Error("Not authenticated");
  if (stepIndex >= caseData.steps.length) throw new Error("Invalid step index");

  const step = caseData.steps[stepIndex];
  const userCommand = command.trim().toLowerCase();

  // Check if this case was already completed (replay mode = no points)
  const isAlreadyCompleted = user.completed_cases.includes(caseId);

  // Check if command matches any expected command
  let isCorrect = false;
  for (const expected of step.expected_commands) {
    if (
      userCommand === expected.toLowerCase() ||
      userCommand.startsWith(expected.toLowerCase())
    ) {
      isCorrect = true;
      break;
    }
  }

  if (isCorrect) {
    // Initialize progress if not exists (for replay tracking)
    if (!user.case_progress[caseId]) {
      user.case_progress[caseId] = {
        current_step: 0,
        completed_steps: [],
        earned_points: 0,
        is_replay: isAlreadyCompleted,
      };
    }

    const caseProgress = user.case_progress[caseId];
    let pointsEarned = 0;

    // Award points ONLY if step not already completed AND not a replay of completed case
    if (
      !caseProgress.completed_steps.includes(stepIndex) &&
      !isAlreadyCompleted
    ) {
      pointsEarned = step.points;
      caseProgress.completed_steps.push(stepIndex);
      caseProgress.earned_points += pointsEarned;
      user.earned_reputation += pointsEarned;
      user.available_reputation += pointsEarned;
      user.reputation = user.available_reputation;
    } else {
      // Still track progress for replay but no points
      if (!caseProgress.completed_steps.includes(stepIndex)) {
        caseProgress.completed_steps.push(stepIndex);
      }
    }

    const nextStep = stepIndex + 1;
    const caseCompleted = nextStep >= caseData.steps.length;

    if (caseCompleted) {
      // Mark case as completed (only adds if not already there)
      if (!user.completed_cases.includes(caseId)) {
        user.completed_cases.push(caseId);
      }
      delete user.case_progress[caseId];
    } else {
      caseProgress.current_step = nextStep;
    }

    saveGameUser(user);

    // Different feedback for replay
    let feedback;
    if (caseCompleted) {
      feedback = isAlreadyCompleted
        ? "Case replayed! No additional reputation earned."
        : "Case solved! Your reputation precedes you.";
    } else {
      feedback = isAlreadyCompleted
        ? "Correct! (Replay mode - no points)"
        : "Correct! Well done, detective.";
    }

    return {
      is_correct: true,
      feedback,
      points_earned: pointsEarned,
      next_step: caseCompleted ? null : nextStep,
      case_completed: caseCompleted,
    };
  } else {
    return {
      is_correct: false,
      feedback: `That's not quite right. Hint: ${step.hint}`,
      points_earned: 0,
      next_step: null,
      case_completed: false,
    };
  }
};

// Update leaderboard
const updateLeaderboard = (user) => {
  const normalizedUser = normalizeReputation(user);
  let leaderboard = getLeaderboard();

  // Find and update or add user
  const existingIndex = leaderboard.findIndex(
    (entry) => entry.username === normalizedUser.username,
  );

  if (existingIndex >= 0) {
    leaderboard[existingIndex] = {
      username: normalizedUser.username,
      earned_reputation: normalizedUser.earned_reputation,
      available_reputation: normalizedUser.available_reputation,
      cases_solved: normalizedUser.completed_cases.length,
    };
  } else {
    leaderboard.push({
      username: normalizedUser.username,
      earned_reputation: normalizedUser.earned_reputation,
      available_reputation: normalizedUser.available_reputation,
      cases_solved: normalizedUser.completed_cases.length,
    });
  }

  // Sort by earned reputation and assign ranks
  leaderboard.sort(
    (a, b) =>
      (b.earned_reputation ?? b.reputation ?? 0) -
      (a.earned_reputation ?? a.reputation ?? 0),
  );
  leaderboard = leaderboard.slice(0, 10).map((entry, index) => ({
    ...entry,
    earned_reputation: entry.earned_reputation ?? entry.reputation ?? 0,
    available_reputation:
      entry.available_reputation ?? entry.reputation ?? 0,
    rank: index + 1,
  }));

  localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
};

// Get leaderboard
export const getLeaderboard = () => {
  const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
  if (!data) return [];

  const parsed = JSON.parse(data);
  return parsed.map((entry) => ({
    ...entry,
    earned_reputation: entry.earned_reputation ?? entry.reputation ?? 0,
    available_reputation: entry.available_reputation ?? entry.reputation ?? 0,
  }));
};

// Reset all progress (for testing)
export const resetProgress = () => {
  const user = normalizeReputation(getCurrentUser());
  if (user) {
    user.available_reputation = 0;
    user.earned_reputation = 0;
    user.reputation = 0;
    user.completed_cases = [];
    user.case_progress = {};
    saveGameUser(user);
  }
};
