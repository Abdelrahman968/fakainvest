"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  name?: string;
  initial?: string;
  phone?: string | null;
  avatarEmoji?: string;
  notificationsEnabled?: boolean;
  joinedDays?: number;
  streak?: number;
  badge?: string;
  healthScore?: number;
  currentBalance?: number;
  totalInvested?: number;
  pendingRoundUps?: number;
  roundUpMode?: string;
  roundUpEnabled?: boolean;
  frozen?: boolean;
  dailyLimit?: number;
  monthlyLimit?: number;
  perTransactionLimit?: number;
  onlineEnabled?: boolean;
  contactlessEnabled?: boolean;
  internationalEnabled?: boolean;
  atmEnabled?: boolean;
  points?: number;
  level?: number;
  badges?: any[];
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  refreshUser: () => Promise<void>;
  updateRoundUpSettings: (enabled: boolean, mode: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signOut: async () => {},
  setUser: () => {},
  refreshUser: async () => {},
  updateRoundUpSettings: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");

      if (res.ok) {
        const data = await res.json();

        if (data.user) {
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email,
            displayName:
              data.user.name || data.user.displayName || data.user.email,
            name: data.user.name,
            initial: data.user.initial,
            phone: data.user.phone,
            avatarEmoji: data.user.avatarEmoji,
            notificationsEnabled: data.user.notificationsEnabled,
            joinedDays: data.user.joinedDays,
            streak: data.user.streak,
            badge: data.user.badge,
            healthScore: data.user.healthScore,
            currentBalance: data.user.currentBalance,
            totalInvested: data.user.totalInvested,
            pendingRoundUps: data.user.pendingRoundUps,
            roundUpMode: data.user.roundUpMode,
            roundUpEnabled: data.user.roundUpEnabled,
            frozen: data.user.frozen,
            dailyLimit: data.user.dailyLimit,
            monthlyLimit: data.user.monthlyLimit,
            perTransactionLimit: data.user.perTransactionLimit,
            onlineEnabled: data.user.onlineEnabled,
            contactlessEnabled: data.user.contactlessEnabled,
            internationalEnabled: data.user.internationalEnabled,
            atmEnabled: data.user.atmEnabled,
            points: data.user.points,
            level: data.user.level,
            badges: data.user.badges,
          };
          setUser(authUser);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("[Auth] Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    await fetchCurrentUser();
  }, [fetchCurrentUser]);

  const updateRoundUpSettings = useCallback(
    async (enabled: boolean, mode: string) => {
      try {
        const res = await fetch("/api/user/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roundUpEnabled: enabled, roundUpMode: mode }),
        });

        if (res.ok) {
          await refreshUser();
        }
      } catch (error) {
        console.error("Failed to update RoundUp settings:", error);
      }
    },
    [refreshUser],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCurrentUser();
    }, 0);
    return () => clearTimeout(timeout);
  }, [fetchCurrentUser]);

  const signOut = useCallback(async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch (error) {
      console.error("Sign out error:", error);
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut,
        setUser,
        refreshUser,
        updateRoundUpSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
