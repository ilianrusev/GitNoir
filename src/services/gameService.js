// Mock data service - handles all game data locally without backend
import casesData from "../data/cases.json";
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const STORAGE_KEYS = {
  USER: "git_quest_user",
  PROGRESS: "git_quest_progress",
  LEADERBOARD: "git_quest_leaderboard",
};
const USERS_COLLECTION = "users";
const googleProvider = new GoogleAuthProvider();

// Generate a simple UUID
const generateId = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Get all cases
export const getCases = () => {
  return casesData.cases;
};

// Get a single case by ID
export const getCaseById = (caseId) => {
  return casesData.cases.find((c) => c.id === caseId);
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  return userData ? JSON.parse(userData) : null;
};

const persistUserProfile = async (user) => {
  if (!user?.id) return;

  const userDocRef = doc(db, USERS_COLLECTION, user.id);
  await setDoc(
    userDocRef,
    {
      display_name: user.username,
      email: user.email || "",
      reputation: user.reputation ?? 0,
      completed_cases: user.completed_cases ?? [],
      case_progress: user.case_progress ?? {},
      created_at: user.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { merge: true },
  );
};

// Save user to localStorage
export const saveUser = (user, options = {}) => {
  const { persistProfile = true } = options;
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  updateLeaderboard(user);

  if (persistProfile) {
    void persistUserProfile(user);
  }
};

// Sync Firebase auth user with local game profile
export const syncUserFromFirebaseUser = async (firebaseUser, options = {}) => {
  if (!firebaseUser) {
    localStorage.removeItem(STORAGE_KEYS.USER);
    return null;
  }

  const { password = "", displayName = "", persistProfile = false } =
    options;
  const normalizedDisplayName = displayName.trim();
  const storedUser = getCurrentUser();
  const userDocRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
  const userSnapshot = await getDoc(userDocRef);
  const dbUser = userSnapshot.exists() ? userSnapshot.data() : null;
  const shouldPersistProfile = persistProfile || !dbUser;

  const defaultUsername =
    firebaseUser.displayName ||
    (firebaseUser.email ? firebaseUser.email.split("@")[0] : "Detective");

  const syncedUser = {
    ...storedUser,
    id: firebaseUser.uid,
    username:
      normalizedDisplayName ||
      dbUser?.display_name ||
      storedUser?.username ||
      defaultUsername,
    email: firebaseUser.email || storedUser?.email || "",
    password: storedUser?.password || password,
    reputation: dbUser?.reputation ?? storedUser?.reputation ?? 0,
    completed_cases:
      dbUser?.completed_cases ?? storedUser?.completed_cases ?? [],
    case_progress: dbUser?.case_progress ?? storedUser?.case_progress ?? {},
    created_at:
      dbUser?.created_at || storedUser?.created_at || new Date().toISOString(),
  };

  saveUser(syncedUser, { persistProfile: shouldPersistProfile });
  return syncedUser;
};

// Register a new user
export const registerUser = async (username, email, password) => {
  try {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    if (username.trim()) {
      await updateProfile(credentials.user, {
        displayName: username.trim(),
      });
    }

    return await syncUserFromFirebaseUser(credentials.user, {
      password,
      displayName: username,
      persistProfile: true,
    });
  } catch (error) {
    const registrationErrors = {
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/network-request-failed":
        "Network error. Check your connection and try again.",
    };

    const message =
      registrationErrors[error.code] ||
      "Registration failed. Please try again.";

    throw new Error(message);
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    return await syncUserFromFirebaseUser(credentials.user, {
      password,
      persistProfile: false,
    });
  } catch (error) {
    const loginErrors = {
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/invalid-credential": "Invalid email or password.",
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Invalid email or password.",
      "auth/too-many-requests": "Too many attempts. Please try again later.",
      "auth/network-request-failed":
        "Network error. Check your connection and try again.",
    };

    const message =
      loginErrors[error.code] ||
      "Login failed. Check your credentials and try again.";

    throw new Error(message);
  }
};

// Login or register user with Google
export const loginWithGoogleUser = async () => {
  try {
    const credentials = await signInWithPopup(auth, googleProvider);
    const additionalUserInfo = getAdditionalUserInfo(credentials);
    const syncedUser = await syncUserFromFirebaseUser(credentials.user, {
      displayName: credentials.user.displayName || "",
      persistProfile: additionalUserInfo?.isNewUser ?? false,
    });

    return {
      user: syncedUser,
      isNewUser: additionalUserInfo?.isNewUser ?? false,
    };
  } catch (error) {
    const isCoopWindowCheckIssue =
      typeof error?.message === "string" &&
      error.message.includes("Cross-Origin-Opener-Policy");
    const shouldUseRedirectFallback =
      isCoopWindowCheckIssue ||
      error?.code === "auth/popup-blocked" ||
      error?.code === "auth/operation-not-supported-in-this-environment";

    if (shouldUseRedirectFallback) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }

    const googleLoginErrors = {
      "auth/popup-closed-by-user": "Google sign-in was canceled.",
      "auth/popup-blocked": "Popup was blocked. Allow popups and try again.",
      "auth/cancelled-popup-request": "Google sign-in was canceled.",
      "auth/account-exists-with-different-credential":
        "An account already exists with this email using a different sign-in method.",
      "auth/network-request-failed":
        "Network error. Check your connection and try again.",
    };

    const message =
      googleLoginErrors[error.code] ||
      "Google sign-in failed. Please try again.";

    throw new Error(message);
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    const logoutErrors = {
      "auth/network-request-failed":
        "Network error while logging out. Please try again.",
    };

    const message =
      logoutErrors[error.code] || "Logout failed. Please try again.";
    throw new Error(message);
  } finally {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
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

  saveUser(user);
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

    saveUser(user);

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
    saveUser(user);
  }
};
