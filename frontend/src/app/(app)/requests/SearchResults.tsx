"use client";
import { Button } from "@/components/ui/Button";
import type { SearchedUsers } from "@/types/requests";
import { useSendFriendRequest } from "@/hooks/useSendFriendRequest";

const relationshipUI: Record<
  SearchedUsers["relationshipStatus"],
  {
    label: string;
    variant: "primary" | "outline";
    disabled: boolean;
  }
> = {
  NONE: {
    label: "Send",
    variant: "primary",
    disabled: false,
  },
  PENDING: {
    label: "Requested",
    variant: "outline",
    disabled: true,
  },
  FRIENDS: {
    label: "Already Friends",
    variant: "outline",
    disabled: true,
  },
};

export const SearchResults = ({
  users,
  searched,
  isLoading,
}: {
  searched: string;
  isLoading: boolean;
  users: SearchedUsers[];
}) => {
  const sendRequestMutation = useSendFriendRequest(searched);

  if (isLoading) {
    return <div className="py-3 text-sm text-muted">Searching...</div>;
  }

  if (users.length === 0) {
    return <div className="py-3 text-sm text-muted">No users found</div>;
  }

  return (
    <>
      {users.map((user) => {
        const state = relationshipUI[user.relationshipStatus];
        const mutationPending =
          sendRequestMutation.isPending &&
          user.id === sendRequestMutation.variables;

        return (
          <div key={user.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500 shrink-0" />
              <h6 className="text-sm font-medium">{user.username}</h6>
            </div>

            <Button
              className="px-3 py-0.5 disabled:opacity-90"
              variant={state.variant}
              disabled={state.disabled || mutationPending}
              onClick={() => sendRequestMutation.mutate(user.id)}
            >
              {state.label}
            </Button>
          </div>
        );
      })}
    </>
  );
};
