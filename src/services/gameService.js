// Mock data service - handles all game data locally without backend
import casesData from "../data/cases.json";
import { getCurrentUser, saveUser } from "./authService";

const STORAGE_KEYS = {
  LEADERBOARD: "git_quest_leaderboard",
};

// Get all cases
export const getCases = () => {
  return casesData.cases;
};

// Get a single case by ID
export const getCaseById = (caseId) => {
  return casesData.cases.find((c) => c.id === caseId);
};

const saveGameUser = (user, options = {}) => {
  saveUser(user, options);
  updateLeaderboard(user);
};

// Get user progress
export const getUserProgress = () => {
  const user = getCurrentUser();
  if (!user) return null;

  return {
    user_id: user.id,
    reputation: user.reputation,
    completed_cases: user.completed_cases,
    case_progress: user.case_progress,
  };
};

// Check if case is unlocked
export const isCaseUnlocked = (caseId) => {
  const caseData = getCaseById(caseId);
  const user = getCurrentUser();

  if (!caseData) return false;
  if (caseData.unlock_cost === 0) return true;
  if (!user) return false;
  if (user.completed_cases.includes(caseId)) return true;
  if (user.case_progress[caseId]) return true;

  return user.reputation >= caseData.unlock_cost;
};

// Unlock a case
export const unlockCase = (caseId) => {
  const caseData = getCaseById(caseId);
  const user = getCurrentUser();

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
  if (user.reputation < caseData.unlock_cost) {
    throw new Error(
      `Not enough reputation. Need ${caseData.unlock_cost}, have ${user.reputation}`,
    );
  }

  // Deduct cost and unlock
  user.reputation -= caseData.unlock_cost;
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
  const user = getCurrentUser();

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
      user.reputation += pointsEarned;
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
  let leaderboard = getLeaderboard();

  // Find and update or add user
  const existingIndex = leaderboard.findIndex(
    (entry) => entry.username === user.username,
  );

  if (existingIndex >= 0) {
    leaderboard[existingIndex] = {
      username: user.username,
      reputation: user.reputation,
      cases_solved: user.completed_cases.length,
    };
  } else {
    leaderboard.push({
      username: user.username,
      reputation: user.reputation,
      cases_solved: user.completed_cases.length,
    });
  }

  // Sort by reputation and assign ranks
  leaderboard.sort((a, b) => b.reputation - a.reputation);
  leaderboard = leaderboard.slice(0, 10).map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
};

// Get leaderboard
export const getLeaderboard = () => {
  const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
  return data ? JSON.parse(data) : [];
};

// Reset all progress (for testing)
export const resetProgress = () => {
  const user = getCurrentUser();
  if (user) {
    user.reputation = 0;
    user.completed_cases = [];
    user.case_progress = {};
    saveGameUser(user);
  }
};
