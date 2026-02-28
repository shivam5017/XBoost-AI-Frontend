"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api, User } from "@/utils/api";

interface DashboardContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

export function DashboardProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.auth.profile()
      .then(setUser)
      .catch(() => router.push("/auth/login"))
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await api.auth.logout();
    router.push("/auth/login");
  };

  return (
    <DashboardContext.Provider value={{ user, loading, logout }}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => useContext(DashboardContext);