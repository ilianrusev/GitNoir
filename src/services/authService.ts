import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import type {
  CaseProgressEntry,
  GoogleLoginResult,
  User,
} from "../types/types";

const STORAGE_KEYS = {
  USER: "git_quest_user",
  GUEST_USER: "unauth_user",
} as const;

const USERS_COLLECTION = "users";
const googleProvider = new GoogleAuthProvider();
let runtimeUserSnapshot: User | null = null;
const PASSWORD_POLICY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

const createGuestUser = (): User => ({
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

const normalizeUser = (user: Partial<User> | null | undefined): User | null => {
  if (!user || typeof user !== "object") {
    return null;
  }

  return {
    ...(user as User),
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

const readStorageUser = (key: string): User | null => {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    return normalizeUser(JSON.parse(raw));
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

const mergeCaseProgress = (
  baseProgress: Record<string, CaseProgressEntry> = {},
  incomingProgress: Record<string, CaseProgressEntry> = {},
): Record<string, CaseProgressEntry> => {
  const merged = { ...baseProgress };

  Object.entries(incomingProgress).forEach(([caseId, incomingCaseProgress]) => {
    const normalizedIncoming = normalizeUser({
      case_progress: { [caseId]: incomingCaseProgress },
    } as Partial<User>)?.case_progress?.[caseId];

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

const mergeCompletedCases = (
  first: string[] = [],
  second: string[] = [],
): string[] => Array.from(new Set([...(first || []), ...(second || [])]));

const getOrCreateGuestUser = (): User => {
  const storedGuest = readStorageUser(STORAGE_KEYS.GUEST_USER);
  const guestUser = storedGuest || createGuestUser();

  localStorage.setItem(STORAGE_KEYS.GUEST_USER, JSON.stringify(guestUser));
  runtimeUserSnapshot = guestUser;
  return guestUser;
};

export const PASSWORD_POLICY_MESSAGE =
  "Password must be at least 8 symbols long and include at least one uppercase letter, one lowercase letter, and one number.";

export const isPasswordPolicyValid = (password = ""): boolean =>
  PASSWORD_POLICY_REGEX.test(password);

export const setRuntimeUserSnapshot = (user: User | null | undefined): void => {
  runtimeUserSnapshot = user ?? null;
};

export const isGuestUser = (user: User | null | undefined): boolean =>
  Boolean(user?.is_guest);

export const getCurrentUser = (): User => {
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

interface PersistUserProfileData {
  display_name: string;
  email: string;
  reputation: number;
  completed_cases: string[];
  case_progress: Record<string, CaseProgressEntry>;
  created_at: string;
  updated_at: string;
}

const persistUserProfile = async (user: User): Promise<void> => {
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
    } satisfies PersistUserProfileData,
    { merge: true },
  );
};

interface SaveUserOptions {
  persistProfile?: boolean;
  clearGuestUser?: boolean;
}

export const saveUser = (
  user: Partial<User> | null | undefined,
  options: SaveUserOptions = {},
): void => {
  const { persistProfile = true, clearGuestUser = false } = options;
  const normalizedUser = normalizeUser(user);
  if (!normalizedUser) return;

  runtimeUserSnapshot = normalizedUser;

  if (isGuestUser(normalizedUser)) {
    localStorage.setItem(
      STORAGE_KEYS.GUEST_USER,
      JSON.stringify(normalizedUser),
    );
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

interface SyncOptions {
  password?: string;
  displayName?: string;
  persistProfile?: boolean;
  mergeGuestProgress?: boolean;
}

export const syncUserFromFirebaseUser = async (
  firebaseUser: FirebaseUser | null,
  options: SyncOptions = {},
): Promise<User> => {
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
    ? (dbUser.completed_cases as string[])
    : [];
  const storedCompletedCases = storedAuthUser?.completed_cases ?? [];
  const guestCompletedCases = guestUser?.completed_cases ?? [];
  const completedCases = mergeCompletedCases(
    mergeCompletedCases(dbCompletedCases, storedCompletedCases),
    guestCompletedCases,
  );

  const mergedCaseProgress = mergeCaseProgress(
    mergeCaseProgress(
      (dbUser?.case_progress as Record<string, CaseProgressEntry>) ?? {},
      storedAuthUser?.case_progress ?? {},
    ),
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

  const syncedUser: User = {
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
  } as User;

  saveUser(syncedUser, {
    persistProfile: shouldPersistProfile,
    clearGuestUser: mergeGuestProgress,
  });
  return syncedUser;
};

interface FirebaseAuthError {
  code: string;
  message: string;
}

export const registerUser = async (
  username: string,
  email: string,
  password: string,
): Promise<User> => {
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
    const registrationErrors: Record<string, string> = {
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/weak-password": "Password must be at least 8 characters.",
      "auth/network-request-failed":
        "Network error. Check your connection and try again.",
    };

    const message =
      registrationErrors[(error as FirebaseAuthError).code] ||
      "Registration failed. Please try again.";

    throw new Error(message);
  }
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<User> => {
  try {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    return await syncUserFromFirebaseUser(credentials.user, {
      password,
      persistProfile: false,
    });
  } catch (error) {
    const loginErrors: Record<string, string> = {
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/invalid-credential": "Invalid email or password.",
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Invalid email or password.",
      "auth/too-many-requests": "Too many attempts. Please try again later.",
      "auth/network-request-failed":
        "Network error. Check your connection and try again.",
    };

    const message =
      loginErrors[(error as FirebaseAuthError).code] ||
      "Login failed. Check your credentials and try again.";

    throw new Error(message);
  }
};

export const loginWithGoogleUser =
  async (): Promise<GoogleLoginResult | null> => {
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
      const typedError = error as FirebaseAuthError;
      const isCoopWindowCheckIssue =
        typeof typedError?.message === "string" &&
        typedError.message.includes("Cross-Origin-Opener-Policy");
      const shouldUseRedirectFallback =
        isCoopWindowCheckIssue ||
        typedError?.code === "auth/popup-blocked" ||
        typedError?.code ===
          "auth/operation-not-supported-in-this-environment";

      if (shouldUseRedirectFallback) {
        await signInWithRedirect(auth, googleProvider);
        return null;
      }

      const googleLoginErrors: Record<string, string> = {
        "auth/popup-closed-by-user": "Google sign-in was canceled.",
        "auth/popup-blocked":
          "Popup was blocked. Allow popups and try again.",
        "auth/cancelled-popup-request": "Google sign-in was canceled.",
        "auth/account-exists-with-different-credential":
          "An account already exists with this email using a different sign-in method.",
        "auth/network-request-failed":
          "Network error. Check your connection and try again.",
      };

      const message =
        googleLoginErrors[typedError.code] ||
        "Google sign-in failed. Please try again.";

      throw new Error(message);
    }
  };

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    const logoutErrors: Record<string, string> = {
      "auth/network-request-failed":
        "Network error while logging out. Please try again.",
    };

    const message =
      logoutErrors[(error as FirebaseAuthError).code] ||
      "Logout failed. Please try again.";
    throw new Error(message);
  } finally {
    localStorage.removeItem(STORAGE_KEYS.USER);
    runtimeUserSnapshot = getOrCreateGuestUser();
  }
};
