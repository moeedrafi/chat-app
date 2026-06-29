"use client";
import toast from "react-hot-toast";
import { queryKeys } from "@/lib/query-key";
import { Button } from "@/components/ui/Button";
import type { PendingRequest } from "@/types/friends";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, rejectFriendRequest } from "@/services/requests";

export const RequestCard = ({ request }: { request: PendingRequest }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      action,
    }: {
      id: number;
      action: "accept" | "delete";
    }) => {
      return action === "accept"
        ? acceptFriendRequest(id)
        : rejectFriendRequest(id);
    },
    onMutate: async (variables: {
      id: number;
      action: "accept" | "delete";
    }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.pendingRequest(),
      });

      const previousUsers = queryClient.getQueryData<PendingRequest[]>(
        queryKeys.pendingRequest(),
      );

      queryClient.setQueryData<PendingRequest[]>(
        queryKeys.pendingRequest(),
        (old = []) => old.filter((u) => u.sender.id !== variables.id),
      );

      return { previousUsers };
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(
        queryKeys.pendingRequest(),
        context?.previousUsers,
      );
      toast.error("Something went wrong");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friends() });

      return queryClient.invalidateQueries({
        queryKey: queryKeys.pendingRequest(),
      });
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.action === "accept" ? "Request accepted" : "Request declined",
      );
    },
  });

  return (
    <div className="bg-light px-5 py-4 flex flex-col justify-between gap-4 rounded-xl border border-color">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-dark" />

        <div className="flex flex-col min-w-0">
          <span className="font-medium text-sm truncate">
            {request.sender.username}
          </span>
          <span className="text-xs text-muted">Wants to connect</span>
        </div>
      </div>

      <div className="flex gap-2 text-sm">
        <Button
          disabled={mutation.isPending}
          onClick={() =>
            mutation.mutate({ id: request.sender.id, action: "accept" })
          }
        >
          Accept
        </Button>

        <Button
          variant="ghost"
          disabled={mutation.isPending}
          onClick={() =>
            mutation.mutate({ id: request.sender.id, action: "delete" })
          }
        >
          Decline
        </Button>
      </div>
    </div>
  );
};
