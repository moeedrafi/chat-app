"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { FriendRequestStatus } from "@/types/enums";

type RequestResponse = {
  id: string;
  receiver: string;
  senderId: number;
  status: "pending";
};

type SearchedUsers = {
  id: number;
  email: string;
  username: string;
  friendStatus: FriendRequestStatus;
};

export const RequestModal = ({
  isLoading,
  users,
  searched,
}: {
  isLoading: boolean;
  users: SearchedUsers[];
  searched: string;
}) => {
  const queryClient = useQueryClient();
  const sendRequestMutation = useMutation({
    mutationFn: (userId: number) =>
      api.post<unknown, RequestResponse>("friend-request", { userId }),
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
            u.id === userId
              ? { ...u, friendStatus: FriendRequestStatus.PENDING }
              : u,
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

  return (
    <div className="absolute w-full px-3 py-2 bg-bg ring-1 ring-color rounded-b-lg divide-y divide-color">
      {isLoading ? (
        <div className="py-3 text-sm text-muted">Searching...</div>
      ) : users.length === 0 ? (
        <div className="py-3 text-sm text-muted">No users found</div>
      ) : (
        users.map((user) => (
          <div key={user.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500 shrink-0" />
              <h6 className="text-sm font-medium">{user.username}</h6>
            </div>

            <Button
              className="px-3 py-0.5 disabled:opacity-90"
              onClick={() => sendRequestMutation.mutate(user.id)}
              disabled={
                user.friendStatus === FriendRequestStatus.PENDING ||
                sendRequestMutation.isPending
              }
              variant={
                user.friendStatus === FriendRequestStatus.PENDING
                  ? "outline"
                  : "primary"
              }
            >
              {user.friendStatus === FriendRequestStatus.PENDING
                ? "Requested"
                : "Send"}
            </Button>
          </div>
        ))
      )}
    </div>
  );
};
