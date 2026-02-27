"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("client_token");
        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
        }

        const handleUnauthorized = () => {
            logout();
        };
        window.addEventListener('auth_unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth_unauthorized', handleUnauthorized);
    }, []);

    const login = (jwtToken) => {
        localStorage.setItem("client_token", jwtToken);
        setToken(jwtToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("client_token");
        setToken(null);
        setIsAuthenticated(false);
    };

    const openLoginModal = () => {
        setIsRegisterModalOpen(false);
        setIsLoginModalOpen(true);
    };
    const closeLoginModal = () => setIsLoginModalOpen(false);

    const openRegisterModal = () => {
        setIsLoginModalOpen(false);
        setIsRegisterModalOpen(true);
    };
    const closeRegisterModal = () => setIsRegisterModalOpen(false);

    return (
        <AuthContext.Provider value={{
            token,
            isAuthenticated,
            login,
            logout,
            openLoginModal,
            closeLoginModal,
            isLoginModalOpen,
            openRegisterModal,
            closeRegisterModal,
            isRegisterModalOpen
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);