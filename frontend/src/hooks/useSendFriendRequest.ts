import { api } from "@/lib/api";
import type { SearchedUsers } from "@/types/requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSendFriendRequest = (searched: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => api.post("friend-request", { userId }),
    onMutate: async (userId: number) => {
      // 1. Cancel any outgoing refetch
      await queryClient.cancelQueries({
        queryKey: ["search-users", searched],
      });

      // 2. Snapshot previous state
      const previousUsers = queryClient.getQueryData<SearchedUsers[]>([
        "search-users",
        searched,
      ]);

      // 3. Optimistically update UI
      queryClient.setQueryData<SearchedUsers[]>(
        ["search-users", searched],
        (old = []) =>
          old.map((u) =>
            u.id === userId ? { ...u, relationshipStatus: "PENDING" } : u,
          ),
      );

      return { previousUsers };
    },
    // If the mutation fails,
    // use the result returned from onMutate to roll back
    onError: (err, _, context) => {
      queryClient.setQueryData(
        ["search-users", searched],
        context?.previousUsers,
      );
    },
    // Always refetch after error or success:
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: ["search-users", searched],
      });
    },
  });
};
