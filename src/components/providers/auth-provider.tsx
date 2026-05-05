"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getSession } from "next-auth/react";
import { User, getStoredToken, getStoredUser, setAuthData, clearAuthData } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }

    // Sync with NextAuth session (for OAuth logins)
    async function syncSession() {
      try {
        const session = await getSession();
        if (session?.backendToken && session?.user) {
          const userData: User = {
            email: session.user.email,
            role: (session.user.role as any) || "STUDENT",
            firstName: session.user.firstName || "",
            lastName: session.user.lastName || "",
          };
          setAuthData(session.backendToken, userData);
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to sync session:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (!storedUser) {
      syncSession();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (token: string, userData: User) => {
    setAuthData(token, userData);
    setUser(userData);
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

