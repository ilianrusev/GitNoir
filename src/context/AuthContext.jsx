import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import {
  getCurrentUser,
  loginUser,
  loginWithGoogleUser,
  registerUser,
  logoutUser,
  setRuntimeUserSnapshot,
  syncUserFromFirebaseUser,
} from "../services/authService";

const AuthContext = createContext(null);
const MIN_AUTH_LOADING_MS = 250;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authCheckStartedAt = Date.now();
    let loadingTimeout;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        const syncedUser = await syncUserFromFirebaseUser(firebaseUser);
        setUser(syncedUser);
      } catch {
        setUser(getCurrentUser());
      } finally {
        const elapsed = Date.now() - authCheckStartedAt;
        const remaining = Math.max(MIN_AUTH_LOADING_MS - elapsed, 0);

        loadingTimeout = setTimeout(() => {
          setLoading(false);
        }, remaining);
      }
    });

    return () => {
      unsubscribe();
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, []);

  useEffect(() => {
    setRuntimeUserSnapshot(user);
  }, [user]);

  const login = async (email, password) => {
    const userData = await loginUser(email, password);
    setUser(userData);
    return userData;
  };

  const register = async (username, email, password) => {
    const userData = await registerUser(username, email, password);
    setUser(userData);
    return userData;
  };

  const loginWithGoogle = async () => {
    const result = await loginWithGoogleUser();
    if (result?.user) {
      setUser(result.user);
    }
    return result;
  };

  const logout = async () => {
    await logoutUser();
    setUser(getCurrentUser());
  };

  const refreshUser = () => {
    const updatedUser = getCurrentUser();
    setUser(updatedUser);
    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
