"use client";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

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

        const handleUnauthorized = () => {
            logout();
        };
        window.addEventListener('auth_unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth_unauthorized', handleUnauthorized);
    }, []);

    const login = (jwtToken, userData) => {
        localStorage.setItem("client_token", jwtToken);
        if (userData) {
            localStorage.setItem("client_data", JSON.stringify(userData));
            setUser(userData);
        }
        setToken(jwtToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("client_token");
        localStorage.removeItem("client_data");
        setToken(null);
        setUser(null); 
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
            user,
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