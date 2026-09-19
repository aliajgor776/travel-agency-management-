import { trpc } from "@/lib/trpc";
import { useEffect } from "react";

export function useAuth() {
  const meQuery = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      void meQuery.refetch();
    },
  });

  useEffect(() => {
    if (meQuery.error) {
      console.error("[Auth] Failed to load current user", meQuery.error);
    }
  }, [meQuery.error]);

  return {
    user: meQuery.data ?? null,
    loading: meQuery.isLoading,
    isAuthenticated: Boolean(meQuery.data),
    logout: async () => {
      await logoutMutation.mutateAsync();
    },
  };
}
