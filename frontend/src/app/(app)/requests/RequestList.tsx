"use client";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { PendingRequest } from "@/types/friends";
import { useQuery } from "@tanstack/react-query";

const requests = [
  { id: 1, username: "john_doe" },
  { id: 2, username: "lorem11111111111111111111111111111111111111111111" },
  { id: 3, username: "john_doe" },
  { id: 4, username: "john_doe" },
];

export const RequestList = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ["pending-request"],
    queryFn: async () => {
      const req = await api.get<PendingRequest[]>(`/friend-request/pending`);
      return req.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      {requests.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-light flex items-center justify-center text-xl">
            📭
          </div>
          <p className="text-sm text-muted">No pending requests</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 rounded-lg">
        {requests.map((request) => (
          <div
            key={request.id}
            className="bg-light px-5 py-4 flex flex-col justify-between gap-4 rounded-xl border border-color"
          >
            {/* USER INFO */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-dark" />

              <div className="flex flex-col min-w-0">
                <span className="font-medium text-sm truncate">
                  {request.username}
                </span>
                <span className="text-xs text-muted">Wants to connect</span>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2 text-sm">
              <Button>Accept</Button>

              <Button
                variant="destructive"
                className="text-muted hover:text-text"
              >
                Decline
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
