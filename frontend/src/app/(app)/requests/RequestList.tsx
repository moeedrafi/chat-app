"use client";
import { api } from "@/lib/api";
import { RequestCard } from "./RequestCard";
import { useQuery } from "@tanstack/react-query";
import type { PendingRequest } from "@/types/friends";

export const RequestList = () => {
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["pending-request"],
    queryFn: async () => {
      const req = await api.get<PendingRequest[]>(`/friend-request/pending`);
      return req.data;
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <p>Loading...</p>; // TODO: SKELTON LOADER

  return (
    <>
      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-light flex items-center justify-center text-xl">
            📭
          </div>
          <p className="text-sm text-muted">No pending requests</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 rounded-lg">
          {requests.map((request) => (
            <RequestCard request={request} key={request.id} />
          ))}
        </div>
      )}
    </>
  );
};
