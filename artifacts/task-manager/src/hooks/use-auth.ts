import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string | null;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
}

const AUTH_QUERY_KEY = ["/api/auth/user"] as const;

async function fetchCurrentUser(): Promise<{ user: AuthUser | null }> {
  const res = await fetch("/api/auth/user", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: fetchCurrentUser,
    staleTime: 30_000,
    retry: false,
  });

  const user = data?.user ?? null;
  const isAuthenticated = user != null;

  async function login(email: string, password: string): Promise<void> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message ?? "Login failed");
    }
    await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
  }

  async function register(data: RegisterData): Promise<void> {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { message?: string }).message ?? "Registration failed");
    }
    await queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
  }

  async function logout(): Promise<void> {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    queryClient.setQueryData(AUTH_QUERY_KEY, { user: null });
    queryClient.clear();
  }

  return { user, isLoading, isAuthenticated, login, register, logout };
}
