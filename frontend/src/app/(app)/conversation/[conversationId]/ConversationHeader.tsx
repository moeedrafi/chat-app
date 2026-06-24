"use client";
import { api } from "@/lib/api";
import type { User } from "@/types/user";
import { EllipsisVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const ConversationHeader = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["user-information", conversationId],
    queryFn: async () => {
      const req = await api.get<User>(`/conversation/${conversationId}/user`);
      return req.data;
    },
  });

  return (
    <div className="bg-bg p-4 flex items-center justify-between gap-2 border-b border-color">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-red-500" />
        <div>{isLoading ? "Loading..." : data?.username}</div>
      </div>

      <button>
        <EllipsisVertical className="w-5 h-5 text-muted-foreground hover:text-text" />
      </button>
    </div>
  );
};
