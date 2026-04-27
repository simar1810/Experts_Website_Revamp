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

const AuthContext = createContext();

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
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const returnPathAfterAuthRef = useRef(null);

  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem("client_token");
    if (!storedToken) return;
    try {
      const data = await fetchAPI("/experts/client/me", undefined, "GET");
      const snap = data?.client_snapshot;
      if (snap && typeof snap === "object") {
        localStorage.setItem("client_data", JSON.stringify(snap));
        setUser(snap);
      }
    } catch (e) {
      console.error("refreshUser failed", e);
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("client_token");
    const storedUser = localStorage.getItem("client_data");

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user data", e);
      }
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
    return () =>
      window.removeEventListener("auth_unauthorized", handleUnauthorized);
  }, [router, refreshUser]);

  const login = (jwtToken, userData) => {
    localStorage.setItem("client_token", jwtToken);
    if (userData) {
      localStorage.setItem("client_data", JSON.stringify(userData));
      setUser(userData);
    }
    setToken(jwtToken);
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
    refreshUser();
  };

  const logout = () => {
    localStorage.clear();
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
