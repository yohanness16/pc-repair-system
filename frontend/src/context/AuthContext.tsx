import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types";
import { register as registerApi, login as loginApi } from "../api/authApi";
import type { AxiosInstance } from "axios";

interface AuthContextType {
  user: User | null;
  error: string;
  login: (
    username: string,
    password: string,
    apiClient: AxiosInstance
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    role: "admin",
    department: "IT Administration",
    email: "admin@bank.com",
  },
  {
    id: "2",
    username: "tech1",
    role: "it_staff",
    department: "IT Support",
    email: "tech1@bank.com",
  },
  {
    id: "3",
    username: "tech2",
    role: "it_staff",
    department: "IT Support",
    email: "tech2@bank.com",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("bankIT_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string,
    apiClient: AxiosInstance
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const userData = { username, password };
      const foundUser = await loginApi(apiClient, userData);
      console.log(userData);

      setUser(foundUser);
      localStorage.setItem("bankIT_user", JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    } catch (error: any) {
      setError(error.detail);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bankIT_user");
  };

  const value = {
    user,
    error,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
