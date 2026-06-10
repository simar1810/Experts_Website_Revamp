"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import {
  clearClientAuth,
  consumeAuthSyncFromHash,
  getClientAuthToken,
  getClientAuthUser,
  setClientAuth,
  setClientAuthUser,
} from "@/lib/clientAuthStorage";

const AuthContext = createContext();

/** Hydrate auth before child useEffects run (avoids chat socket starting without a token). */
function getInitialClientAuth() {
  if (typeof window === "undefined") {
    return { token: null, user: null, isAuthenticated: false };
  }
  consumeAuthSyncFromHash();
  const token = getClientAuthToken();
  const user = getClientAuthUser();
  return {
    token,
    user,
    isAuthenticated: Boolean(token),
  };
}

/** Same-tab relative path only; blocks protocol-relative and absolute URLs. */
function isSafeInternalPath(p) {
  if (typeof p !== "string" || p.length > 2000) return false;
  if (!p.startsWith("/") || p.startsWith("//")) return false;
  if (p.includes("://")) return false;
  return true;
}

function getBrowserReturnPath() {
  if (typeof window === "undefined") return "/";
  const path = window.location.pathname + (window.location.search || "");
  return path || "/";
}

/**
 * Sets the post-auth return URL when opening login/register.
 * After 401, the user is sent to `/` but the ref still holds the page they were on;
 * opening the modal from the home header must not overwrite that with `/`.
 */
function applyReturnPathForModalOpen(ref) {
  const next = getBrowserReturnPath();
  const existing = ref.current;
  if (
    next === "/" &&
    existing &&
    existing !== "/" &&
    isSafeInternalPath(existing)
  ) {
    return;
  }
  ref.current = next;
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const initialAuth = getInitialClientAuth();
  const [token, setToken] = useState(initialAuth.token);
  const [user, setUser] = useState(initialAuth.user);
  const [isAuthenticated, setIsAuthenticated] = useState(
    initialAuth.isAuthenticated,
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const returnPathAfterAuthRef = useRef(null);
  /** Passed from Login (number not registered) → GetStarted signup form pre-fill. Cleared after consume. */
  const signupDraftRef = useRef(null);

  const refreshUser = useCallback(async () => {
    const storedToken = getClientAuthToken();
    if (!storedToken) return;
    try {
      const data = await fetchAPI("/experts/client/me", undefined, "GET");
      const snap = data?.client_snapshot;
      if (snap && typeof snap === "object") {
        setClientAuthUser(snap);
        setUser(snap);
      }
    } catch (e) {
      console.error("refreshUser failed", e);
    }
  }, []);

  useEffect(() => {
    const synced = consumeAuthSyncFromHash();
    const storedToken = synced?.token || getClientAuthToken();
    const storedUser = synced?.user || getClientAuthUser();

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      if (synced?.token) {
        setClientAuth(synced.token, synced.user || undefined);
      }
    }

    if (storedUser) {
      setUser(storedUser);
    }

    if (storedToken) {
      refreshUser();
    }

    const handleUnauthorized = () => {
      returnPathAfterAuthRef.current = getBrowserReturnPath();
      logout();
      router.push("/");
      setIsLoginModalOpen(true);
    };
    window.addEventListener("auth_unauthorized", handleUnauthorized);
    setIsAuthLoading(false);
    return () =>
      window.removeEventListener("auth_unauthorized", handleUnauthorized);
  }, [router, refreshUser]);

  const login = (jwtToken, userData) => {
    setClientAuth(jwtToken, userData || null);
    if (userData) {
      setUser(userData);
    }
    setToken(jwtToken);
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
    refreshUser();
  };

  const logout = () => {
    clearClientAuth();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const openLoginModal = useCallback(() => {
    applyReturnPathForModalOpen(returnPathAfterAuthRef);
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = useCallback(() => {
    applyReturnPathForModalOpen(returnPathAfterAuthRef);
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  }, []);

  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const presetSignupDraft = useCallback((phone, countryCode = "IN") => {
    const p = typeof phone === "string" ? phone.trim() : "";
    signupDraftRef.current =
      p.length > 0 ? { phone: p, countryCode: countryCode || "IN" } : null;
  }, []);

  const consumeSignupDraft = useCallback(() => {
    const v = signupDraftRef.current;
    signupDraftRef.current = null;
    return v;
  }, []);

  const consumeReturnPathAfterAuth = useCallback(() => {
    const raw = returnPathAfterAuthRef.current;
    returnPathAfterAuthRef.current = null;
    if (raw && isSafeInternalPath(raw)) return raw;
    return "/";
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isAuthLoading,
        login,
        logout,
        openLoginModal,
        closeLoginModal,
        isLoginModalOpen,
        openRegisterModal,
        closeRegisterModal,
        isRegisterModalOpen,
        refreshUser,
        consumeReturnPathAfterAuth,
        presetSignupDraft,
        consumeSignupDraft,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
