// Mock data service - handles all game data locally without backend
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
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
  LEADERBOARD: "git_quest_leaderboard_cache",
};

const LEADERBOARD_CACHE_TTL_MS = 5 * 60 * 1000;
const USERS_COLLECTION = "users";

const leaderboardMemoryCache = {
  data: null,
  fetchedAt: 0,
  pendingRequest: null,
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
  updateLeaderboardCacheFromUser(user);
};

const normalizeReputation = (user) => {
  if (!user) return user;

  user.reputation = user.reputation ?? 0;

  return user;
};

// Get user progress
export const getUserProgress = () => {
  const user = normalizeReputation(getCurrentUser());
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
  const user = normalizeReputation(getCurrentUser());

  if (!caseData) return false;
  if (caseData.unlock_cost === 0) return true;
  if (!user) return false;
  if (user.completed_cases.includes(caseId)) return true;
  if (user.case_progress[caseId]) return true;

  return user.reputation >= caseData.unlock_cost;
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

const normalizeLeaderboard = (entries = []) => {
  const sorted = [...entries]
    .map((entry) => ({
      username: entry.username,
      reputation: Number(entry.reputation ?? 0),
      cases_solved: Number(entry.cases_solved ?? 0),
    }))
    .filter((entry) => entry.reputation !== 10)
    .sort((a, b) => b.reputation - a.reputation)
    .slice(0, 10);

  return sorted.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
};

const readLeaderboardCache = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.data)) return null;
    return {
      data: normalizeLeaderboard(parsed.data),
      fetchedAt: Number(parsed.fetchedAt ?? 0),
    };
  } catch {
    return null;
  }
};

const writeLeaderboardCache = (data, fetchedAt = Date.now()) => {
  const normalizedData = normalizeLeaderboard(data);
  leaderboardMemoryCache.data = normalizedData;
  leaderboardMemoryCache.fetchedAt = fetchedAt;

  localStorage.setItem(
    STORAGE_KEYS.LEADERBOARD,
    JSON.stringify({ data: normalizedData, fetchedAt }),
  );

  return normalizedData;
};

const fetchLeaderboardFromUsersTable = async () => {
  const usersRef = collection(db, USERS_COLLECTION);
  const leaderboardQuery = query(usersRef, orderBy("reputation", "desc"), limit(10));
  const snapshot = await getDocs(leaderboardQuery);

  const entries = snapshot.docs.map((userDoc) => {
    const userData = userDoc.data();
    const email = userData.email || "";
    const fallbackName = email.includes("@")
      ? email.split("@")[0]
      : "Detective";

    return {
      username: userData.display_name || fallbackName,
      reputation: Number(userData.reputation ?? 0),
      cases_solved: Array.isArray(userData.completed_cases)
        ? userData.completed_cases.length
        : 0,
    };
  });

  return normalizeLeaderboard(entries);
};

const updateLeaderboardCacheFromUser = (user) => {
  const normalizedUser = normalizeReputation(user);
  const cached =
    leaderboardMemoryCache.data || readLeaderboardCache()?.data || [];
  let leaderboard = [...cached];

  // Find and update or add user
  const existingIndex = leaderboard.findIndex(
    (entry) => entry.username === normalizedUser.username,
  );

  if (existingIndex >= 0) {
    leaderboard[existingIndex] = {
      username: normalizedUser.username,
      reputation: normalizedUser.reputation,
      cases_solved: normalizedUser.completed_cases.length,
    };
  } else {
    leaderboard.push({
      username: normalizedUser.username,
      reputation: normalizedUser.reputation,
      cases_solved: normalizedUser.completed_cases.length,
    });
  }

  writeLeaderboardCache(leaderboard, Date.now());
};

// Get leaderboard
export const getLeaderboard = async ({ forceRefresh = false } = {}) => {
  const now = Date.now();

  if (!forceRefresh && leaderboardMemoryCache.data) {
    const memoryFresh =
      now - leaderboardMemoryCache.fetchedAt < LEADERBOARD_CACHE_TTL_MS;
    if (memoryFresh) {
      return leaderboardMemoryCache.data;
    }
  }

  const storedCache = readLeaderboardCache();
  if (!forceRefresh && storedCache?.data) {
    const storedFresh = now - storedCache.fetchedAt < LEADERBOARD_CACHE_TTL_MS;
    if (storedFresh) {
      leaderboardMemoryCache.data = storedCache.data;
      leaderboardMemoryCache.fetchedAt = storedCache.fetchedAt;
      return storedCache.data;
    }
  }

  if (leaderboardMemoryCache.pendingRequest) {
    return leaderboardMemoryCache.pendingRequest;
  }

  leaderboardMemoryCache.pendingRequest = fetchLeaderboardFromUsersTable()
    .then((entries) => writeLeaderboardCache(entries, Date.now()))
    .catch((error) => {
      if (storedCache?.data) {
        return storedCache.data;
      }
      throw error;
    })
    .finally(() => {
      leaderboardMemoryCache.pendingRequest = null;
    });

  return leaderboardMemoryCache.pendingRequest;
};
