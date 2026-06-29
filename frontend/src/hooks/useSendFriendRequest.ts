import { queryKeys } from "@/lib/query-key";
import { sendFriendRequest } from "@/services/requests";
import type { SearchedUsers } from "@/types/requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSendFriendRequest = (searched: string) => {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.searchUsers(searched);

  return useMutation({
    mutationFn: sendFriendRequest,
    onMutate: async (userId: number) => {
      await queryClient.cancelQueries({ queryKey });
      const previousUsers = queryClient.getQueryData<SearchedUsers[]>(queryKey);

      queryClient.setQueryData<SearchedUsers[]>(queryKey, (old = []) =>
        old.map((u) =>
          u.id === userId ? { ...u, relationshipStatus: "PENDING" } : u,
        ),
      );

      return { previousUsers };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(queryKey, context?.previousUsers);
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey });
    },
  });
};
