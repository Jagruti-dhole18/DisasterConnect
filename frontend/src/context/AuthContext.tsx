import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import api from "../lib/api";
import type { User, UserRole } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  refreshUser: () => Promise<User | null>;
  switchRole: (role: UserRole) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  organizationName?: string;
  registrationId?: string;
  skills?: string[];
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "dc_token";
const USER_KEY = "dc_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;

    try {
      const raw = window.localStorage.getItem(USER_KEY);

      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;

    return window.localStorage.getItem(TOKEN_KEY);
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (user) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (!token || user) return;

    const loadSession = async () => {
      try {
        const { data } = await api.get("/auth/me");

        if (data?.success && data?.user) {
          setUser(data.user as User);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    };

    void loadSession();
  }, [token, user]);

  const login = async (email: string, password: string): Promise<User> => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    if (!data?.success) {
      throw new Error(data?.message || "Login failed");
    }

    const nextUser = data.user as User;

    setToken(data.token);

    window.localStorage.setItem(TOKEN_KEY, data.token);

    setUser(nextUser);

    return nextUser;
  };

  const register = async (data: RegisterData): Promise<User> => {
    const { data: response } = await api.post("/auth/register", {
      name: data.name,

      email: data.email,

      password: data.password,

      role: data.role,

      phone: data.phone,

      organizationName: data.organizationName,

      registrationId: data.registrationId,

      skills: data.skills,
    });

    if (!response?.success) {
      throw new Error(response?.message || "Registration failed");
    }

    const nextUser = response.user as User;

    // Save token after direct registration

    setToken(response.token);

    window.localStorage.setItem(TOKEN_KEY, response.token);

    setUser(nextUser);

    return nextUser;
  };

  const logout = () => {
    setToken(null);

    setUser(null);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);

      window.localStorage.removeItem(USER_KEY);
    }
  };

  const updateUser = async (patch: Partial<User>) => {
    if (!user) return;

    try {
      const { data } = await api.put("/auth/me", patch);

      if (data?.success && data?.user) {
        const updated = data.user as User;

        setUser(updated);

        return;
      }
    } catch {
      // fallback
    }

    const updated = {
      ...user,
      ...patch,
    };

    setUser(updated);
  };

  const refreshUser = useCallback(async (): Promise<User | null> => {
    if (!token) return null;

    try {
      const { data } = await api.get("/auth/me");

      if (data?.success && data?.user) {
        const refreshedUser = data.user as User;

        setUser(refreshedUser);

        return refreshedUser;
      }
    } catch {
      // ignore refresh error
    }

    return null;
  }, [token]);

  const switchRole = (role: UserRole) => {
    if (!user) return;

    void updateUser({ role });
  };

  return (
    <AuthContext.Provider
      value={{
        user,

        token,

        login,

        register,

        logout,

        updateUser,

        refreshUser,

        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}
