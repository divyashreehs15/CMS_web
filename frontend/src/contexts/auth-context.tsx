"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type UserRole = "jailer" | "family";

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials
const DEMO_CREDENTIALS = {
  jailer: {
    email: "karthik@demo.com",
    password: "karthik123",
    user: {
      id: "1",
      name: "Karthik Y H",
      role: "jailer" as UserRole,
      email: "karthik@demo.com"
    }
  },
  family: {
    email: "suhaib@demo.com",
    password: "suhaib123",
    user: {
      id: "2",
      name: "Suhaib King",
      role: "family" as UserRole,
      email: "suhaib@demo.com"
    }
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials against demo data
    const jailerCreds = DEMO_CREDENTIALS.jailer;
    const familyCreds = DEMO_CREDENTIALS.family;

    if (email === jailerCreds.email && password === jailerCreds.password) {
      setUser(jailerCreds.user);
      localStorage.setItem("user", JSON.stringify(jailerCreds.user));
      setIsLoading(false);
      return true;
    }

    if (email === familyCreds.email && password === familyCreds.password) {
      setUser(familyCreds.user);
      localStorage.setItem("user", JSON.stringify(familyCreds.user));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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