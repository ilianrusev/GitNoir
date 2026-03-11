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
  GUEST_USER: "unauth_user",
};
const USERS_COLLECTION = "users";
const googleProvider = new GoogleAuthProvider();
let runtimeUserSnapshot = null;
const PASSWORD_POLICY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

const createGuestUser = () => ({
  id: "guest-user",
  username: "Detective",
  email: "",
  password: "",
  reputation: 0,
  completed_cases: [],
  case_progress: {},
  created_at: new Date().toISOString(),
  is_guest: true,
});

const normalizeUser = (user) => {
  if (!user || typeof user !== "object") {
    return null;
  }

  return {
    ...user,
    reputation: Number(user.reputation ?? 0),
    completed_cases: Array.isArray(user.completed_cases)
      ? user.completed_cases
      : [],
    case_progress:
      user.case_progress && typeof user.case_progress === "object"
        ? user.case_progress
        : {},
  };
};

const readStorageUser = (key) => {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    return normalizeUser(JSON.parse(raw));
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

const mergeCaseProgress = (baseProgress = {}, incomingProgress = {}) => {
  const merged = { ...baseProgress };

  Object.entries(incomingProgress).forEach(([caseId, incomingCaseProgress]) => {
    const normalizedIncoming = normalizeUser({
      case_progress: { [caseId]: incomingCaseProgress },
    })?.case_progress?.[caseId];

    if (!normalizedIncoming) return;

    const existing = merged[caseId];
    if (!existing) {
      merged[caseId] = normalizedIncoming;
      return;
    }

    const existingStep = Number(existing.current_step ?? 0);
    const incomingStep = Number(normalizedIncoming.current_step ?? 0);
    const existingEarned = Number(existing.earned_points ?? 0);
    const incomingEarned = Number(normalizedIncoming.earned_points ?? 0);

    const shouldUseIncoming =
      incomingStep > existingStep ||
      (incomingStep === existingStep && incomingEarned > existingEarned);

    if (shouldUseIncoming) {
      merged[caseId] = normalizedIncoming;
    }
  });

  return merged;
};

const mergeCompletedCases = (first = [], second = []) =>
  Array.from(new Set([...(first || []), ...(second || [])]));

const getOrCreateGuestUser = () => {
  const storedGuest = readStorageUser(STORAGE_KEYS.GUEST_USER);
  const guestUser = storedGuest || createGuestUser();

  localStorage.setItem(STORAGE_KEYS.GUEST_USER, JSON.stringify(guestUser));
  runtimeUserSnapshot = guestUser;
  return guestUser;
};

export const PASSWORD_POLICY_MESSAGE =
  "Password must be at least 8 symbols long and include at least one uppercase letter, one lowercase letter, and one number.";

export const isPasswordPolicyValid = (password = "") =>
  PASSWORD_POLICY_REGEX.test(password);

export const setRuntimeUserSnapshot = (user) => {
  runtimeUserSnapshot = user ?? null;
};

export const isGuestUser = (user) => Boolean(user?.is_guest);

export const getCurrentUser = () => {
  const storedAuthUser = readStorageUser(STORAGE_KEYS.USER);
  if (storedAuthUser) {
    runtimeUserSnapshot = storedAuthUser;
    return storedAuthUser;
  }

  const storedGuestUser = readStorageUser(STORAGE_KEYS.GUEST_USER);
  if (storedGuestUser) {
    runtimeUserSnapshot = storedGuestUser;
    return storedGuestUser;
  }

  if (runtimeUserSnapshot) {
    return runtimeUserSnapshot;
  }

  return getOrCreateGuestUser();
};

const persistUserProfile = async (user) => {
  if (!user?.id) return;

  const reputation = user.reputation ?? 0;

  const userDocRef = doc(db, USERS_COLLECTION, user.id);
  await setDoc(
    userDocRef,
    {
      display_name: user.username,
      email: user.email || "",
      reputation,
      completed_cases: user.completed_cases ?? [],
      case_progress: user.case_progress ?? {},
      created_at: user.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { merge: true },
  );
};

export const saveUser = (user, options = {}) => {
  const { persistProfile = true, clearGuestUser = false } = options;
  const normalizedUser = normalizeUser(user);
  if (!normalizedUser) return;

  runtimeUserSnapshot = normalizedUser;

  if (isGuestUser(normalizedUser)) {
    localStorage.setItem(STORAGE_KEYS.GUEST_USER, JSON.stringify(normalizedUser));
    return;
  }

  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(normalizedUser));
  if (clearGuestUser) {
    localStorage.removeItem(STORAGE_KEYS.GUEST_USER);
  }

  if (persistProfile) {
    void persistUserProfile(normalizedUser);
  }
};

export const syncUserFromFirebaseUser = async (firebaseUser, options = {}) => {
  if (!firebaseUser) {
    localStorage.removeItem(STORAGE_KEYS.USER);
    return getOrCreateGuestUser();
  }

  const {
    password = "",
    displayName = "",
    persistProfile = false,
    mergeGuestProgress = false,
  } = options;
  const normalizedDisplayName = displayName.trim();
  const storedAuthUser = readStorageUser(STORAGE_KEYS.USER);
  const guestUser = mergeGuestProgress
    ? readStorageUser(STORAGE_KEYS.GUEST_USER)
    : null;
  const userDocRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
  const userSnapshot = await getDoc(userDocRef);
  const dbUser = userSnapshot.exists() ? userSnapshot.data() : null;
  const needsReputationMigration = !dbUser || dbUser.reputation === undefined;
  const shouldPersistProfile = persistProfile || needsReputationMigration;

  const dbCompletedCases = Array.isArray(dbUser?.completed_cases)
    ? dbUser.completed_cases
    : [];
  const storedCompletedCases = storedAuthUser?.completed_cases ?? [];
  const guestCompletedCases = guestUser?.completed_cases ?? [];
  const completedCases = mergeCompletedCases(
    mergeCompletedCases(dbCompletedCases, storedCompletedCases),
    guestCompletedCases,
  );

  const mergedCaseProgress = mergeCaseProgress(
    mergeCaseProgress(dbUser?.case_progress ?? {}, storedAuthUser?.case_progress ?? {}),
    guestUser?.case_progress ?? {},
  );

  completedCases.forEach((completedCaseId) => {
    if (mergedCaseProgress[completedCaseId]) {
      delete mergedCaseProgress[completedCaseId];
    }
  });

  const baseReputation = Number(
    dbUser?.reputation ?? storedAuthUser?.reputation ?? 0,
  );
  const guestReputation = Number(guestUser?.reputation ?? 0);
  const reputation = Math.max(baseReputation, guestReputation);

  const defaultUsername =
    firebaseUser.displayName ||
    (firebaseUser.email ? firebaseUser.email.split("@")[0] : "Detective");

  const syncedUser = {
    ...storedAuthUser,
    id: firebaseUser.uid,
    is_guest: false,
    username:
      normalizedDisplayName ||
      dbUser?.display_name ||
      storedAuthUser?.username ||
      defaultUsername,
    email: firebaseUser.email || storedAuthUser?.email || "",
    password: storedAuthUser?.password || password,
    reputation,
    completed_cases: completedCases,
    case_progress: mergedCaseProgress,
    created_at:
      dbUser?.created_at ||
      storedAuthUser?.created_at ||
      new Date().toISOString(),
  };

  saveUser(syncedUser, {
    persistProfile: shouldPersistProfile,
    clearGuestUser: mergeGuestProgress,
  });
  return syncedUser;
};

export const registerUser = async (username, email, password) => {
  if (!isPasswordPolicyValid(password)) {
    throw new Error(PASSWORD_POLICY_MESSAGE);
  }

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
      mergeGuestProgress: true,
    });
  } catch (error) {
    const registrationErrors = {
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/weak-password": "Password must be at least 8 characters.",
      "auth/network-request-failed":
        "Network error. Check your connection and try again.",
    };

    const message =
      registrationErrors[error.code] ||
      "Registration failed. Please try again.";

    throw new Error(message);
  }
};

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

export const loginWithGoogleUser = async () => {
  try {
    const credentials = await signInWithPopup(auth, googleProvider);
    const additionalUserInfo = getAdditionalUserInfo(credentials);
    const isNewUser = additionalUserInfo?.isNewUser ?? false;
    const syncedUser = await syncUserFromFirebaseUser(credentials.user, {
      displayName: credentials.user.displayName || "",
      persistProfile: isNewUser,
      mergeGuestProgress: isNewUser,
    });

    return {
      user: syncedUser,
      isNewUser,
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
    runtimeUserSnapshot = getOrCreateGuestUser();
  }
};
