import { UserRole } from "./api";

export interface User {
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("authUser");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setAuthData(token: string, user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem("authToken", token);
  localStorage.setItem("authUser", JSON.stringify(user));
}

export function clearAuthData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
}

export function setAccountType(type: "talent" | "company") {
  if (typeof window === "undefined") return;
  localStorage.setItem("accountType", type);
}

export function getAccountType(): "talent" | "company" {
  if (typeof window === "undefined") return "talent";
  return (localStorage.getItem("accountType") as "talent" | "company") || "talent";
}
