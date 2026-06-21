import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import type { PendingRequest } from "@/types/friends";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const RequestCard = ({ request }: { request: PendingRequest }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["request"],
    mutationFn: async ({
      id,
      type,
    }: {
      id: number;
      type: "accept" | "delete";
    }) => {
      if (type === "accept") {
        return api.post(`friend-request/${id}`, {});
      } else {
        return api.delete(`friend-request/${id}`);
      }
    },
    onMutate: async (variables: { id: number; type: "accept" | "delete" }) => {
      // 1. Cancel any outgoing refetch
      await queryClient.cancelQueries({
        queryKey: ["pending-request"],
      });

      // 2. Snapshot previous state
      const previousUsers = queryClient.getQueryData<PendingRequest[]>([
        "pending-request",
      ]);

      // 3. Optimistically update UI
      queryClient.setQueryData<PendingRequest[]>(
        ["pending-request"],
        (old = []) => old.filter((u) => u.sender.id !== variables.id),
      );

      return { previousUsers };
    },
    // If the mutation fails,
    // use the result returned from onMutate to roll back
    onError: (err, _, context) => {
      queryClient.setQueryData(["pending-request"], context?.previousUsers);
      toast.error("Something went wrong");
    },
    // Always refetch after error or success:
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: ["pending-request"],
      });
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.type === "accept" ? "Request accepted" : "Request declined",
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
            mutation.mutate({ id: request.sender.id, type: "accept" })
          }
        >
          Accept
        </Button>

        <Button
          variant="ghost"
          disabled={mutation.isPending}
          onClick={() =>
            mutation.mutate({ id: request.sender.id, type: "delete" })
          }
        >
          Decline
        </Button>
      </div>
    </div>
  );
};
