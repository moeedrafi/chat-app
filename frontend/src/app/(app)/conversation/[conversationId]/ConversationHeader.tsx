"use client";
import { useEffect, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { socket } from "@/lib/socket";
import type { User } from "@/types/user";

export const ConversationHeader = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const [isOnline, setIsOnline] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["user-information", conversationId],
    queryFn: async () => {
      const req = await api.get<User>(`/conversation/${conversationId}/user`);
      return req.data;
    },
  });

  useEffect(() => {
    if (!data?.id) return;

    socket.emitWithAck("getOnlineStatus", data.id).then((isOnline: boolean) => {
      setIsOnline(isOnline);
    });

    const handleOnline = ({ userId }: { userId: number }) => {
      if (userId === data.id) setIsOnline(true);
    };

    const handleOffline = ({ userId }: { userId: number }) => {
      if (userId === data.id) setIsOnline(false);
    };

    socket.on("userOnline", handleOnline);
    socket.on("userOffline", handleOffline);

    return () => {
      socket.off("userOnline", handleOnline);
      socket.off("userOffline", handleOffline);
    };
  }, [data?.id]);

  return (
    <div className="bg-bg p-4 flex items-center justify-between gap-2 border-b border-color">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-full bg-red-500" />
        <div>
          <h6>{isLoading ? "Loading..." : data?.username}</h6>
          <span
            className={`text-xs ${isOnline ? "text-green-500" : "text-red-500"}`}
          >
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <button>
        <EllipsisVertical className="w-5 h-5 text-muted-foreground hover:text-text" />
      </button>
    </div>
  );
};
