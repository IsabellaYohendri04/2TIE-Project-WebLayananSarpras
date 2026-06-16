import { useAuth } from "../context/AuthContext";

export function usePeminjamanBase() {
  const { user } = useAuth();
  const base = user?.role === "janitor" ? "/janitor" : "/peminjam";
  return { base, isJanitor: user?.role === "janitor" };
}
