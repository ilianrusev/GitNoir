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
};
const USERS_COLLECTION = "users";
const googleProvider = new GoogleAuthProvider();

export const getCurrentUser = () => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  return userData ? JSON.parse(userData) : null;
};

const persistUserProfile = async (user) => {
  if (!user?.id) return;

  const availableReputation =
    user.available_reputation ?? user.reputation ?? 0;
  const earnedReputation = user.earned_reputation ?? user.reputation ?? 0;

  const userDocRef = doc(db, USERS_COLLECTION, user.id);
  await setDoc(
    userDocRef,
    {
      display_name: user.username,
      email: user.email || "",
      earned_reputation: earnedReputation,
      available_reputation: availableReputation,
      completed_cases: user.completed_cases ?? [],
      case_progress: user.case_progress ?? {},
      created_at: user.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { merge: true },
  );
};

export const saveUser = (user, options = {}) => {
  const { persistProfile = true } = options;
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

  if (persistProfile) {
    void persistUserProfile(user);
  }
};

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
  const needsReputationMigration =
    !dbUser ||
    dbUser.earned_reputation === undefined ||
    dbUser.available_reputation === undefined;
  const shouldPersistProfile = persistProfile || needsReputationMigration;

  const availableReputation =
    dbUser?.available_reputation ??
    dbUser?.reputation ??
    storedUser?.available_reputation ??
    storedUser?.reputation ??
    0;
  const earnedReputation =
    dbUser?.earned_reputation ??
    dbUser?.reputation ??
    storedUser?.earned_reputation ??
    storedUser?.reputation ??
    0;

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
    earned_reputation: earnedReputation,
    available_reputation: availableReputation,
    reputation: availableReputation,
    completed_cases:
      dbUser?.completed_cases ?? storedUser?.completed_cases ?? [],
    case_progress: dbUser?.case_progress ?? storedUser?.case_progress ?? {},
    created_at:
      dbUser?.created_at || storedUser?.created_at || new Date().toISOString(),
  };

  saveUser(syncedUser, { persistProfile: shouldPersistProfile });
  return syncedUser;
};

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
